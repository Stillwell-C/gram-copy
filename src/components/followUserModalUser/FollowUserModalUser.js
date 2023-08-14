import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useFollowUnfollow from "../../hooks/useFollowUnfollow";
import "./followUserModalUser.scss";
import useAuth from "../../hooks/useAuth";

const FollowUserModalUser = ({ user }) => {
  // const [following, setFollowing] = useState(false);
  const { authenticatedUser, id } = useAuth();

  const { follow: followUser, unfollow: unfollowUser } = useFollowUnfollow();

  const userImgURL = `https://res.cloudinary.com/danscxcd2/image/upload/w_150,c_fill/${user?.userImgKey}`;

  // useEffect(() => {
  //   if (!following) {
  //     setFollowingButton(
  //       <button
  //         className='modal-follow-button'
  //         aria-label={`click to follow user`}
  //         type='button'
  //         onClick={handleFollow}
  //       >
  //         Follow
  //       </button>
  //     );
  //     return;
  //   }
  //   setFollowingButton(
  //     <button
  //       className='modal-follow-button unfollow'
  //       aria-label={`click to unfollow user`}
  //       type='button'
  //       onClick={handleUnfollow}
  //     >
  //       Following
  //     </button>
  //   );
  // }, [following]);

  // const handleFollow = () => {
  //   followUser(userDoc.uid);
  //   setFollowing(true);
  // };

  // const handleUnfollow = () => {
  //   unfollowUser(userDoc.uid);
  //   setFollowing(false);
  // };

  const followButton = (
    <button
      className='modal-follow-button'
      aria-label={`click to follow user`}
      type='button'
      // onClick={handleFollow}
    >
      Follow
    </button>
  );

  return (
    <div className='individual-user'>
      <div className='individual-user-left'>
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
    </div>
  );
};

export default FollowUserModalUser;
