import React, { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { useDispatch } from "react-redux";
import { searchPosts } from "../features/posts/postApiRoutes";
import { setLoading } from "../features/display/displaySlice";
import FeedContainer from "./FeedContainer";
import { useParams } from "react-router-dom";
import { setError, setErrorRefreshPage } from "../features/error/errorSlice";

const SearchFeed = () => {
  const { searchParam, searchQuery } = useParams();

  const dispatch = useDispatch();

  const postLoadLimit = 5;

  let formattedSearchParam;
  if (searchParam === "hash") {
    formattedSearchParam = "caption";
  }
  if (searchParam === "location") {
    formattedSearchParam = "location";
  }

  let formattedSearchQuery = searchQuery;
  if (searchParam === "hash") {
    formattedSearchQuery = `#${searchQuery}`;
  }
  if (formattedSearchQuery.includes("%20")) {
    formattedSearchQuery.replace("%20", " ");
  }

  const queryKey = ["searchFeed", formattedSearchParam, formattedSearchQuery];

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
      searchPosts({
        pageParam,
        param: formattedSearchParam,
        query: formattedSearchQuery,
        limit: postLoadLimit,
      }),
    refetchOnWindowFocus: false,
    enabled: formattedSearchParam.length > 0 && formattedSearchQuery.length > 0,
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

export default SearchFeed;
