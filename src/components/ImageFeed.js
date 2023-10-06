import { useState, useRef, useCallback, useEffect } from "react";
import ImgFeedCard from "./ImgFeedCard";
import { useDispatch } from "react-redux";
import { setLoading } from "../features/display/displaySlice";
import useAuth from "../hooks/useAuth";
import { useInfiniteQuery } from "react-query";
import { getMultiplePosts } from "../features/posts/postApiRoutes";
import { FadeLoader } from "react-spinners";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FadeLoaderStyled from "./FadeLoaderStyled";

const FOLLOWFEED_REGEX = /^\/$/;
const EXPLORE_REGEX = /^\/explore/i;

const ImageFeed = ({
  postData,
  isError,
  error,
  isLoading,
  isFetching,
  hasNextPage,
  fetchNextPage,
  queryKey,
  homeFeed = false,
}) => {
  const { authenticatedUser } = useAuth();

  const observer = useRef();
  const lastPostRef = useCallback(
    (post) => {
      if (isFetching || isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          console.log("has more pages: ");
          fetchNextPage();
          console.log("near last post");
        }
      });

      if (post) observer.current.observe(post);
    },
    [isFetching, isLoading, hasNextPage]
  );

  const flattenedFeedData = postData?.pages?.reduce((acc, page) => {
    return [...acc, ...page.posts];
  }, []);

  const content = flattenedFeedData?.map((post, i) => {
    if (flattenedFeedData.length - 2 === i) {
      return (
        <ImgFeedCard
          key={post._id}
          post={post}
          ref={lastPostRef}
          queryKey={queryKey}
        />
      );
    }
    return <ImgFeedCard key={post._id} post={post} queryKey={queryKey} />;
  });

  const noFollowingAuthenticated = (
    <>
      <p className='margin-btm-5p'>
        To create your very own feed, follow a user who has made a post.
      </p>
    </>
  );

  const noFollowingUnauthenticated = (
    <>
      <p className='margin-btm-5p'>
        To see your feed, <Link to='/accounts/login'>log in</Link> or{" "}
        <Link to='/accounts/emailsignup'>sign up</Link>{" "}
      </p>
    </>
  );

  const noFollowingDiv = (
    <div className='no-following-div flex-container flex-column flex-align-center margin-top-3 padding-1'>
      <h2 className='margin-btm-1'>No Feed Yet...</h2>
      {authenticatedUser
        ? noFollowingAuthenticated
        : noFollowingUnauthenticated}
      <p>
        Hop on over to the <Link to='/explore'>Explore Page</Link> to find posts
        from our community.
      </p>
    </div>
  );

  return (
    <section className='img-feed-container'>
      <>
        {content}
        {!isFetching &&
          !isLoading &&
          !content?.length &&
          homeFeed &&
          noFollowingDiv}
        {(isFetching || isLoading) && <FadeLoaderStyled />}
        {isError && error.message}
      </>
    </section>
  );
};

export default ImageFeed;
