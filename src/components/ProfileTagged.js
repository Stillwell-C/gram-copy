import { useCallback, useEffect, useRef, useState } from "react";
import PostFeed from "./postFeed/PostFeed";
import LoadingSpinner from "./loadingSpinner/LoadingSpinner";
import { useGetTaggedPostsQuery } from "../features/posts/postsApiSlice";

const ProfileTagged = ({ userID }) => {
  const [pageNum, setPageNum] = useState(1);
  const [feedData, setFeedData] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState(false);

  // console.log(userID);
  // console.log("page ", pageNum);
  // console.log("data ", feedData);

  const postLoadLimit = 12;

  const {
    data: postData,
    isFetching,
    isLoading,
    isError,
    error,
  } = useGetTaggedPostsQuery({ page: pageNum, limit: postLoadLimit, userID });

  useEffect(() => {
    return () => setFeedData([]);
  }, []);

  useEffect(() => {
    if (postData?.posts?.length > 0) {
      console.log(postData);
      setHasMorePosts(
        (Math.ceil(postData?.totalPosts / postLoadLimit) || 1) > pageNum
      );
      if (
        feedData.length &&
        feedData.filter(({ _id }) => _id === postData?.posts[0]?._id).length > 0
      ) {
        const filteredPostData = postData?.posts?.filter(
          (postData) =>
            !feedData.some((feedData) => postData._id === feedData._id)
        );
        setFeedData((prev) => [...prev, ...filteredPostData]);
        return;
      }
      setFeedData((prev) => [...prev, ...postData?.posts]);
    }
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

export default ProfileTagged;
