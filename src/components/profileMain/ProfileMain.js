import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { Link, useParams } from "react-router-dom";

import Footer from "../footer/Footer";

import useGetUserInfo from "../../hooks/useGetUserInfo";
import "./profileMain.scss";
import sprocket from "../../assets/gear-wide-svgrepo-com.svg";
import grid from "../../assets/grid-svgrepo-com.svg";
import bookmark from "../../assets/bookmark-svgrepo-com.svg";
import tagged from "../../assets/user-square-svgrepo-com.svg";
import defaultProfilePic from "../../assets/Default_pfp.svg";
import threeDots from "../../assets/three-dots-line-svgrepo-com.svg";
import PostFeed from "../postFeed/PostFeed";
import useUploadProfileImg from "../../hooks/useUploadProfileImg";
import useGetLoggedInUserInfo from "../../hooks/useGetLoggedInUserInfo";
import useGetUserInfoFunction from "../../hooks/useGetUserInfoFunction";
import useGetLoggedInUserInfoFunction from "../../hooks/useGetLoggedInUserInfoFunction";
import useFollowUnfollow from "../../hooks/useFollowUnfollow";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import PostFeedFromArr from "../postFeedFromArr/PostFeedFromArr";

const ProfileMain = () => {
  const { userParam } = useParams();
  const { currentUser } = useContext(AuthContext);
  const getPageInfo = useGetUserInfoFunction();
  const getUserInfo = useGetLoggedInUserInfoFunction();

  const uploadImg = useUploadProfileImg();
  const { follow: followUser, unfollow: unfollowUser } = useFollowUnfollow();

  const imgInputRef = useRef(null);

  const [pageLoading, setPageLoading] = useState(true);
  const [displaySelector, setDisplaySelector] = useState("posts");
  const [pageInfo, setPageInfo] = useState({});
  const [pageUserUid, setPageUserUid] = useState(null);
  const [isFriend, setIsFriend] = useState(null);
  const [initialFriend, setInitialFriend] = useState(false);
  const [friendOffset, setFriendOffset] = useState(0);
  const [friendButton, setFriendButton] = useState(null);

  useEffect(() => {
    setPageLoading(true);
    if (userParam === currentUser.username) {
      setPageInfo({
        pageUserPosts: [],
        pageFollowers: [],
        pageFollowing: [],
        pageFullname: [],
        pageUserBio: [],
        pageUserImgURL: currentUser.photoURL,
        pageUid: "",
        userLikedPosts: [],
        userSavedPosts: [],
      });
    }
    if (userParam !== currentUser.username) {
      setPageInfo({
        pageUserPosts: [],
        pageFollowers: [],
        pageFollowing: [],
        pageFullname: [],
        pageUserBio: [],
        pageUserImgURL: defaultProfilePic,
        userLikedPosts: [],
        userSavedPosts: [],
      });
    }
    const getAllPageData = async () => {
      const pageInfo = await getPageInfo(userParam, "username");
      const userInfo = await getUserInfo();
      const dataObj = {
        pageUserPosts: pageInfo.userPosts,
        pageFollowers: pageInfo.followers,
        pageFollowing: pageInfo.following,
        pageFullname: pageInfo.fullname,
        pageUserBio: pageInfo.userBio,
        pageUserImgURL: pageInfo.userImgURL,
        userLikedPosts: userInfo.likedPosts,
        userSavedPosts: userInfo.savedPosts,
      };
      setPageInfo(dataObj);
      setPageUserUid(pageInfo.uid);
    };
    getAllPageData();
  }, [userParam]);

  useEffect(() => {
    setPageLoading(false);
  }, [pageInfo.pageUserImgURL]);

  useEffect(() => {
    const checkFriend = () => {
      const unsub = onSnapshot(doc(db, "userInfo", currentUser.uid), (doc) => {
        const snapShotData = doc.data();
        const friendStatus = snapShotData.following.includes(pageUserUid);
        setIsFriend(friendStatus);
        setInitialFriend(friendStatus);
      });

      return () => {
        unsub();
      };
    };

    if (userParam === currentUser.displayName) return;
    currentUser.uid && checkFriend();
    //see if there are better params for this
  }, [pageInfo, isFriend]);

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
        aria-label={`click to follow user`}
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
    followUser(pageUserUid);
    setIsFriend(true);
    initialFriend ? setFriendOffset(0) : setFriendOffset(1);
  };

  const handleUnfollow = () => {
    unfollowUser(pageUserUid);
    setIsFriend(false);
    initialFriend ? setFriendOffset(-1) : setFriendOffset(0);
  };

  return (
    <div className='profile-main-container'>
      {!pageLoading && (
        <div className='profile-content-container'>
          <div className='profile-top'>
            <div className='profile-img-div'>
              {userParam === currentUser.displayName ? (
                <button
                  title='Click to change profile picture'
                  aria-label='click to change profile photo'
                  onClick={handleImgClick}
                >
                  <img src={pageInfo.pageUserImgURL} alt='user profile' />
                </button>
              ) : (
                <img src={pageInfo.pageUserImgURL} alt='user profile' />
              )}
              {userParam === currentUser.displayName && (
                <form>
                  <input
                    type='file'
                    className='file-upload-input'
                    accept='image/png, image/jpeg'
                    ref={imgInputRef}
                    onChange={handleImgUpload}
                  />
                </form>
              )}
            </div>
            <div className='user-info'>
              <div className='user-info-top'>
                <div className='user-info-username'>{userParam}</div>
                {userParam === currentUser.displayName ? (
                  <>
                    <div className='edit-profile'>
                      <Link
                        to='/accounts/edit'
                        aria-label='click to edit profile information'
                      >
                        <button className='edit-profile-btn'>
                          Edit profile
                        </button>
                      </Link>
                    </div>
                    <div className='user-settings'>
                      <button className='user-settings-btn'>
                        <img src={sprocket} alt='cog wheel' />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className='follow-div'>{friendButton}</div>
                    <div className='message-div'>
                      <button
                        className='message-button'
                        aria-label='click to message user'
                        type='button'
                      >
                        Message
                      </button>
                    </div>
                    <div className='options-div'>
                      <button
                        className='options-button'
                        aria-label='click for more options'
                      >
                        <img src={threeDots} alt='icon of three dots' />
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className='user-info-middle'>
                <div>
                  <span className='user-figure'>
                    {pageInfo.pageUserPosts.length}
                  </span>
                  <span className='category'>
                    {pageInfo.pageUserPosts.length === 1 ? "post" : "posts"}
                  </span>
                </div>
                <div>
                  <span className='user-figure'>
                    {pageInfo.pageFollowers.length + friendOffset}
                  </span>
                  {pageInfo.pageFollowers.length + friendOffset === 1
                    ? "follower"
                    : "followers"}
                  <span className='category'></span>
                </div>
                <div>
                  <span className='user-figure'>
                    {pageInfo.pageFollowing.length}
                  </span>
                  following<span className='category'></span>
                </div>
              </div>
              <div className='user-info-bottom'>
                <div className='user-fullname'>{pageInfo.pageFullname}</div>
                <div className='user-bio'>{pageInfo.pageUserBio}</div>
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
              {userParam === currentUser.displayName && (
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
              {userParam !== currentUser.displayName && (
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
              )}
            </div>
            <div className='img-feed-container'>
              {displaySelector === "posts" && (
                <PostFeed
                  userParam={userParam}
                  userPosts={pageInfo.pageUserPosts}
                  userLikedPosts={pageInfo.userLikedPosts}
                  userSavedPosts={pageInfo.userSavedPosts}
                  userQueryInput={"posts"}
                />
              )}
              {displaySelector === "saved" && (
                <PostFeedFromArr
                  userParam={userParam}
                  userPosts={pageInfo.pageUserPosts}
                  userLikedPosts={pageInfo.userLikedPosts}
                  userSavedPosts={pageInfo.userSavedPosts}
                  userQueryInput={"saved"}
                />
              )}
              {displaySelector === "tagged" && (
                <PostFeedFromArr
                  userParam={userParam}
                  userPosts={pageInfo.pageUserPosts}
                  userLikedPosts={pageInfo.userLikedPosts}
                  userSavedPosts={pageInfo.userSavedPosts}
                  userQueryInput={"tagged"}
                />
              )}
            </div>
          </div>
        </div>
      )}
      <div className='footer-container'>
        <Footer />
      </div>
    </div>
  );
};

export default ProfileMain;
