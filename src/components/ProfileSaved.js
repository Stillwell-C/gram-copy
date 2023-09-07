import { useCallback, useRef } from "react";
import PostFeed from "./postFeed/PostFeed";
import { useInfiniteQuery } from "react-query";
import { getSavedPosts } from "../features/saved/savedApiRoutes";
import { FadeLoader } from "react-spinners";

const ProfileSaved = ({ userID }) => {
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

  console.log(flattenedFeedData);

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
    <FadeLoader cssOverride={{ scale: "0.7" }} color='#333' />
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
