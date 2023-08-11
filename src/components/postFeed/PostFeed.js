import React, { useState } from "react";
import CreatePostModal from "../createPostModal/CreatePostModal";
import NoUserImgProfileFeed from "../noUserImgProfileFeed/NoUserImgProfileFeed";
import ProfilePostCard from "../profilePostCard/ProfilePostCard";
import useAuth from "../../hooks/useAuth";
import { useParams } from "react-router-dom";
import { FadeLoader } from "react-spinners";

const PostFeed = ({
  posts,
  lastPostRef,
  isFetching,
  isError,
  error,
  queryKey,
  userPostsFeed = false,
  profilePosts = false,
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
          profilePosts={profilePosts}
          ref={lastPostRef}
          queryKey={queryKey}
        />
      );
    }
    return (
      <ProfilePostCard
        key={post._id}
        post={post}
        profilePosts={profilePosts}
        queryKey={queryKey}
      />
    );
  });

  const handleAddPostModal = () => {
    setDisplayPostModal(true);
  };

  return (
    <div className='user-posts-container'>
      <>
        {content}
        {isFetching && (
          <FadeLoader cssOverride={{ scale: "0.7" }} color='#333' />
        )}
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
