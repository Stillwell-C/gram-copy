import React, { useCallback, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import { getFollowers, getFollowing } from "../features/follow/followApiRoutes";
import FollowUserModalUser from "./FollowUserModalUser";
import FollowUserModal from "./FollowUserModal";

const FollowerModal = ({ user, setShowFollowerModal }) => {
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
      getFollowers({ pageParam, limit: 10, userID: user._id }),
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage?.page < lastPage?.totalPages) return lastPage.page + 1;
      return false;
    },
  });

  const observer = useRef();
  const lastResultRef = useCallback(
    (post) => {
      if (isFetching || isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          console.log("has more pages: ");
          fetchNextPage();
          console.log("near last post");
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
