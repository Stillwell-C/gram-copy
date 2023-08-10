import React, { useEffect, useState } from "react";
import outlinedHeart from "../assets/heart-rounded-svgrepo-com.svg";
import filledHeart from "../assets/heart-svgrepo-com.svg";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { addNewLike, deleteLike } from "../features/likes/likesApiRoutes";

const LikeButton = ({ like = false, postID, postPage }) => {
  const { authenticatedUser, id } = useAuth();

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const [liked, setLiked] = useState(false);

  const addNewLikeMutation = useMutation({
    mutationFn: addNewLike,
    onSuccess: () => {
      queryClient.setQueryData("posts", (oldData) => {
        const data = oldData;
        // Increment like
        data.pages[postPage].posts.find(
          (post) => post._id === postID
        ).likes += 1;
        data.pages[postPage].posts.find(
          (post) => post._id === postID
        ).isLiked = true;
        return data;
      });
      //Maybe just stop here
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        refetchPage: (page, index, allPages) => {
          return index === postPage;
        },
      });
    },
  });

  const deleteLikeMutation = useMutation({
    mutationFn: deleteLike,
    onSuccess: () => {
      queryClient.setQueryData("posts", (oldData) => {
        const data = oldData;
        //Decrement like
        data.pages[postPage].posts.find(
          (post) => post._id === postID
        ).likes -= 1;
        data.pages[postPage].posts.find(
          (post) => post._id === postID
        ).isLiked = false;
        return data;
      });
      //Maybe just stop here
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        refetchPage: (page, index, allPages) => {
          return index === postPage;
        },
      });
    },
  });

  useEffect(() => {
    setLiked(like);
  }, []);

  const handleLike = () => {
    if (!authenticatedUser) {
      navigate("/accounts/login");
      return;
    }
    if (liked) {
      deleteLikeMutation.mutate({ userID: id, parentPostID: postID });
    }
    if (!liked) {
      addNewLikeMutation.mutate({ userID: id, parentPostID: postID });
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
