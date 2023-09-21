import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/authContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from "./Footer";
import "../scss/profileMain.scss";
import grid from "../assets/grid-svgrepo-com.svg";
import bookmark from "../assets/bookmark-svgrepo-com.svg";
import tagged from "../assets/user-square-svgrepo-com.svg";
import threeDots from "../assets/three-dots-line-svgrepo-com.svg";
import AdditionalOptionsModal from "./AdditionalOptionsModal";
import ReportModal from "./ReportModal";
import useAuth from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { setLoading } from "../features/display/displaySlice";
import ProfilePosts from "./ProfilePosts";
import ProfileSaved from "./ProfileSaved";
import ProfileTagged from "./ProfileTagged";
import { useQuery } from "react-query";
import { getUser } from "../features/users/usersApiRoutes";
import FollowingModal from "./FollowingModal";
import FollowerModal from "./FollowerModal";
import FollowButton from "./FollowButton";
import UnfollowButton from "./UnfollowButton";
import ProfileUserImage from "./ProfileUserImage";
import useParseNumber from "../hooks/useParseNumber";
import BannedAccount from "./BannedAccount";

const ProfileMain = () => {
  const { userID } = useParams();
  const { authenticatedUser, username } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const parseNum = useParseNumber();

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
        <img src={threeDots} alt='' aria-hidden='true' />
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

  const profilePage = (
    <main className='profile-main-container fg-1 flex-container flex-column flex-align-center'>
      <div className='profile-content-container width-100 flex-container flex-column'>
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
              <div className='user-bio'>{userData?.userBio}</div>
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
        <div className='profile-bottom width-100'>
          <nav
            className='display-selector'
            aria-label='Toggle posts displayed on profile page navigation menu'
          >
            <button
              className={`display-selector-individual transparent-button ${
                displaySelector === "posts" ? "active" : ""
              }`}
              aria-label='display user posts'
              aria-current={displaySelector === "posts"}
              onClick={() => setDisplaySelector("posts")}
            >
              <img src={grid} alt='grid icon'></img>
              <span>POSTS</span>
            </button>
            {displayOwnPage && (
              <button
                className={`display-selector-individual transparent-button ${
                  displaySelector === "saved" ? "active" : ""
                }`}
                aria-label='display saved posts'
                aria-current={displaySelector === "saved"}
                onClick={() => setDisplaySelector("saved")}
              >
                <img src={bookmark} alt='bookmark icon'></img>
                <span>SAVED</span>
              </button>
            )}
            <button
              className={`display-selector-individual transparent-button ${
                displaySelector === "tagged" ? "active" : ""
              }`}
              aria-label='display tagged posts'
              aria-current={displaySelector === "tagged"}
              onClick={() => setDisplaySelector("tagged")}
            >
              <img src={tagged} alt='tagged user icon'></img>
              <span>TAGGED</span>
            </button>
          </nav>
          <div className='profile-img-feed-container'>
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
    </main>
  );

  const bannedUserPage = <BannedAccount />;

  const pageContent = !userData?.banned ? profilePage : bannedUserPage;

  const returnedContent = !isLoading ? pageContent : null;

  return returnedContent;
};

export default ProfileMain;
