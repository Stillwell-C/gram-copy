import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";

import Footer from "../../components/Footer";
import AdditionalOptionsModal from "../../components/AdditionalOptionsModal";
import ReportModal from "../reports/ReportModal";
import { setLoading } from "../display/displaySlice";
import ProfilePosts from "../posts/ProfilePosts";
import ProfileSaved from "../saved/ProfileSaved";
import ProfileTagged from "../posts/ProfileTagged";
import { getUser } from "./usersApiRoutes";
import FollowingModal from "../follow/FollowingModal";
import FollowerModal from "../follow/FollowerModal";
import BannedAccount from "../../components/BannedAccount";
import ProfileTop from "../../components/ProfileTop";

import useAuth from "../../hooks/useAuth";

import "../../scss/profileMain.scss";

import grid from "../../assets/grid-svgrepo-com.svg";
import bookmark from "../../assets/bookmark-svgrepo-com.svg";
import tagged from "../../assets/user-square-svgrepo-com.svg";

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
    if (isError && error?.response?.status === 400) {
      navigate("/error", {
        replace: true,
        state: {
          errorTitle: "User not found.",
          errorMessage:
            "The link you followed may be broken, or the page may have been removed.",
        },
      });
    } else if (isError) {
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
