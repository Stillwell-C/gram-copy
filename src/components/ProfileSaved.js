import { useCallback, useEffect, useRef } from "react";
import PostFeed from "./PostFeed";
import { useInfiniteQuery } from "react-query";
import { getSavedPosts } from "../features/saved/savedApiRoutes";
import { FadeLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setError, setErrorRefreshPage } from "../features/error/errorSlice";
import FadeLoaderStyled from "./FadeLoaderStyled";

const ProfileSaved = ({ userID }) => {
  const dispatch = useDispatch();

  const postLoadLimit = 9;

  const queryKey = ["savedPosts", userID];

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
      getSavedPosts({ pageParam, limit: postLoadLimit }),
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.page < lastPage.totalPages) return lastPage.page + 1;
      return false;
    },
  });

  const flattenedFeedData = postData?.pages?.reduce((acc, page) => {
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
          console.log("near last post");
        }
      });

      if (post) observer.current.observe(post);
    },
    [isFetching, isLoading, hasNextPage]
  );

  useEffect(() => {
    if (isError) {
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

export default ProfileSaved;
