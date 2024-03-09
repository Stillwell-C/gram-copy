import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";

import useAuth from "../../hooks/useAuth";
import { addNewLike, deleteLike, getLike } from "./likesApiRoutes";
import { setError, setErrorRefreshPage } from "../error/errorSlice";

import outlinedHeart from "../../assets/heart-rounded-svgrepo-com.svg";
import filledHeart from "../../assets/heart-svgrepo-com.svg";

const LikeButton = ({ postID, postPage, queryKey }) => {
  const { authenticatedUser } = useAuth();

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [liked, setLiked] = useState(false);

  const postQueryKeyInvalidationKey = queryKey ? queryKey : ["posts"];
  const likeQueryKey = "like:" + postID;

  const { data: like, isLoading } = useQuery({
    queryKey: likeQueryKey,
    enabled: authenticatedUser,
    queryFn: () => getLike({ parentPostID: postID }),
    refetchOnWindowFocus: false,
  });

  const addNewLikeMutation = useMutation({
    mutationFn: addNewLike,
    onSuccess: () => {
      queryClient.setQueryData(postQueryKeyInvalidationKey, (oldData) => {
        const data = oldData;
        if (data?.pages) {
          // Increment like count
          data.pages[postPage].posts.find(
            (post) => post._id === postID
          ).likes += 1;
        } else if (data?.imgKey) {
          data.likes += 1;
        }
        return data;
      });
      queryClient.setQueryData(likeQueryKey, (oldData) => {
        const data = oldData;
        if (data?.isLiked) {
          data.isLiked = true;
        }
        return data;
      });
    },
    onError: () => {
      dispatch(setError(true));
      dispatch(setErrorRefreshPage(false));
    },
  });

  const deleteLikeMutation = useMutation({
    mutationFn: deleteLike,
    onSuccess: () => {
      queryClient.setQueryData(postQueryKeyInvalidationKey, (oldData) => {
        const data = oldData;
        if (data?.pages) {
          //Decrement like count
          data.pages[postPage].posts.find(
            (post) => post._id === postID
          ).likes -= 1;
        } else if (data?.imgKey) {
          data.likes -= 1;
        }
        return data;
      });
      queryClient.setQueryData(likeQueryKey, (oldData) => {
        const data = oldData;
        if (data?.isLiked) {
          data.isLiked = false;
        }
        return data;
      });
    },
    onError: () => {
      dispatch(setError(true));
      dispatch(setErrorRefreshPage(false));
    },
  });

  useEffect(() => {
    if (isLoading) return;
    setLiked(like?.isLiked ?? false);
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
