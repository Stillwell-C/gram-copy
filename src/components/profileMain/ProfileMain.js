import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import sprocket from "../../assets/gear-wide-svgrepo-com.svg";
import grid from "../../assets/grid-svgrepo-com.svg";
import bookmark from "../../assets/bookmark-svgrepo-com.svg";
import tagged from "../../assets/user-square-svgrepo-com.svg";
import Footer from "../footer/Footer";
import NoUserImgProfileFeed from "../noUserImgProfileFeed/NoUserImgProfileFeed";
import { useParams } from "react-router-dom";
import useGetUserInfo from "../../hooks/useGetUserInfo";
import "./profileMain.scss";
import CreatePostModal from "../createPostModal/CreatePostModal";
import useGetUserPosts from "../../hooks/useGetUserPosts";
import ProfilePostCard from "../profilePostCard/ProfilePostCard";

const ProfileMain = () => {
  const { userParam } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState();
  const { userPosts, followers, following, fullname, userBio, userImgURL } =
    useGetUserInfo(userParam, "username");
  const { loading, error, errorInfo, posts, hasMoreData } = useGetUserPosts(
    userParam,
    1
  );
  const [pageLoading, setPageLoading] = useState(true);
  const [displayPostModal, setDisplayPostModal] = useState(false);
  const [displaySelector, setDisplaySelector] = useState("posts");

  useEffect(() => {
    setPageLoading(true);
  }, []);

  useEffect(() => {
    setUserInfo({
      userPosts: userPosts,
      followers: followers,
      following: following,
      fullname: fullname,
      userBio: userBio,
      userImgURL: userImgURL,
    });
    setPageLoading(false);
  }, [userImgURL]);

  const handleAddPostModal = () => {
    setDisplayPostModal(true);
  };

  return (
    <div className='profile-main-container'>
      {!pageLoading && !loading && (
        <div className='profile-content-container'>
          <div className='profile-top'>
            <div className='profile-img-div'>
              <img src={userInfo.userImgURL} alt='user profile' />
            </div>
            <div className='user-info'>
              <div className='user-info-top'>
                <div className='user-info-username'>{userInfo.username}</div>
                <div className='edit-profile'>
                  <button className='edit-profile-btn'>Edit profile</button>
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
                    {userInfo.userPosts.length}
                  </span>
                  <span className='category'>
                    {userInfo.userPosts.length === 1 ? "post" : "posts"}
                  </span>
                </div>
                <div>
                  <span className='user-figure'>
                    {userInfo.followers.length}
                  </span>
                  {userInfo.followers.length === 1 ? "follower" : "followers"}
                  <span className='category'></span>
                </div>
                <div>
                  <span className='user-figure'>
                    {userInfo.following.length}
                  </span>
                  following<span className='category'></span>
                </div>
              </div>
              <div className='user-info-bottom'>
                <div className='user-fullname'>{userInfo.fullname}</div>
                <div className='user-bio'>{userInfo.userBio}</div>
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
              {userInfo.userPosts.length < 1 && (
                <NoUserImgProfileFeed handleAddPostModal={handleAddPostModal} />
              )}
              {userInfo.userPosts.length >= 1 &&
                posts.map((post) => (
                  <ProfilePostCard key={post.id} post={post} />
                ))}
            </div>
          </div>
        </div>
      )}
      <div className='footer-container'>
        <Footer />
      </div>
      {displayPostModal && (
        <CreatePostModal setDisplayPostModal={setDisplayPostModal} />
      )}
    </div>
  );
};

export default ProfileMain;
