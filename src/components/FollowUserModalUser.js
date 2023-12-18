import React from "react";
import { Link } from "react-router-dom";

import FollowButton from "../features/follow/FollowButton";
import UnfollowButton from "../features/follow/UnfollowButton";

const FollowUserModalUser = React.forwardRef(({ user, setShowModal }, ref) => {
  const userImgURL = `https://res.cloudinary.com/danscxcd2/image/upload/w_150,c_fill/${user?.userImgKey}`;

  const followButton = <FollowButton user={user} />;

  const userInfo = (
    <>
      <div
        className='individual-user-left flex-container flex-align-center'
        onClick={() => setShowModal(false)}
      >
        <Link
          to={`/${user?.username}`}
          aria-label={`move to ${user?.username}'s profile`}
        >
          <div className='profile-picture flex-container flex-align-center'>
            <img
              src={userImgURL}
              alt='user profile'
              className='circular-image'
            />
          </div>
        </Link>
        <div className='userinfo-div height-100 fg-1 flex-container flex-column flex-justify-center'>
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
    <div
      className='individual-user width-100 flex-container flex-align-center'
      ref={ref}
    >
      {userInfo}
    </div>
  ) : (
    <div className='individual-user width-100 flex-container flex-align-center'>
      {userInfo}
    </div>
  );

  if (user?._id) return followModalUser;
});

export default FollowUserModalUser;
