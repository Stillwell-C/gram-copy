import React, { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { useDispatch } from "react-redux";

import { getMultiplePosts } from "./postApiRoutes";
import { setLoading } from "../display/displaySlice";
import FeedContainer from "../../components/FeedContainer";
import { setError, setErrorRefreshPage } from "../error/errorSlice";

const ExploreFeed = () => {
  const dispatch = useDispatch();

  const postLoadLimit = 5;
  const queryKey = ["exploreFeed"];

  const {
    data: postData,
    isLoading,
    isError,
    error,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) =>
      getMultiplePosts({
        pageParam,
        limit: postLoadLimit,
        followingFeed: false,
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
      if (error?.response?.status === 400) return;
      dispatch(setError(true));
      dispatch(setErrorRefreshPage(true));
    }
  }, [isError]);

  if (!isLoading)
    return (
      <FeedContainer
        postData={postData}
        homeFeed={false}
        isLoading={isLoading}
        isFetching={isFetching}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isError={isError}
        error={error}
        queryKey={queryKey}
      />
    );
};

export default ExploreFeed;
