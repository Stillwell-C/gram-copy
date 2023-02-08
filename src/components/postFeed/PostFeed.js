import React, { useCallback, useEffect, useRef, useState } from "react";
import useGetUserPosts from "../../hooks/useGetUserPosts";
import CreatePostModal from "../createPostModal/CreatePostModal";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import NoUserImgProfileFeed from "../noUserImgProfileFeed/NoUserImgProfileFeed";
import ProfilePostCard from "../profilePostCard/ProfilePostCard";

const PostFeed = ({ userParam, userPosts, userQueryInput }) => {
  const [displayNoImgFeed, setDisplayNoImgFeed] = useState(false);
  const [displayPostModal, setDisplayPostModal] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const { loading, error, errorInfo, posts, hasMoreData } = useGetUserPosts(
    userParam,
    pageNum,
    userQueryInput
  );

  useEffect(() => {
    if (userPosts.length < 1 && userQueryInput === "posts") {
      setDisplayNoImgFeed(true);
      return;
    }
    setDisplayNoImgFeed(false);
  }, []);

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

  const content = posts.map((post, i) => {
    if (posts.length === i + 1) {
      return <ProfilePostCard key={post.id} post={post} ref={lastPostRef} />;
    }
    return <ProfilePostCard key={post.id} post={post} />;
  });

  const handleAddPostModal = () => {
    setDisplayPostModal(true);
  };

  return (
    <div className='user-posts-container'>
      <>
        {content}
        {loading && <LoadingSpinner />}
        {!loading && displayNoImgFeed && (
          <NoUserImgProfileFeed handleAddPostModal={handleAddPostModal} />
        )}
        {error && errorInfo.message}
        {displayPostModal && (
          <CreatePostModal setDisplayPostModal={setDisplayPostModal} />
        )}
      </>
    </div>
  );
};

export default PostFeed;
