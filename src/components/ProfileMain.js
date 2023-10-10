import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Footer from "./Footer";
import "../scss/profileMain.scss";
import grid from "../assets/grid-svgrepo-com.svg";
import bookmark from "../assets/bookmark-svgrepo-com.svg";
import tagged from "../assets/user-square-svgrepo-com.svg";
import threeDots from "../assets/three-dots-line-svgrepo-com.svg";
import AdditionalOptionsModal from "./AdditionalOptionsModal";
import ReportModal from "../features/reports/ReportModal";
import useAuth from "../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLoadingState,
  setLoading,
} from "../features/display/displaySlice";
import ProfilePosts from "../features/posts/ProfilePosts";
import ProfileSaved from "../features/saved/ProfileSaved";
import ProfileTagged from "../features/posts/ProfileTagged";
import { useQuery } from "react-query";
import { getUser } from "../features/users/usersApiRoutes";
import FollowingModal from "../features/follow/FollowingModal";
import FollowerModal from "../features/follow/FollowerModal";
import FollowButton from "../features/follow/FollowButton";
import UnfollowButton from "../features/follow/UnfollowButton";
import ProfileUserImage from "../features/users/ProfileUserImage";
import useParseNumber from "../hooks/useParseNumber";
import BannedAccount from "./BannedAccount";
import useParseTextForLinks from "../hooks/useTextParseForLinks";
import ProfileTop from "./ProfileTop";

const ProfileMain = () => {
  const { userID } = useParams();
  const { authenticatedUser, username } = useAuth();

  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const parseNum = useParseNumber();
  const parseTextForLinks = useParseTextForLinks();

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
    if (isError && error?.response?.status === 400) {
      navigate("/error", {
        replace: true,
        state: {
          errorTitle: "User not found.",
          errorMessage:
            "The link you followed may be broken, or the page may have been removed.",
        },
      });
    }
    if (isError) {
      navigate("/error", {
        replace: true,
        state: {
          errorCode: error?.response?.status,
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

  useEffect(() => {
    document
      .getElementById("content-outlet")
      .scroll({ top: 0, behavior: "auto" });
  }, []);

  const [displaySelector, setDisplaySelector] = useState("posts");
  const [showAdditionalOptionsModal, setShowAdditionalOptionsModal] =
    useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowerModal, setShowFollowerModal] = useState(false);

  const displayOwnPage = authenticatedUser && username === userID;

  const profileTop = (
    <ProfileTop
      displayOwnPage={displayOwnPage}
      userData={userData}
      setShowAdditionalOptionsModal={setShowAdditionalOptionsModal}
      setShowFollowerModal={setShowFollowerModal}
      setShowFollowingModal={setShowFollowingModal}
    />
  );

  const profilePage = (
    <main className='profile-main-container fg-1 flex-container flex-column flex-align-center'>
      <div className='profile-content-container width-100 flex-container flex-column'>
        {profileTop}
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
              <img src={grid} alt='' />
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
                <img src={bookmark} alt='' />
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
              <img src={tagged} alt='' />
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

  const returnContent = isLoading ? null : pageContent;

  return returnContent;
};

export default ProfileMain;
