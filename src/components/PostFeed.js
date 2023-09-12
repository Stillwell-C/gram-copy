import React, { useState } from "react";
import CreatePostModal from "./createPostModal/CreatePostModal";
import NoUserImgProfileFeed from "./NoUserImgProfileFeed";
import ProfilePostCard from "./ProfilePostCard";
import useAuth from "../hooks/useAuth";
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
        {isFetching && (
          <div className='loading-div'>
            <FadeLoader cssOverride={{ scale: "0.5" }} color='#333' />
          </div>
        )}
        {posts?.length <= 0 && userPostsFeed && userCheck && (
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
