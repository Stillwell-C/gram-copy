import { useCallback, useEffect, useRef } from "react";
import PostFeed from "../../components/PostFeed";
import { useInfiniteQuery } from "react-query";
import useAuth from "../../hooks/useAuth";
import { getTaggedPosts } from "./postApiRoutes";
import { useDispatch } from "react-redux";
import { setError, setErrorRefreshPage } from "../error/errorSlice";
import FadeLoaderStyled from "../../components/FadeLoaderStyled";

const ProfileTagged = ({ userID }) => {
  const dispatch = useDispatch();

  const { id } = useAuth();

  const reqID = id || "";

  const postLoadLimit = 9;

  const queryKey = ["taggedPosts", userID];

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
      getTaggedPosts({ pageParam, limit: postLoadLimit, userID, reqID }),
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.page < lastPage.totalPages) return lastPage.page + 1;
      return false;
    },
  });

  const flattenedFeedData = postData?.pages?.reduce((acc, page) => {
    if (!page?.posts?.legnth) return acc;

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
      isError={isError}
      error={error}
      queryKey={queryKey}
    />
  );
};

export default ProfileTagged;
