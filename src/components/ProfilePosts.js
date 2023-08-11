import { useCallback, useRef } from "react";
import PostFeed from "./postFeed/PostFeed";
import LoadingSpinner from "./loadingSpinner/LoadingSpinner";
import { useInfiniteQuery } from "react-query";
import { getMultiplePosts } from "../features/posts/postApiRoutes";
import useAuth from "../hooks/useAuth";

const ProfilePosts = ({ userID }) => {
  const { id } = useAuth();

  const reqID = id || "";

  const postLoadLimit = 9;

  const {
    data: postData,
    isLoading,
    isError,
    error,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["profilePosts", userID],
    queryFn: ({ pageParam = 1 }) =>
      getMultiplePosts({ pageParam, limit: postLoadLimit, reqID }),
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

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <PostFeed
      posts={flattenedFeedData}
      lastPostRef={lastPostRef}
      isFetching={isFetching}
      isError={isError}
      error={error}
      profilePosts={true}
      userPostsFeed={true}
    />
  );
};

export default ProfilePosts;
