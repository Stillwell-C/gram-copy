import React from "react";
import ProfileUserStatsPosts from "../features/posts/ProfileUserStatsPosts";
import ProfileUserStatsFollowers from "../features/follow/ProfileUserStatsFollowers";
import ProfileUserStatsFollowing from "../features/follow/ProfileUserStatsFollowing";

const ProfileUserStats = ({
  userData,
  setShowFollowerModal,
  setShowFollowingModal,
}) => {
  return (
    <>
      <div>
        <ProfileUserStatsPosts userData={userData} />
      </div>
      <div
        className='clickable'
        aria-label='click to see followers dialog'
        onClick={() => setShowFollowerModal(true)}
      >
        <ProfileUserStatsFollowers userData={userData} />
      </div>
      <div
        className='clickable'
        aria-label='click to see following dialog'
        onClick={() => setShowFollowingModal(true)}
      >
        <ProfileUserStatsFollowing userData={userData} />
      </div>
    </>
  );
};

export default ProfileUserStats;
