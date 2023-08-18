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
      if (!queryKey.multipleInvalidation) {
        // queryClient.setQueryData(queryKey.key, (oldData) => {
        //   const data = oldData;
        //   data.isFollow = true;
        //   data.followerNo = data.followerNo += 1;
        //   return data;
        // });
        // queryClient.invalidateQueries({
        //   queryKey: queryKey.key,
        // });
      } else if (queryKey.multipleInvalidation) {
        // queryClient.setQueryData(['posts'], (oldData) => {
        //   const data = oldData;
        //   console.log(data);
        //   for (const page of data.pages) {
        //     for (const post of page.posts) {
        //       if (post.user._id === user._id) {
        //         post.isFollow = true;
        //       }
        //     }
        //   }
        //   console.log(data);
        //   return data;
        // });
      }

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
      queryClient.setQueryData(["posts"], (oldData) => {
        if (oldData) {
          const data = oldData;
          console.log(data);
          for (const page of data.pages) {
            for (const post of page.posts) {
              if (post.user._id === user._id) {
                post.isFollow = true;
              }
            }
          }
          console.log(data);
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
