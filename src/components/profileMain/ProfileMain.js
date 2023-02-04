import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import sprocket from "../../assets/gear-wide-svgrepo-com.svg";
import grid from "../../assets/grid-svgrepo-com.svg";
import bookmark from "../../assets/bookmark-svgrepo-com.svg";
import Footer from "../footer/Footer";
import NoUserImgProfileFeed from "../noUserImgProfileFeed/NoUserImgProfileFeed";
import { useParams } from "react-router-dom";
import useGetUserInfo from "../../hooks/useGetUserInfo";
import "./profileMain.scss";

const ProfileMain = () => {
  const { userParam } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState();
  const { userPosts, followers, following, fullname, userBio } = useGetUserInfo(
    userParam,
    "username"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (userParam === currentUser.username) {
      setUserInfo(currentUser);
    } else {
      setUserInfo({
        userPosts: userPosts,
        followers: followers,
        following: following,
        fullname: fullname,
        userBio: userBio,
      });
    }
    setLoading(false);
  }, []);

  return (
    <div className='profile-main-container'>
      {!loading && (
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
                  <span className='category'>posts</span>
                </div>
                <div>
                  <span className='user-figure'>
                    {userInfo.followers.length}
                  </span>
                  followers<span className='category'></span>
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
              <div className='display-selector-individual'>
                <img src={grid} alt='grid icon'></img>
                <span>POSTS</span>
              </div>
              <div className='display-selector-individual'>
                <img src={bookmark} alt='bookmark icon'></img>
                <span>SAVED</span>
              </div>
            </div>
            <div className='img-feed-container'>
              {userInfo.userPosts.length < 5 && <NoUserImgProfileFeed />}
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
