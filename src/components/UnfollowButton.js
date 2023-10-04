import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { deleteFollow } from "../features/follow/followApiRoutes";
import useAuth from "../hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setError, setErrorRefreshPage } from "../features/error/errorSlice";

const UnfollowButton = ({ user }) => {
  const { authenticatedUser, id, username } = useAuth();

  const { userID: usernameKey } = useParams();

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const deleteFollowMutation = useMutation({
    mutationFn: deleteFollow,
    onSuccess: () => {
      queryClient.setQueryData(["userInfo", user.username], (oldData) => {
        if (oldData) {
          const data = oldData;
          data.isFollow = false;
          data.followerNo = data.followerNo -= 1;
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
      //username key may just need to be user's id
      //other people follows wont change respective to users choices
      queryClient.setQueryData(["following", usernameKey], (oldData) => {
        if (oldData) {
          const data = oldData;
          for (const page of data.pages) {
            for (const following of page.following) {
              if (following.followed._id === user._id) {
                following.followed.isFollow = false;
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
                follower.follower.isFollow = false;
              }
            }
          }
          return data;
        }
      });
    },
    onError: () => {
      dispatch(setError(true));
      dispatch(setErrorRefreshPage(false));
    },
  });

  const handleUnfollow = () => {
    if (!authenticatedUser) {
      navigate("/accounts/login");
      return;
    }
    deleteFollowMutation.mutate({ followedID: user._id });
  };

  const unfollowButtonContent = (
    <button
      className='follow-button standard-button blue-button'
      aria-label={`click to unfollow user`}
      type='button'
      onClick={handleUnfollow}
      disabled={deleteFollowMutation.isLoading}
    >
      Unfollow
    </button>
  );

  if (user?._id !== id) return unfollowButtonContent;
};

export default UnfollowButton;
