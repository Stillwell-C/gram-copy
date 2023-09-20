import { useState, useRef, useCallback, useEffect } from "react";
import ImgFeedCard from "./ImgFeedCard";
import { useDispatch } from "react-redux";
import { setLoading } from "../features/display/displaySlice";
import useAuth from "../hooks/useAuth";
import { useInfiniteQuery } from "react-query";
import { getMultiplePosts } from "../features/posts/postApiRoutes";
import { FadeLoader } from "react-spinners";
import { Link, useLocation, useNavigate } from "react-router-dom";

const FOLLOWFEED_REGEX = /^\/$/;
const EXPLORE_REGEX = /^\/explore/i;

const ImageFeed = () => {
  const { authenticatedUser } = useAuth();
  const { pathname } = useLocation();

  const dispatch = useDispatch();

  const postLoadLimit = 5;

  //Set different queries for the following feed and the explore page
  const displayFollowingFeed = FOLLOWFEED_REGEX.test(pathname) ? true : false;
  const queryKey = FOLLOWFEED_REGEX.test(pathname) ? "posts" : "exploreFeed";
  const enabled = EXPLORE_REGEX.test(pathname)
    ? true
    : authenticatedUser
    ? true
    : false;

  const {
    data: postData,
    isLoading,
    isError,
    error,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: ({ pageParam = 1 }) =>
      getMultiplePosts({
        pageParam,
        limit: postLoadLimit,
        followingFeed: displayFollowingFeed,
      }),
    refetchOnWindowFocus: false,
    enabled,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.page < lastPage.totalPages) return lastPage.page + 1;
      return false;
    },
  });

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading(true));
      return;
    }
    dispatch(setLoading(false));
  }, [isLoading]);

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
      return <ImgFeedCard key={post._id} post={post} ref={lastPostRef} />;
    }
    return <ImgFeedCard key={post._id} post={post} />;
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
        {!isFetching && !isLoading && !content?.length && noFollowingDiv}
        {(isFetching || isLoading) && (
          <div className='loading-div'>
            <FadeLoader cssOverride={{ scale: "0.5" }} color='#333' />
          </div>
        )}
        {isError && error.message}
      </>
    </section>
  );
};

export default ImageFeed;
