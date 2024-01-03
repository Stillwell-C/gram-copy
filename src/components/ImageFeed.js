import { useRef, useCallback } from "react";
import { Link } from "react-router-dom";

import ImgFeedCard from "./ImgFeedCard";
import FadeLoaderStyled from "./FadeLoaderStyled";

import useAuth from "../hooks/useAuth";

const ImageFeed = ({
  postData,
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
          fetchNextPage();
        }
      });

      if (post) observer.current.observe(post);
    },
    [isFetching, isLoading, hasNextPage]
  );

  const flattenedFeedData = postData?.pages?.reduce((acc, page) => {
    if (!page?.posts?.length) return acc;

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
        <Link to='/accounts/emailsignup'>sign up</Link>.{" "}
      </p>
    </>
  );

  const noFollowingDiv = (
    <div className='feed-msg flex-container flex-column flex-align-center margin-top-3 padding-1'>
      <h2 className='margin-btm-1'>No Feed Yet...</h2>
      {authenticatedUser
        ? noFollowingAuthenticated
        : noFollowingUnauthenticated}
      <p>
        Or hop on over to the <Link to='/explore'>Explore Page</Link> to find
        posts from our community.
      </p>
    </div>
  );

  const endOfHomeFeed = (
    <div className='feed-msg feed-msg-btm flex-container flex-column flex-align-center margin-top-3 padding-1'>
      <h2 className='margin-btm-1'>That's far enough.</h2>
      <p>You've reached the end of your feed.</p>
      <p>
        Hop on over to the <Link to='/explore'>Explore Page</Link> to find more
        posts from our community.
      </p>
    </div>
  );

  const endOfExploreFeed = (
    <div className='feed-msg feed-msg-btm flex-container flex-column flex-align-center margin-top-3 padding-1'>
      <h2 className='margin-btm-1'>That's far enough</h2>
      <p>
        Congratulations! You've seen every post. Check back later to see if any
        new posts have been made.
      </p>
    </div>
  );

  const endOfFeed = homeFeed ? endOfHomeFeed : endOfExploreFeed;

  return (
    <section className='img-feed-container'>
      <>
        {content}
        {!isFetching &&
          !isLoading &&
          !content?.length &&
          homeFeed &&
          noFollowingDiv}
        {!isFetching &&
          !isLoading &&
          content?.length > 0 &&
          !hasNextPage &&
          endOfFeed}
        {(isFetching || isLoading) && <FadeLoaderStyled />}
      </>
    </section>
  );
};

export default ImageFeed;
