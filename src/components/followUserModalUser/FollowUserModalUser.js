import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useFollowUnfollow from "../../hooks/useFollowUnfollow";
import "./followUserModalUser.scss";
import useAuth from "../../hooks/useAuth";
import FollowButton from "../FollowButton";
import UnfollowButton from "../UnfollowButton";

const FollowUserModalUser = React.forwardRef(({ user, setShowModal }, ref) => {
  // const [following, setFollowing] = useState(false);
  const { authenticatedUser, id } = useAuth();

  const { follow: followUser, unfollow: unfollowUser } = useFollowUnfollow();

  const [followButton, setFollowButton] = useState(
    <FollowButton user={user} />
  );

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

  // const followButton = (
  //   <button
  //     className='modal-follow-button'
  //     aria-label={`click to follow user`}
  //     type='button'
  //     // onClick={handleFollow}
  //   >
  //     Follow
  //   </button>
  // );

  // const followButton = user?.isFollow ? (
  //   <UnfollowButton user={user} />
  // ) : (
  //   <FollowButton user={user} />
  // );

  useState(() => {
    if (!user) return;
    if (user.isFollow) {
      setFollowButton(<UnfollowButton user={user} />);
      return;
    }
    setFollowButton(<FollowButton user={user} />);
  }, [user?.isFollow]);

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
