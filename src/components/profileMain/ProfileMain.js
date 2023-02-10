import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { Link, useParams } from "react-router-dom";

import Footer from "../footer/Footer";

import useGetUserInfo from "../../hooks/useGetUserInfo";
import "./profileMain.scss";
import sprocket from "../../assets/gear-wide-svgrepo-com.svg";
import grid from "../../assets/grid-svgrepo-com.svg";
import bookmark from "../../assets/bookmark-svgrepo-com.svg";
import tagged from "../../assets/user-square-svgrepo-com.svg";
import PostFeed from "../postFeed/PostFeed";

const ProfileMain = () => {
  const { userParam } = useParams();
  const { currentUser } = useContext(AuthContext);
  const { userPosts, followers, following, fullname, userBio, userImgURL } =
    useGetUserInfo(userParam, "username");

  const [pageLoading, setPageLoading] = useState(true);
  const [displaySelector, setDisplaySelector] = useState("posts");

  useEffect(() => {
    setPageLoading(true);
  }, []);

  useEffect(() => {
    setPageLoading(false);
  }, [userImgURL]);

  return (
    <div className='profile-main-container'>
      {!pageLoading && (
        <div className='profile-content-container'>
          <div className='profile-top'>
            <div className='profile-img-div'>
              <img src={userImgURL} alt='user profile' />
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
                  <span className='user-figure'>{userPosts.length}</span>
                  <span className='category'>
                    {userPosts.length === 1 ? "post" : "posts"}
                  </span>
                </div>
                <div>
                  <span className='user-figure'>{followers.length}</span>
                  {followers.length === 1 ? "follower" : "followers"}
                  <span className='category'></span>
                </div>
                <div>
                  <span className='user-figure'>{following.length}</span>
                  following<span className='category'></span>
                </div>
              </div>
              <div className='user-info-bottom'>
                <div className='user-fullname'>{fullname}</div>
                <div className='user-bio'>{userBio}</div>
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
                  userPosts={userPosts}
                  userQueryInput={"posts"}
                />
              )}
              {displaySelector === "saved" && (
                <PostFeed
                  userParam={userParam}
                  userPosts={userPosts}
                  userQueryInput={"saved"}
                />
              )}
              {displaySelector === "tagged" && (
                <PostFeed
                  userParam={userParam}
                  userPosts={userPosts}
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
