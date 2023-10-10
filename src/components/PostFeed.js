import React, { useState } from "react";
import { useParams } from "react-router-dom";

import CreatePostModal from "./CreatePostModal";
import NoUserImgProfileFeed from "./NoUserImgProfileFeed";
import ProfilePostCard from "./ProfilePostCard";
import FadeLoaderStyled from "./FadeLoaderStyled";

import useAuth from "../hooks/useAuth";

const PostFeed = ({
  posts,
  lastPostRef,
  isFetching,
  queryKey,
  userPostsFeed = false,
  profilePosts = false,
}) => {
  const [displayPostModal, setDisplayPostModal] = useState(false);

  const { userID } = useParams();

  const { username } = useAuth();
  const userCheck = userID === username;

  const content = posts?.map((post, i) => {
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

  let limit = 0;
  if (posts?.length % 3 === 1) limit = 2;
  if (posts?.length % 3 === 2) limit = 1;

  for (let i = 0; i < limit; i++) {
    content.push(
      <div
        key={`filler-div-${i}`}
        className='post-card-container filler-div'
      ></div>
    );
  }

  const handleAddPostModal = () => {
    setDisplayPostModal(true);
  };

  return (
    <div className='user-posts-container'>
      <>
        {content}
        {isFetching && <FadeLoaderStyled />}
        {posts?.length <= 0 && userPostsFeed && userCheck && (
          <NoUserImgProfileFeed handleAddPostModal={handleAddPostModal} />
        )}
        {displayPostModal && (
          <CreatePostModal setDisplayPostModal={setDisplayPostModal} />
        )}
      </>
    </div>
  );
};

export default PostFeed;
