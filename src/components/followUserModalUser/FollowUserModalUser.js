import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useFollowUnfollow from "../../hooks/useFollowUnfollow";
import "./followUserModalUser.scss";

const FollowUserModalUser = ({ userDoc }) => {
  const [following, setFollowing] = useState(false);
  const [followingButton, setFollowingButton] = useState(null);

  const { follow: followUser, unfollow: unfollowUser } = useFollowUnfollow();

  useEffect(() => {
    if (userDoc.currentUserFollowing) setFollowing(true);
  }, []);

  useEffect(() => {
    if (!following) {
      setFollowingButton(
        <button
          className='modal-follow-button'
          aria-label={`click to follow user`}
          type='button'
          onClick={handleFollow}
        >
          Follow
        </button>
      );
      return;
    }
    setFollowingButton(
      <button
        className='modal-follow-button unfollow'
        aria-label={`click to unfollow user`}
        type='button'
        onClick={handleUnfollow}
      >
        Following
      </button>
    );
  }, [following]);

  const handleFollow = () => {
    followUser(userDoc.uid);
    setFollowing(true);
  };

  const handleUnfollow = () => {
    unfollowUser(userDoc.uid);
    setFollowing(false);
  };

  return (
    <div className='individual-user'>
      <div className='individual-user-left'>
        <Link
          to={`/${userDoc.username}`}
          aria-label={`move to ${userDoc.username}'s profile`}
        >
          <div className='profile-picture'>
            <img src={userDoc.userImgURL} alt='user profile' />
          </div>
        </Link>
        <div className='userinfo-div'>
          <Link
            key={userDoc.uid}
            to={`/${userDoc.username}`}
            aria-label={`move to ${userDoc.username}'s profile`}
          >
            <div className='username'>{userDoc.username}</div>
          </Link>
          <div className='fullname'>{userDoc.fullname}</div>
        </div>
      </div>
      <div className='button-div'>{followingButton}</div>
    </div>
  );
};

export default FollowUserModalUser;
