import React, { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { useDispatch } from "react-redux";
import { getMultiplePosts } from "../features/posts/postApiRoutes";
import { setLoading } from "../features/display/displaySlice";
import FeedContainer from "./FeedContainer";
import { setError, setErrorRefreshPage } from "../features/error/errorSlice";

const HomeFeed = () => {
  const dispatch = useDispatch();

  const postLoadLimit = 5;

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
      getMultiplePosts({
        pageParam,
        limit: postLoadLimit,
        followingFeed: true,
      }),
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

  useEffect(() => {
    if (isError) {
      dispatch(setError(true));
      dispatch(setErrorRefreshPage(true));
    }
  }, [isError]);

  if (!isLoading)
    return (
      <FeedContainer
        postData={postData}
        homeFeed={true}
        isLoading={isLoading}
        isFetching={isFetching}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isError={isError}
        error={error}
      />
    );
};

export default HomeFeed;
