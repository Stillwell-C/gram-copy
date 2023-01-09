import "./App.css";
import { useState, useRef, useCallback } from "react";
import useGetPosts from "./hooks/useGetPosts";

function App() {
  const [pageNum, setPageNum] = useState(0);
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
        }
      });

      if (post) observer.current.observe(post);
    },
    [loading, hasMoreData]
  );

  if (error) return <p>Error: {error.message}</p>;

  const content = posts.map((post, i) => {
    console.log(posts);
    if (posts.length === i + 1) {
      return (
        <div ref={lastPostRef} key={post.id}>
          {post.post}
        </div>
      );
    }
    return <div key={post.post}>{post.post}</div>;
  });

  return (
    <div className='App'>
      <>
        {content}
        {loading && <p>Loading...</p>}
        {/* {error && errorInfo.message} */}
      </>
    </div>
  );
}

export default App;
