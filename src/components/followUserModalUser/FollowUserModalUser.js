import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useFollowUnfollow from "../../hooks/useFollowUnfollow";
import "./followUserModalUser.scss";
import useAuth from "../../hooks/useAuth";
import FollowButton from "../FollowButton";
import UnfollowButton from "../UnfollowButton";

const FollowUserModalUser = React.forwardRef(({ user, setShowModal }, ref) => {
  const userImgURL = `https://res.cloudinary.com/danscxcd2/image/upload/w_150,c_fill/${user?.userImgKey}`;

  const followButton = user?.isFollow ? (
    <UnfollowButton user={user} />
  ) : (
    <FollowButton user={user} />
  );

  const userInfo = (
    <>
      <div className='individual-user-left' onClick={() => setShowModal(false)}>
        <Link
          to={`/${user?.username}`}
          aria-label={`move to ${user?.username}'s profile`}
        >
          <div className='profile-picture'>
            <img src={userImgURL} alt='user profile' />
          </div>
        </Link>
        <div className='userinfo-div'>
          <Link
            to={`/${user?.username}`}
            aria-label={`move to ${user?.username}'s profile`}
          >
            <div className='username'>{user?.username}</div>
          </Link>
          <div className='fullname'>{user?.fullname}</div>
        </div>
      </div>
      <div className='button-div'>{followButton}</div>
    </>
  );

  const followModalUser = ref ? (
    <div className='individual-user' ref={ref}>
      {userInfo}
    </div>
  ) : (
    <div className='individual-user' ref={ref}>
      {userInfo}
    </div>
  );

  return followModalUser;
});

export default FollowUserModalUser;
