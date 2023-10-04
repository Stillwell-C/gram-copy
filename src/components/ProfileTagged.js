import { useCallback, useEffect, useRef } from "react";
import PostFeed from "./PostFeed";
import { useInfiniteQuery } from "react-query";
import useAuth from "../hooks/useAuth";
import { getTaggedPosts } from "../features/posts/postApiRoutes";
import { FadeLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setError, setErrorRefreshPage } from "../features/error/errorSlice";

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
    <div className='loading-div'>
      <FadeLoader cssOverride={{ scale: "0.5" }} color='#333' />
    </div>
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
