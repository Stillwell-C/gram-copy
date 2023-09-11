import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from "../footer/Footer";
import "./profileMain.scss";
import sprocket from "../../assets/gear-wide-svgrepo-com.svg";
import grid from "../../assets/grid-svgrepo-com.svg";
import bookmark from "../../assets/bookmark-svgrepo-com.svg";
import tagged from "../../assets/user-square-svgrepo-com.svg";
import threeDots from "../../assets/three-dots-line-svgrepo-com.svg";
import AdditionalOptionsModal from "../additionalOptionsModal/AdditionalOptionsModal";
import ReportModal from "../reportModal/ReportModal";
import useAuth from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { setLoading } from "../../features/display/displaySlice";
import ProfilePosts from "../ProfilePosts";
import ProfileSaved from "../ProfileSaved";
import ProfileTagged from "../ProfileTagged";
import { useQuery } from "react-query";
import { getUser } from "../../features/users/usersApiRoutes";
import FollowingModal from "../FollowingModal";
import FollowerModal from "../FollowerModal";
import FollowButton from "../FollowButton";
import UnfollowButton from "../UnfollowButton";
import ProfileUserImage from "../ProfileUserImage";

const ProfileMain = () => {
  const { userID } = useParams();
  const { authenticatedUser, username } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userInfo", userID],
    enabled: !!userID,
    queryFn: () => getUser(userID),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isError && error.response.status === 400) {
      navigate("/error", {
        replace: true,
        state: {
          errorTitle: "User not found.",
          errorMessage:
            "The link you followed may be broken, or the page may have been removed.",
        },
      });
    }
  }, [isError]);

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading(true));
      return;
    }
    dispatch(setLoading(false));
    console.log(userData);
  }, [isLoading, userID]);

  const { currentUser } = useContext(AuthContext);

  const [displaySelector, setDisplaySelector] = useState("posts");
  const [showAdditionalOptionsModal, setShowAdditionalOptionsModal] =
    useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowerModal, setShowFollowerModal] = useState(false);

  const displayOwnPage = authenticatedUser && username === userID;

  const handleMessage = () => {
    if (!currentUser) {
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
    <div className='user-info-buttons'>
      <div className='edit-profile'>
        <Link to='/accounts/edit' aria-label='edit profile information'>
          <button className='edit-profile-btn'>Edit profile</button>
        </Link>
      </div>
      <div className='user-settings'>
        <button className='user-settings-btn' aria-label='user settings'>
          <img src={sprocket} alt='' aria-hidden='true' />
        </button>
      </div>
    </div>
  );

  const defaultPageButtons = (
    <div className='user-info-buttons'>
      <div className='follow-div'>{friendButton}</div>
      <div className='message-div'>
        <button
          className='message-button'
          aria-label='click to message user'
          type='button'
          onClick={handleMessage}
        >
          Message
        </button>
      </div>
      <div className='options-div'>
        <button
          className='options-button'
          aria-label='click for more options'
          onClick={() => setShowAdditionalOptionsModal(true)}
        >
          <img src={threeDots} alt='' aria-hidden='true' />
        </button>
      </div>
    </div>
  );

  const userInfoButtons =
    username === userID ? ownPageButtons : defaultPageButtons;

  const userStats = (
    <>
      <div>
        <span className='user-figure'>{userData?.postNo}</span>
        <span className='category'>
          {userData?.posts === 1 ? "post" : "posts"}
        </span>
      </div>
      <div className='clickable' onClick={() => setShowFollowerModal(true)}>
        <span className='user-figure'>{userData?.followerNo}</span>
        {userData?.followerNo === 1 ? "follower" : "followers"}
        <span className='category'></span>
      </div>
      <div className='clickable' onClick={() => setShowFollowingModal(true)}>
        <span className='user-figure'>{userData?.followingNo}</span>
        following<span className='category'></span>
      </div>
    </>
  );

  return (
    <div className='profile-main-container fg-1 flex-container flex-column flex-align-center'>
      <div className='profile-content-container width-100 flex-container flex-column'>
        <div className='profile-top flex-container'>
          <ProfileUserImage displayOwnPage={displayOwnPage} user={userData} />
          <div className='user-info'>
            <div className='user-info-top'>
              <div className='user-info-username'>{userID}</div>
              {userInfoButtons}
            </div>
            <div className='user-info-middle'>{userStats}</div>
            <div className='user-info-bottom'>
              <div className='user-fullname'>{userData?.fullname}</div>
              <div className='user-bio'>{userData?.userBio}</div>
            </div>
          </div>
        </div>
        <div className='user-info-stats-small'>{userStats}</div>
        <div className='profile-bottom'>
          <div className='display-selector'>
            <div
              className={
                displaySelector === "posts"
                  ? "display-selector-individual active"
                  : "display-selector-individual"
              }
              aria-label='click to see user posts'
              onClick={() => setDisplaySelector("posts")}
            >
              <img src={grid} alt='grid icon'></img>
              <span>POSTS</span>
            </div>
            {displayOwnPage && (
              <div
                className={
                  displaySelector === "saved"
                    ? "display-selector-individual active"
                    : "display-selector-individual"
                }
                aria-label='click to see saved posts'
                onClick={() => setDisplaySelector("saved")}
              >
                <img src={bookmark} alt='bookmark icon'></img>
                <span>SAVED</span>
              </div>
            )}
            <div
              className={
                displaySelector === "tagged"
                  ? "display-selector-individual active"
                  : "display-selector-individual"
              }
              aria-label='click to see posts where user was tagged'
              onClick={() => setDisplaySelector("tagged")}
            >
              <img src={tagged} alt='tagged user icon'></img>
              <span>TAGGED</span>
            </div>
          </div>
          <div className='img-feed-container'>
            {displaySelector === "posts" && (
              <ProfilePosts userID={userData?._id} />
            )}
            {displaySelector === "saved" && (
              <ProfileSaved userID={userData?._id} />
            )}
            {displaySelector === "tagged" && (
              <ProfileTagged userID={userData?._id} />
            )}
          </div>
        </div>
      </div>
      <div className='footer-container'>
        <Footer />
      </div>
      {showAdditionalOptionsModal && (
        <AdditionalOptionsModal
          setShowAdditionalOptionsModal={setShowAdditionalOptionsModal}
          setShowReportModal={setShowReportModal}
        />
      )}
      {showReportModal && (
        <ReportModal
          setShowReportModal={setShowReportModal}
          reportDistinction={"User"}
          reportId={userData?._id}
        />
      )}
      {showFollowingModal && (
        <FollowingModal
          setShowFollowingModal={setShowFollowingModal}
          user={userData}
        />
      )}
      {showFollowerModal && (
        <FollowerModal
          setShowFollowerModal={setShowFollowerModal}
          user={userData}
        />
      )}
    </div>
  );
};

export default ProfileMain;
