import { useState, useRef, useCallback, useEffect } from "react";
import "./imageFeed.scss";
import ImgFeedCard from "../../components/imageFeedCard/ImgFeedCard";
import { useDispatch } from "react-redux";
import { setLoading } from "../../features/display/displaySlice";
import useAuth from "../../hooks/useAuth";
import { useInfiniteQuery } from "react-query";
import { getMultiplePosts } from "../../features/posts/postApiRoutes";
import { FadeLoader } from "react-spinners";

const ImageFeed = () => {
  const { id } = useAuth();

  const dispatch = useDispatch();

  const postLoadLimit = 5;
  const reqID = id || "";

  const {
    data: postData,
    isLoading,
    isError,
    error,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) =>
      getMultiplePosts({ pageParam, limit: postLoadLimit, reqID }),
    refetchOnWindowFocus: false,
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
    if (flattenedFeedData.length === i + 1) {
      return <ImgFeedCard key={post._id} post={post} ref={lastPostRef} />;
    }
    return <ImgFeedCard key={post._id} post={post} />;
  });

  return (
    <div className='feedContainer'>
      <>
        {content}
        {(isFetching || isLoading) && (
          <FadeLoader cssOverride={{ scale: "0.7" }} color='#333' />
        )}
        {isError && error.message}
      </>
    </div>
  );
};

export default ImageFeed;
