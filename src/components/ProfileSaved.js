import { useCallback, useEffect, useRef, useState } from "react";
import PostFeed from "./postFeed/PostFeed";
import LoadingSpinner from "./loadingSpinner/LoadingSpinner";
import { useGetSavedPostsQuery } from "../features/saved/savedApiSlice";

const ProfileSaved = ({ userID }) => {
  const [pageNum, setPageNum] = useState(1);
  const [feedData, setFeedData] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState(false);

  const postLoadLimit = 12;

  const {
    data: postData,
    isFetching,
    isLoading,
    isError,
    error,
  } = useGetSavedPostsQuery({
    userID,
    page: pageNum,
    limit: postLoadLimit,
  });

  useEffect(() => {
    if (postData?.posts?.length > 0) {
      setHasMorePosts(
        (Math.ceil(postData?.totalPosts / postLoadLimit) || 1) > pageNum
      );
      if (
        feedData.length &&
        feedData.filter(({ _id }) => _id === postData?.posts[0]?.post._id)
          .length > 0
      ) {
        const filteredPostData = postData.posts
          .map((singlePost) => singlePost.post)
          .filter(
            (postData) =>
              !feedData.some((feedData) => postData._id === feedData._id)
          );
        setFeedData((prev) => [...prev, ...filteredPostData]);
        return;
      }
      const newPostData = postData.posts.map((singlePost) => singlePost.post);
      setFeedData((prev) => [...prev, ...newPostData]);
    }
    return () => setFeedData([]);
  }, [postData]);

  const observer = useRef();
  const lastPostRef = useCallback(
    (post) => {
      if (isFetching || isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMorePosts) {
          setPageNum((prev) => prev + 1);
          console.log("near last post");
        }
      });

      if (post) observer.current.observe(post);
    },
    [isFetching, isLoading, hasMorePosts]
  );

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <PostFeed
      posts={feedData}
      lastPostRef={lastPostRef}
      isFetching={isFetching}
      isError={isError}
      error={error}
    />
  );
};

export default ProfileSaved;
