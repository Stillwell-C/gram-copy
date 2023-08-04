import React, { useState } from "react";
import CreatePostModal from "../createPostModal/CreatePostModal";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import NoUserImgProfileFeed from "../noUserImgProfileFeed/NoUserImgProfileFeed";
import ProfilePostCard from "../profilePostCard/ProfilePostCard";
import useAuth from "../../hooks/useAuth";
import { useParams } from "react-router-dom";

const PostFeed = ({
  posts,
  lastPostRef,
  isFetching,
  isError,
  error,
  userPostsFeed = false,
}) => {
  const [displayPostModal, setDisplayPostModal] = useState(false);

  const { userID } = useParams();

  const { username } = useAuth();
  const userCheck = userID === username;

  const content = posts.map((post, i) => {
    if (posts.length === i + 1) {
      return (
        <ProfilePostCard
          key={post._id}
          post={post}
          postType={"post"}
          ref={lastPostRef}
        />
      );
    }
    return <ProfilePostCard key={post._id} post={post} postType={"post"} />;
  });

  const handleAddPostModal = () => {
    setDisplayPostModal(true);
  };

  return (
    <div className='user-posts-container'>
      <>
        {content}
        {isFetching && <LoadingSpinner />}
        {posts.length <= 0 && userPostsFeed && userCheck && (
          <NoUserImgProfileFeed handleAddPostModal={handleAddPostModal} />
        )}
        {isError && error?.data?.message}
        {displayPostModal && (
          <CreatePostModal setDisplayPostModal={setDisplayPostModal} />
        )}
      </>
    </div>
  );
};

export default PostFeed;
