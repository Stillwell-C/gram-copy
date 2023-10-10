import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUser } from "../features/users/usersApiRoutes";
import useParseNumber from "../hooks/useParseNumber";
import useParseTextForLinks from "../hooks/useTextParseForLinks";
import { useDispatch } from "react-redux";
import { setLoading } from "../features/display/displaySlice";
import useAuth from "../hooks/useAuth";
import UnfollowButton from "../features/follow/UnfollowButton";
import FollowButton from "../features/follow/FollowButton";
import threeDots from "../assets/three-dots-line-svgrepo-com.svg";
import ProfileUserImage from "../features/users/ProfileUserImage";

const ProfileTop = ({
  displayOwnPage,
  userData,
  setShowAdditionalOptionsModal,
  setShowFollowerModal,
  setShowFollowingModal,
}) => {
  const { userID } = useParams();
  const { authenticatedUser, username } = useAuth();
  const navigate = useNavigate();
  const parseNum = useParseNumber();
  const parseTextForLinks = useParseTextForLinks();

  const handleMessage = () => {
    if (!authenticatedUser) {
      navigate("/accounts/login");
      return;
    }
    navigate("/direct/inbox");
  };

  const friendButton = userData?.isFollow ? (
    <UnfollowButton
      user={userData}
      queryKey={{
        key: ["userInfo", userData?.username],
        multipleInvalidation: false,
      }}
    />
  ) : (
    <FollowButton
      user={userData}
      queryKey={{
        key: ["userInfo", userData?.username],
        multipleInvalidation: false,
      }}
    />
  );

  const ownPageButtons = (
    <div className='user-info-buttons flex-container flex-align-center flex-justify-start'>
      <div className='edit-profile'>
        <Link to='/accounts/edit'>
          <button
            className='edit-profile-btn standard-button grey-button'
            aria-label='edit profile information'
          >
            Edit profile
          </button>
        </Link>
      </div>
    </div>
  );

  const optionsButton = (
    <div className='options-div'>
      <button
        className='options-button transparent-button'
        aria-label='click for more options'
        onClick={() => setShowAdditionalOptionsModal(true)}
      >
        <img
          src={threeDots}
          className='themeable-icon'
          alt=''
          aria-hidden='true'
        />
      </button>
    </div>
  );

  const defaultPageButtons = (
    <div className='user-info-buttons flex-container flex-align-center flex-justify-start'>
      <div className='follow-div'>{friendButton}</div>
      <div className='message-div'>
        <button
          className='message-button standard-button grey-button'
          aria-label='click to message user'
          type='button'
          onClick={handleMessage}
        >
          Message
        </button>
      </div>
      {optionsButton}
    </div>
  );

  const userInfoButtons =
    username === userID ? ownPageButtons : defaultPageButtons;

  const userStats = (
    <>
      <div>
        <span className='user-figure'>{parseNum(userData?.postNo)}</span>
        <span className='category'>
          {userData?.posts === 1 ? "post" : "posts"}
        </span>
      </div>
      <div
        className='clickable'
        aria-label='click to see followers dialog'
        onClick={() => setShowFollowerModal(true)}
      >
        <span className='user-figure'>{parseNum(userData?.followerNo)}</span>
        {userData?.followerNo === 1 ? "follower" : "followers"}
        <span className='category'></span>
      </div>
      <div
        className='clickable'
        aria-label='click to see following dialog'
        onClick={() => setShowFollowingModal(true)}
      >
        <span className='user-figure'>{parseNum(userData?.followingNo)}</span>
        following<span className='category'></span>
      </div>
    </>
  );

  const parsedUserBio =
    userData?.userBio.length > 0 &&
    parseTextForLinks(userData?.userBio, 5, false);

  return (
    <>
      <div className='profile-top flex-container'>
        <ProfileUserImage displayOwnPage={displayOwnPage} user={userData} />
        <div className='user-info'>
          <div className='user-info-top flex-container flex-column flex-align-start flex-justify-center'>
            <div className='user-info-top-heading flex-container flex-align-center'>
              <div className='user-info-username'>{userID}</div>
              {!authenticatedUser && optionsButton}
            </div>
            {userInfoButtons}
          </div>
          <div className='user-info-middle flex-align-center flex-justify-start'>
            {userStats}
          </div>
          <div className='user-info-bottom'>
            <div className='user-fullname'>{userData?.fullname}</div>
            <div className='user-bio'>{parsedUserBio}</div>
            {userData?.urlLink.length > 0 && (
              <div className='user-link'>
                <a href={userData?.urlLink}>
                  {userData?.urlLinkText || userData?.urlLink}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='user-info-stats-small width-100 flex-container flex-align-center'>
        {userStats}
      </div>
    </>
  );
};

export default ProfileTop;
