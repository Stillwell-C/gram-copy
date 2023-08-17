import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { addFollow } from "../features/follow/followApiRoutes";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FadeLoader } from "react-spinners";

const FollowButton = ({ user, queryKey }) => {
  const { authenticatedUser, id } = useAuth();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const addFollowMutation = useMutation({
    mutationFn: addFollow,
    onSuccess: () => {
      queryClient.setQueryData(queryKey, (oldData) => {
        const data = oldData;
        data.isFollow = true;
        data.followerNo = data.followerNo += 1;
        return data;
      });
      queryClient.invalidateQueries({
        queryKey: queryKey,
      });
    },
  });

  const handleFollow = () => {
    if (!authenticatedUser) {
      navigate("/accounts/login");
      return;
    }
    addFollowMutation.mutate({ followerID: id, followedID: user._id });
  };

  return (
    <button
      className='follow-button'
      aria-label={`click to follow user`}
      type='button'
      onClick={handleFollow}
      disabled={addFollowMutation.isLoading}
    >
      Follow
    </button>
  );
};

export default FollowButton;
