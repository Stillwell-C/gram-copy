import React, { useEffect, useState } from "react";
import useParseNumber from "../../hooks/useParseNumber";
import { useQuery } from "react-query";
import { getFollowingCount } from "./followApiRoutes";

const ProfileUserStatsFollowing = ({ userData }) => {
  const parseNum = useParseNumber();

  const [userFollowing, setUserFollowing] = useState(userData?.followingNo);

  const { data, isLoading } = useQuery({
    queryKey: ["userFollowingCount", userData._id],
    queryFn: () => getFollowingCount({ userID: userData._id }),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isLoading && data) {
      setUserFollowing(data.followingCount);
    }
  }, [data]);

  return (
    <>
      <span className='user-figure'>{parseNum(userFollowing)}</span>
      <span className='category'>following</span>
    </>
  );
};

export default ProfileUserStatsFollowing;
