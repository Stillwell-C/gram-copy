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

  const followQueryKey = "follow:" + user?._id;

  const { data: follow, isLoading } = useQuery({
    queryKey: followQueryKey,
    enabled: user?._id,
    queryFn: () => getFollow({ userID: user?._id }),
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
      queryClient.invalidateQueries({
        queryKey: [followQueryKey],
      });
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
      queryClient.invalidateQueries({
        queryKey: [followQueryKey],
      });
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
