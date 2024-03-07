import React, { useEffect, useState } from "react";
import useParseNumber from "../../hooks/useParseNumber";
import { useQuery } from "react-query";
import { getFollowerCount } from "./followApiRoutes";

const ProfileUserStatsFollowers = ({ userData }) => {
  const parseNum = useParseNumber();

  const [userFollowers, setUserFollowers] = useState(userData?.followerNo);

  const { data, isLoading } = useQuery({
    queryKey: ["userFollowerCount", userData?._id],
    enabled: userData?._id,
    queryFn: () => getFollowerCount({ userID: userData?._id }),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isLoading && data) {
      setUserFollowers(data.followerCount);
    }
  }, [data]);

  return (
    <>
      <span className='user-figure'>{parseNum(userFollowers)}</span>
      <span className='category'>
        {userFollowers === 1 ? "follower" : "followers"}
      </span>
    </>
  );
};

export default ProfileUserStatsFollowers;
