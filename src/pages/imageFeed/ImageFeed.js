import { useState, useRef, useCallback, useEffect } from "react";
import "./imageFeed.scss";
import ImgFeedCard from "../../components/imageFeedCard/ImgFeedCard";
import LoadingSpinner from "../../components/loadingSpinner/LoadingSpinner";
import { useGetMultiplePostsQuery } from "../../features/posts/postsApiSlice";

const ImageFeed = () => {
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [feedData, setFeedData] = useState([]);

  const postLoadLimit = 5;

  const {
    data: postData,
    isFetching,
    isLoading,
    isError,
    isSuccess,
    error: postError,
  } = useGetMultiplePostsQuery({ page: pageNum, limit: postLoadLimit });

  useEffect(() => console.log(isSuccess), [isSuccess]);

  useEffect(() => {
    setFeedData([]);
    return () => setFeedData([]);
  }, []);

  useEffect(() => {
    if (postData?.posts?.length) {
      console.log(postData);
      console.log(feedData);
      setTotalPages(Math.ceil(postData?.totalPosts / postLoadLimit) || 1);
      if (
        feedData.length
        // && feedData.filter(({ _id }) => _id === postData?.posts[0]?._id).length > 0
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
        if (entries[0].isIntersecting && pageNum < totalPages) {
          console.log(
            "has more pages: ",
            pageNum,
            totalPages,
            pageNum < totalPages
          );
          setPageNum((prev) => prev + 1);
          console.log("near last post");
        }
      });

      if (post) observer.current.observe(post);
    },
    [isFetching, isLoading, totalPages]
  );

  // useEffect(() => {
  //   console.log("feedData", feedData);
  // }, [feedData]);

  const content = feedData.map((post, i) => {
    if (feedData.length === i + 1) {
      return <ImgFeedCard key={post._id} post={post} ref={lastPostRef} />;
    }
    return <ImgFeedCard key={post._id} post={post} />;
  });

  return (
    <div className='feedContainer'>
      <>
        {content}
        {(isFetching || isLoading) && <LoadingSpinner />}
        {isError && postError?.data?.message}
      </>
    </div>
  );
};

export default ImageFeed;
