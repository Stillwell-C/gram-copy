import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { addFollow } from "../features/follow/followApiRoutes";
import useAuth from "../hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";

const FollowButton = ({ user }) => {
  const { authenticatedUser, id, username } = useAuth();

  const { userID: usernameKey } = useParams();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const addFollowMutation = useMutation({
    mutationFn: addFollow,
    onSuccess: () => {
      queryClient.setQueryData(["userInfo", user.username], (oldData) => {
        if (oldData) {
          const data = oldData;
          data.isFollow = true;
          data.followerNo = data.followerNo += 1;
          return data;
        }
      });
      queryClient.invalidateQueries({
        queryKey: ["userInfo", user.username],
      });
      queryClient.invalidateQueries({
        queryKey: ["userInfo", username],
      });
      queryClient.setQueryData(["posts"], (oldData) => {
        if (oldData) {
          const data = oldData;
          for (const page of data.pages) {
            for (const post of page.posts) {
              if (post.user._id === user._id) {
                post.isFollow = true;
              }
            }
          }
          return data;
        }
      });
      queryClient.setQueryData(["following", usernameKey], (oldData) => {
        if (oldData) {
          const data = oldData;
          for (const page of data.pages) {
            for (const following of page.following) {
              if (following.following._id === user._id) {
                following.following.isFollow = true;
              }
            }
          }
          return data;
        }
      });
      queryClient.setQueryData(["followers", usernameKey], (oldData) => {
        if (oldData) {
          const data = oldData;
          for (const page of data.pages) {
            for (const follower of page.followers) {
              if (follower.follower._id === user._id) {
                follower.follower.isFollow = true;
              }
            }
          }
          return data;
        }
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