import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from "../footer/Footer";
import "./profileMain.scss";
import sprocket from "../../assets/gear-wide-svgrepo-com.svg";
import grid from "../../assets/grid-svgrepo-com.svg";
import bookmark from "../../assets/bookmark-svgrepo-com.svg";
import tagged from "../../assets/user-square-svgrepo-com.svg";
import defaultProfilePic from "../../assets/Default_pfp.svg";
import threeDots from "../../assets/three-dots-line-svgrepo-com.svg";
import useUploadProfileImg from "../../hooks/useUploadProfileImg";
import useGetLoggedInUserInfoFunction from "../../hooks/useGetLoggedInUserInfoFunction";
import useFollowUnfollow from "../../hooks/useFollowUnfollow";
import AdditionalOptionsModal from "../additionalOptionsModal/AdditionalOptionsModal";
import ReportModal from "../reportModal/ReportModal";
import FollowUserModal from "../followUserModal/FollowUserModal";
import useAuth from "../../hooks/useAuth";
import { useGetUserQuery } from "../../features/users/usersApiSlice";
import { useDispatch } from "react-redux";
import { setLoading } from "../../features/display/displaySlice";
import ProfilePosts from "../ProfilePosts";
import ProfileSaved from "../ProfileSaved";
import ProfileTagged from "../ProfileTagged";
import { useQuery } from "react-query";
import { getUser } from "../../features/users/usersApiRoutes";

const ProfileMain = () => {
  const { userID } = useParams();
  const { authenticatedUser, username } = useAuth();
  const dispatch = useDispatch();

  // const url = `https://res.cloudinary.com/danscxcd2/image/upload/w_150,c_fill/${imgURL}`;

  const [pageInfo, setPageInfo] = useState({
    followers: 0,
    following: 0,
    posts: 0,
    fullname: "",
    userBio: "",
    id: "",
    banned: false,
    userImgURL: defaultProfilePic,
  });
  const [displayOwnPage, setDisplayOwnPage] = useState(false);

  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userInfo", userID],
    queryFn: () => getUser(userID),
  });

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading(true));
      return;
    }
    dispatch(setLoading(false));
    setPageInfo({
      followers: userData?.followerNo,
      following: userData?.followingNo,
      posts: userData?.postNo,
      fullname: userData?.fullname,
      userBio: userData?.userBio,
      id: userData?._id,
      banned: userData?.false,
      userImgURL: `https://res.cloudinary.com/danscxcd2/image/upload/w_150,c_fill/${userData?.userImgKey}`,
    });
    console.log(userData);
  }, [isLoading]);

  // useEffect(() => {
  //   console.log("success ", isSuccess);
  //   if (!isSuccess) return;

  // }, [isSuccess]);

  useEffect(() => {
    if (authenticatedUser && username === userID) {
      setDisplayOwnPage(true);
    }
  }, []);

  const { currentUser } = useContext(AuthContext);
  // const getPageInfo = useGetUserInfoFunction();
  const getUserInfo = useGetLoggedInUserInfoFunction();

  const navigate = useNavigate();
  const uploadImg = useUploadProfileImg();
  const { follow: followUser, unfollow: unfollowUser } = useFollowUnfollow();

  const imgInputRef = useRef(null);

  const [displaySelector, setDisplaySelector] = useState("posts");
  const [isFriend, setIsFriend] = useState(null);
  const [initialFriend, setInitialFriend] = useState(false);
  const [friendOffset, setFriendOffset] = useState(0);
  const [friendButton, setFriendButton] = useState(null);
  const [showAdditionalOptionsModal, setShowAdditionalOptionsModal] =
    useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [followModalType, setFollowModalType] = useState(null);

  const handleImgClick = () => {
    imgInputRef.current.click();
  };

  useEffect(() => {
    if (!isFriend) {
      setFriendButton(
        <button
          className='follow-button'
          aria-label={`click to follow user`}
          type='button'
          onClick={handleFollow}
        >
          Follow
        </button>
      );
      return;
    }
    setFriendButton(
      <button
        className='follow-button'
        aria-label={`click to unfollow user`}
        type='button'
        onClick={handleUnfollow}
      >
        Unfollow
      </button>
    );
  }, [isFriend]);

  const handleImgUpload = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setPageInfo({
        ...pageInfo,
        pageUserImgURL: URL.createObjectURL(e.target.files[0]),
      });
      uploadImg(e.target.files[0]);
    }
  };

  const handleFollow = () => {
    if (!currentUser) {
      navigate("/accounts/login");
      return;
    }
    followUser(pageInfo.id);
    setIsFriend(true);
    initialFriend ? setFriendOffset(0) : setFriendOffset(1);
  };

  const handleUnfollow = () => {
    if (!currentUser) {
      navigate("/accounts/login");
      return;
    }
    unfollowUser(pageInfo.id);
    setIsFriend(false);
    initialFriend ? setFriendOffset(-1) : setFriendOffset(0);
  };

  const handleMessage = () => {
    if (!currentUser) {
      navigate("/accounts/login");
      return;
    }
    navigate("/direct/inbox");
  };

  const handleFollowerModal = () => {
    setFollowModalType("followers");
    setShowFollowModal(true);
  };

  const handleFollowingModal = () => {
    setFollowModalType("following");
    setShowFollowModal(true);
  };

  const profileImg = displayOwnPage ? (
    <>
      <button
        title='Click to change profile picture'
        aria-label='click to change profile photo'
        onClick={handleImgClick}
      >
        <img src={pageInfo.userImgURL} alt='user profile' />
      </button>
      <form>
        <input
          type='file'
          className='file-upload-input'
          accept='image/png, image/jpeg'
          ref={imgInputRef}
          onChange={handleImgUpload}
        />
      </form>
    </>
  ) : (
    <img src={pageInfo.userImgURL} alt='user profile' />
  );

  const userInfoButtons = displayOwnPage ? (
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
  ) : (
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

  return (
    <div className='profile-main-container'>
      <div className='profile-content-container'>
        <div className='profile-top'>
          <div className='profile-img-div'>{profileImg}</div>
          <div className='user-info'>
            <div className='user-info-top'>
              <div className='user-info-username'>{userID}</div>
              {userInfoButtons}
            </div>
            <div className='user-info-middle'>
              <div>
                <span className='user-figure'>{pageInfo.posts}</span>
                <span className='category'>
                  {pageInfo.posts === 1 ? "post" : "posts"}
                </span>
              </div>
              <div className='clickable' onClick={handleFollowerModal}>
                <span className='user-figure'>
                  {pageInfo.followers + friendOffset}
                </span>
                {pageInfo.followers + friendOffset === 1
                  ? "follower"
                  : "followers"}
                <span className='category'></span>
              </div>
              <div className='clickable' onClick={handleFollowingModal}>
                <span className='user-figure'>{pageInfo.following}</span>
                following<span className='category'></span>
              </div>
            </div>
            <div className='user-info-bottom'>
              <div className='user-fullname'>{pageInfo.fullname}</div>
              <div className='user-bio'>{pageInfo.bio}</div>
            </div>
          </div>
        </div>
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
              <ProfilePosts userID={pageInfo.id} />
            )}
            {displaySelector === "saved" && (
              <ProfileSaved userID={pageInfo.id} />
            )}
            {displaySelector === "tagged" && (
              <ProfileTagged userID={pageInfo.id} />
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
          reportDistinction={"user"}
          reportId={pageInfo.id}
        />
      )}
      {showFollowModal && (
        <FollowUserModal
          setShowFollowModal={setShowFollowModal}
          modalType={followModalType}
          // pageFollowers={pageInfo.pageFollowers}
          // pageFollowing={pageInfo.pageFollowing}
        />
      )}
    </div>
  );
};

export default ProfileMain;
