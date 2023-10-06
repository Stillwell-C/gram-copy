import React, { useEffect, useState } from "react";
import outlinedHeart from "../../assets/heart-rounded-svgrepo-com.svg";
import filledHeart from "../../assets/heart-svgrepo-com.svg";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { addNewLike, deleteLike } from "./likesApiRoutes";
import { useDispatch } from "react-redux";
import { setError, setErrorRefreshPage } from "../error/errorSlice";

const LikeButton = ({ like = false, postID, postPage, queryKey }) => {
  const { authenticatedUser, id } = useAuth();

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [liked, setLiked] = useState(false);

  const queryKeyInvalidationKey = queryKey ? queryKey : ["posts"];

  const addNewLikeMutation = useMutation({
    mutationFn: addNewLike,
    onSuccess: () => {
      queryClient.setQueryData(queryKeyInvalidationKey, (oldData) => {
        const data = oldData;
        if (data?.pages) {
          // Increment like
          data.pages[postPage].posts.find(
            (post) => post._id === postID
          ).likes += 1;
          data.pages[postPage].posts.find(
            (post) => post._id === postID
          ).isLiked = true;
        } else if (data?.imgKey) {
          data.isLiked = true;
          data.likes += 1;
        }
        return data;
      });
      if (queryKeyInvalidationKey[0] !== "posts") {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      }
      if (queryKeyInvalidationKey[0] !== "explore") {
        queryClient.invalidateQueries({ queryKey: ["explore"] });
      }
      //Maybe just stop here
      // queryClient.invalidateQueries({
      //   queryKey: queryKeyInvalidationKey,
      //   refetchPage: (page, index, allPages) => {
      //     return index === postPage;
      //   },
      // });
    },
    onError: () => {
      dispatch(setError(true));
      dispatch(setErrorRefreshPage(false));
    },
  });

  const deleteLikeMutation = useMutation({
    mutationFn: deleteLike,
    onSuccess: () => {
      queryClient.setQueryData(queryKeyInvalidationKey, (oldData) => {
        const data = oldData;
        if (data?.pages) {
          //Decrement like
          data.pages[postPage].posts.find(
            (post) => post._id === postID
          ).likes -= 1;
          data.pages[postPage].posts.find(
            (post) => post._id === postID
          ).isLiked = false;
        } else if (data?.imgKey) {
          data.isLiked = false;
          data.likes -= 1;
        }
        return data;
      });
      if (queryKeyInvalidationKey[0] !== "posts") {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      }
      //Maybe just stop here
      // queryClient.invalidateQueries({
      //   queryKey: queryKeyInvalidationKey,
      //   refetchPage: (page, index, allPages) => {
      //     return index === postPage;
      //   },
      // });
    },
    onError: () => {
      dispatch(setError(true));
      dispatch(setErrorRefreshPage(false));
    },
  });

  useEffect(() => {
    setLiked(like);
  }, [like]);

  const handleLike = () => {
    if (!authenticatedUser) {
      navigate("/accounts/login");
      return;
    }
    if (liked) {
      deleteLikeMutation.mutate({ parentPostID: postID });
    }
    if (!liked) {
      addNewLikeMutation.mutate({ parentPostID: postID });
    }
    setLiked(!liked);
  };

  return (
    <button
      className='likeButton icon-button'
      aria-label='like post'
      onClick={handleLike}
      disabled={addNewLikeMutation.isLoading || deleteLikeMutation.isLoading}
      aria-disabled={
        addNewLikeMutation.isLoading || deleteLikeMutation.isLoading
      }
    >
      <img
        src={liked ? filledHeart : outlinedHeart}
        className={`themeable-icon ${liked ? "filled heart" : "heart empty"}`}
        alt=''
        aria-hidden='true'
      />
    </button>
  );
};

export default LikeButton;
