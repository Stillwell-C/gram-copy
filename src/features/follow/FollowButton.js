import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import useAuth from "../../hooks/useAuth";
import { addFollow, deleteFollow, getFollow } from "./followApiRoutes";
import { setError, setErrorRefreshPage } from "../error/errorSlice";

const FollowButton = ({ user, queryKey, setFollowedUserToParent }) => {
  const { authenticatedUser, id, username } = useAuth();

  const { userID: usernameKey } = useParams();

  const [followed, setFollowed] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const followQueryKey = "follow:" + user._id;

  const { data: follow, isLoading } = useQuery({
    queryKey: followQueryKey,
    queryFn: () => getFollow({ userID: user._id }),
    refetchOnWindowFocus: false,
  });

  const addFollowMutation = useMutation({
    mutationFn: addFollow,
    onSuccess: () => {
      queryClient.setQueryData(followQueryKey, (oldData) => {
        const data = oldData;
        if (data?.isFollow) {
          data.isFollow = true;
        }
        return data;
      });
      // queryClient.setQueryData(["userInfo", user.username], (oldData) => {
      //   if (oldData) {
      //     const data = oldData;
      //     data.isFollow = true;
      //     data.followerNo = data.followerNo += 1;
      //     return data;
      //   }
      // });
      // queryClient.invalidateQueries({
      //   queryKey: ["userInfo", user.username],
      // });
      // queryClient.invalidateQueries({
      //   queryKey: ["userInfo", username],
      // });
      // queryClient.setQueryData(["posts"], (oldData) => {
      //   if (oldData) {
      //     const data = oldData;
      //     for (const page of data.pages) {
      //       for (const post of page.posts) {
      //         if (post.user._id === user._id) {
      //           post.isFollow = true;
      //         }
      //       }
      //     }
      //     return data;
      //   }
      // });
      // queryClient.setQueryData(["explore"], (oldData) => {
      //   if (oldData) {
      //     const data = oldData;
      //     for (const page of data.pages) {
      //       for (const post of page.posts) {
      //         if (post.user._id === user._id) {
      //           post.isFollow = true;
      //         }
      //       }
      //     }
      //     return data;
      //   }
      // });
      // if (queryKey) {
      //   queryClient.setQueryData(queryKey, (oldData) => {
      //     if (oldData) {
      //       const data = oldData;
      //       for (const page of data.pages) {
      //         for (const post of page.posts) {
      //           if (post.user._id === user._id) {
      //             post.isFollow = true;
      //           }
      //         }
      //       }
      //       return data;
      //     }
      //   });
      // }
      // queryClient.setQueryData(["following", usernameKey], (oldData) => {
      //   if (oldData) {
      //     const data = oldData;
      //     for (const page of data.pages) {
      //       for (const following of page.following) {
      //         if (following.followed._id === user._id) {
      //           following.followed.isFollow = true;
      //         }
      //       }
      //     }
      //     return data;
      //   }
      // });
      // queryClient.setQueryData(["followers", usernameKey], (oldData) => {
      //   if (oldData) {
      //     const data = oldData;
      //     for (const page of data.pages) {
      //       for (const follower of page.followers) {
      //         if (follower.follower._id === user._id) {
      //           follower.follower.isFollow = true;
      //         }
      //       }
      //     }
      //     return data;
      //   }
      // });
    },
    onError: () => {
      dispatch(setError(true));
      dispatch(setErrorRefreshPage(false));
    },
  });

  const deleteFollowMutation = useMutation({
    mutationFn: deleteFollow,
    onSuccess: () => {
      queryClient.setQueryData(followQueryKey, (oldData) => {
        const data = oldData;
        if (data?.isFollow) {
          data.isFollow = false;
        }
        return data;
      });

      // queryClient.setQueryData(["userInfo", user.username], (oldData) => {
      //   if (oldData) {
      //     const data = oldData;
      //     data.isFollow = false;
      //     data.followerNo = data.followerNo -= 1;
      //     return data;
      //   }
      // });
      // queryClient.invalidateQueries({
      //   queryKey: ["userInfo", user.username],
      // });
      // queryClient.invalidateQueries({
      //   queryKey: ["userInfo", username],
      // });
      // queryClient.setQueryData(["posts"], (oldData) => {
      //   if (oldData) {
      //     const data = oldData;
      //     for (const page of data.pages) {
      //       for (const post of page.posts) {
      //         if (post.user._id === user._id) {
      //           post.isFollow = true;
      //         }
      //       }
      //     }
      //     return data;
      //   }
      // });
      // //username key may just need to be user's id
      // //other people follows wont change respective to users choices
      // queryClient.setQueryData(["following", usernameKey], (oldData) => {
      //   if (oldData) {
      //     const data = oldData;
      //     for (const page of data.pages) {
      //       for (const following of page.following) {
      //         if (following.followed._id === user._id) {
      //           following.followed.isFollow = false;
      //         }
      //       }
      //     }
      //     return data;
      //   }
      // });
      // queryClient.setQueryData(["followers", usernameKey], (oldData) => {
      //   if (oldData) {
      //     const data = oldData;
      //     for (const page of data.pages) {
      //       for (const follower of page.followers) {
      //         if (follower.follower._id === user._id) {
      //           follower.follower.isFollow = false;
      //         }
      //       }
      //     }
      //     return data;
      //   }
      // });
    },
    onError: () => {
      dispatch(setError(true));
      dispatch(setErrorRefreshPage(false));
    },
  });

  useEffect(() => {
    if (isLoading) return;
    setFollowed(follow?.isFollow ?? false);
  }, [follow]);

  const handleFollow = () => {
    if (!authenticatedUser) {
      navigate("/accounts/login");
      return;
    }
    if (followed) {
      deleteFollowMutation.mutate({ followedID: user._id });
    }
    if (!followed) {
      addFollowMutation.mutate({ followedID: user._id });
    }
    setFollowed((prev) => !prev);
  };

  useEffect(() => {
    if (setFollowedUserToParent) {
      setFollowedUserToParent(followed);
    }
  }, [followed]);

  const followButtonContent = (
    <button
      className='follow-button standard-button blue-button'
      type='button'
      onClick={handleFollow}
      disabled={addFollowMutation.isLoading}
    >
      {followed ? "Unfollow" : "Follow"}
    </button>
  );

  if (user?._id !== id) return followButtonContent;
};

export default FollowButton;
