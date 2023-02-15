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
import PostFeed from "../postFeed/PostFeed";
import useUploadProfileImg from "../../hooks/useUploadProfileImg";
import useGetLoggedInUserInfo from "../../hooks/useGetLoggedInUserInfo";
import useGetUserInfoFunction from "../../hooks/useGetUserInfoFunction";
import useGetLoggedInUserInfoFunction from "../../hooks/useGetLoggedInUserInfoFunction";

const ProfileMain = () => {
  const { userParam } = useParams();
  const { currentUser } = useContext(AuthContext);
  const getPageInfo = useGetUserInfoFunction();
  const getUserInfo = useGetLoggedInUserInfoFunction();

  const uploadImg = useUploadProfileImg();

  const imgInputRef = useRef(null);

  const [pageLoading, setPageLoading] = useState(true);
  const [displaySelector, setDisplaySelector] = useState("posts");
  const [pageInfo, setPageInfo] = useState({});

  useEffect(() => {
    setPageLoading(true);
    if (userParam === currentUser.username) {
      setPageInfo({
        pageUserPosts: currentUser.userPosts,
        pageFollowers: currentUser.followers,
        pageFollowing: currentUser.following,
        pageFullname: currentUser.fullname,
        pageUserBio: currentUser.userBio,
        pageUserImgURL: currentUser.userImgURL,
        userLikedPosts: currentUser.likedPosts,
        userSavedPosts: currentUser.savedPosts,
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
      console.log("info", dataObj);
    };
    getAllPageData();
  }, [userParam]);

  useEffect(() => {
    setPageLoading(false);
  }, [pageInfo.pageUserImgURL]);

  const handleImgClick = () => {
    imgInputRef.current.click();
  };

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

  return (
    <div className='profile-main-container'>
      {!pageLoading && (
        <div className='profile-content-container'>
          <div className='profile-top'>
            <div className='profile-img-div'>
              <button
                title='Click to change profile picture'
                aria-label='click to change profile photo'
                onClick={handleImgClick}
              >
                <img src={pageInfo.pageUserImgURL} alt='user profile' />
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
            </div>
            <div className='user-info'>
              <div className='user-info-top'>
                <div className='user-info-username'>{userParam}</div>
                <div className='edit-profile'>
                  <Link
                    to='/accounts/edit'
                    aria-label='click to edit profile information'
                  >
                    <button className='edit-profile-btn'>Edit profile</button>
                  </Link>
                </div>
                <div className='user-settings'>
                  <button className='user-settings-btn'>
                    <img src={sprocket} alt='cog wheel' />
                  </button>
                </div>
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
                    {pageInfo.pageFollowers.length}
                  </span>
                  {pageInfo.pageFollowers.length === 1
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
              {userParam === currentUser.username && (
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
              {userParam !== currentUser.username && (
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
                <PostFeed
                  userParam={userParam}
                  userPosts={pageInfo.pageUserPosts}
                  userLikedPosts={pageInfo.userLikedPosts}
                  userSavedPosts={pageInfo.userSavedPosts}
                  userQueryInput={"saved"}
                />
              )}
              {displaySelector === "tagged" && (
                <PostFeed
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
