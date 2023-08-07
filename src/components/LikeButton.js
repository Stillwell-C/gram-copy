import React, { useEffect, useState } from "react";
import outlinedHeart from "../assets/heart-rounded-svgrepo-com.svg";
import filledHeart from "../assets/heart-svgrepo-com.svg";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  useAddNewLikeMutation,
  useDeleteLikeMutation,
} from "../features/likes/likesApiSlice";

const LikeButton = ({ like = false, postID }) => {
  const { authenticatedUser, id } = useAuth();

  const navigate = useNavigate();

  const [liked, setLiked] = useState(false);

  const [
    addNewLike,
    {
      isLoading: isAddLoading,
      isSuccess: isAddSuccess,
      isError: isAddError,
      error: addError,
    },
  ] = useAddNewLikeMutation();
  const [
    deleteLike,
    {
      isLoading: isDeleteLoading,
      isSuccess: isDeleteSuccess,
      isError: isDeleteError,
      error: deleteError,
    },
  ] = useDeleteLikeMutation();

  useEffect(() => {
    setLiked(like);
  }, []);

  const handleLike = () => {
    if (!authenticatedUser) {
      navigate("/accounts/login");
      return;
    }
    if (liked) {
      deleteLike({ userID: id, parentPostID: postID });
      //   initialLike ? setLikesOffset(-1) : setLikesOffset(0);
    }
    if (!liked) {
      addNewLike({ userID: id, parentPostID: postID });
      //   initialLike ? setLikesOffset(0) : setLikesOffset(1);
    }
    setLiked(!liked);
  };

  return (
    <button
      className='likeButton'
      aria-label='click to like post'
      onClick={handleLike}
    >
      <img
        src={liked ? filledHeart : outlinedHeart}
        className={liked ? "filled heart" : "heart"}
        alt=''
        aria-hidden='true'
      />
    </button>
  );
};

export default LikeButton;
