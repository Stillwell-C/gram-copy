import React, { useCallback, useEffect, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import { useDispatch } from "react-redux";

import { getFollowers } from "./followApiRoutes";
import FollowUserModalUser from "../../components/FollowUserModalUser";
import FollowUserModal from "./FollowUserModal";
import { setError, setErrorRefreshPage } from "../error/errorSlice";

const FollowerModal = ({ user, setShowFollowerModal }) => {
  const dispatch = useDispatch();

  const {
    data: followData,
    isLoading,
    isError,
    error,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["followers", user.username],
    queryFn: ({ pageParam = 1 }) =>
      getFollowers({ page: pageParam, limit: 10, userID: user._id }),
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage?.page < lastPage?.totalPages)
        return parseInt(lastPage.page) + 1;
      return false;
    },
  });

  useEffect(() => {
    if (isError) {
      if (error?.response?.status === 400) return;
      dispatch(setError(true));
      dispatch(setErrorRefreshPage(false));
    }
  }, [isError]);

  const observer = useRef();
  const lastResultRef = useCallback(
    (post) => {
      if (isFetching || isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (post) observer.current.observe(post);
    },
    [isFetching, isLoading, hasNextPage]
  );

  const flattenedFeedData = followData?.pages?.reduce((acc, page) => {
    if (!page?.followers?.length) return acc;

    return [...acc, ...page?.followers];
  }, []);

  const followerUsers = flattenedFeedData?.map((user, i) => {
    if (flattenedFeedData.length === i + 1) {
      return (
        <FollowUserModalUser
          key={user._id}
          user={user.follower}
          ref={lastResultRef}
          setShowModal={setShowFollowerModal}
        />
      );
    }
    return (
      <FollowUserModalUser
        key={user._id}
        user={user.follower}
        setShowModal={setShowFollowerModal}
      />
    );
  });
  return (
    <FollowUserModal
      modalType={"followers"}
      users={followerUsers}
      setShowModal={setShowFollowerModal}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
};

export default FollowerModal;
