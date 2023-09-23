import React, { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { useDispatch } from "react-redux";
import { getMultiplePosts } from "../features/posts/postApiRoutes";
import { setLoading } from "../features/display/displaySlice";
import FeedContainer from "./FeedContainer";

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
