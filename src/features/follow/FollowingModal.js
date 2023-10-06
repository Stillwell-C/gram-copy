import React, { useCallback, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import { getFollowing } from "./followApiRoutes";
import FollowUserModalUser from "../../components/FollowUserModalUser";
import FollowUserModal from "./FollowUserModal";

const FollowingModal = ({ user, setShowFollowingModal }) => {
  const {
    data: followData,
    isLoading,
    isError,
    error,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["following", user.username],
    queryFn: ({ pageParam = 1 }) =>
      getFollowing({ pageParam, limit: 10, userID: user._id }),
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
          fetchNextPage();
        }
      });

      if (post) observer.current.observe(post);
    },
    [isFetching, isLoading, hasNextPage]
  );

  const flattenedFeedData = followData?.pages?.reduce((acc, page) => {
    if (!page?.following?.length) return acc;

    return [...acc, ...page?.following];
  }, []);

  const followingUsers = flattenedFeedData?.map((user, i) => {
    if (flattenedFeedData.length === i + 1) {
      return (
        <FollowUserModalUser
          key={user._id}
          user={user.followed}
          ref={lastResultRef}
          setShowModal={setShowFollowingModal}
        />
      );
    }
    return (
      <FollowUserModalUser
        key={user._id}
        user={user.followed}
        setShowModal={setShowFollowingModal}
      />
    );
  });
  return (
    <FollowUserModal
      modalType={"following"}
      users={followingUsers}
      setShowModal={setShowFollowingModal}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
};

export default FollowingModal;
