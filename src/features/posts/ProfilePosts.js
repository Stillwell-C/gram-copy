import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useInfiniteQuery } from "react-query";

import PostFeed from "../../components/PostFeed";
import { getMultiplePosts } from "./postApiRoutes";
import { setError, setErrorRefreshPage } from "../error/errorSlice";
import FadeLoaderStyled from "../../components/FadeLoaderStyled";

const ProfilePosts = ({ userID }) => {
  const dispatch = useDispatch();

  const postLoadLimit = 9;

  const queryKey = ["profilePosts", userID];

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
    enabled: !!userID,
    queryFn: ({ pageParam = 1 }) =>
      getMultiplePosts({ pageParam, limit: postLoadLimit, userID }),
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage?.page < lastPage?.totalPages) return lastPage.page + 1;
      return false;
    },
  });

  const flattenedFeedData = postData?.pages?.reduce((acc, page) => {
    if (!page?.posts?.length) return acc;

    return [...acc, ...page.posts];
  }, []);

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

  useEffect(() => {
    if (isError) {
      if (error?.response?.status === 400) return;
      dispatch(setError(true));
      dispatch(setErrorRefreshPage(true));
    }
  }, [isError]);

  return isLoading ? (
    <FadeLoaderStyled />
  ) : (
    <PostFeed
      posts={flattenedFeedData}
      lastPostRef={lastPostRef}
      isFetching={isFetching}
      profilePosts={true}
      userPostsFeed={true}
      queryKey={queryKey}
    />
  );
};

export default ProfilePosts;
