import { useState, useRef, useCallback, useEffect } from "react";
import useGetPosts from "../../hooks/useGetPosts";
import "./imageFeed.scss";
import ImgFeedCard from "../../components/imageFeedCard/ImgFeedCard";
import { getURL } from "../../firebase";

const ImageFeed = () => {
  const [pageNum, setPageNum] = useState(1);
  const { loading, error, errorInfo, posts, hasMoreData } =
    useGetPosts(pageNum);

  const observer = useRef();
  const lastPostRef = useCallback(
    (post) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting && hasMoreData) {
          setPageNum((prev) => prev + 1);
          console.log("near last post");
        }
      });

      if (post) observer.current.observe(post);
    },
    [loading, hasMoreData]
  );

  useEffect(() => {
    console.log("useEffect", posts);
    console.log("more data", hasMoreData);
  }, [posts]);

  const content = posts.map((post, i) => {
    if (posts.length === i + 1) {
      return <ImgFeedCard key={post.id} post={post} ref={lastPostRef} />;
    }
    return <ImgFeedCard key={post.id} post={post} />;
  });

  return (
    <div className='feedContainer'>
      <>
        {content}
        {loading && (
          <div className='lds-spinner'>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}
        {error && errorInfo.message}
      </>
    </div>
  );
};

export default ImageFeed;
