import React from "react";
import FollowUserModalUser from "../../components/FollowUserModalUser";
import { useQuery } from "react-query";
import { getPopularUsers } from "./usersApiRoutes";

const PopularUsers = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["popularusers"],
    queryFn: getPopularUsers,
    refetchOnWindowFocus: false,
  });

  const users =
    data?.length > 0 &&
    !isLoading &&
    !isError &&
    data.map((user) => (
      <FollowUserModalUser
        key={user._id}
        user={user}
        removeLeftPadding={true}
      />
    ));

  return (
    <div className='popular-users-container'>
      <h2>Popular Users</h2>
      <div className='flex-container flex-column'>{users}</div>
    </div>
  );
};

export default PopularUsers;
