import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { deleteFollow } from "../features/follow/followApiRoutes";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FadeLoader } from "react-spinners";

const UnfollowButton = ({ user, queryKey }) => {
  const { authenticatedUser, id } = useAuth();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteFollowMutation = useMutation({
    mutationFn: deleteFollow,
    onSuccess: () => {
      queryClient.setQueryData(queryKey, (oldData) => {
        const data = oldData;
        data.isFollow = false;
        data.followerNo = data.followerNo -= 1;
        return data;
      });
      queryClient.invalidateQueries({
        queryKey: queryKey,
      });
    },
  });

  const handleUnfollow = () => {
    if (!authenticatedUser) {
      navigate("/accounts/login");
      return;
    }
    deleteFollowMutation.mutate({ followerID: id, followedID: user._id });
  };

  return (
    <button
      className='follow-button'
      aria-label={`click to unfollow user`}
      type='button'
      onClick={handleUnfollow}
      disabled={deleteFollowMutation.isLoading}
    >
      Unfollow
    </button>
  );
};

export default UnfollowButton;
