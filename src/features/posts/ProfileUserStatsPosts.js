import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { countPosts } from "./postApiRoutes";
import useParseNumber from "../../hooks/useParseNumber";

const ProfileUserStatsPosts = ({ userData }) => {
  const parseNum = useParseNumber();

  const [userPosts, setUserPosts] = useState(userData?.postNo);

  const { data, isLoading } = useQuery({
    queryKey: ["userPostCount", userData?._id],
    enabled: userData?._id,
    queryFn: () => countPosts({ userID: userData?._id }),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isLoading && data) {
      setUserPosts(data.postCount);
    }
  }, [data]);

  return (
    <>
      <span className='user-figure'>{parseNum(userPosts)}</span>
      <span className='category'>{userPosts === 1 ? "post" : "posts"}</span>
    </>
  );
};

export default ProfileUserStatsPosts;
