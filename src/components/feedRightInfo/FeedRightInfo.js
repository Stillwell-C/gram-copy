import { signOut } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { auth } from "../../firebase";
import defaultProfilePic from "../../assets/Default_pfp.svg";
import useGetLoggedInUserInfo from "../../hooks/useGetLoggedInUserInfo";
import useGetLoggedInUserInfoFunction from "../../hooks/useGetLoggedInUserInfoFunction";
import Footer from "../footer/Footer";
import "./feedRightInfo.scss";

const FeedRightInfo = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  //TODO: combine this with same call in userFeed and send down through state
  // const { userImgURL, username, fullname } = useGetLoggedInUserInfo();
  const getUserInfo = useGetLoggedInUserInfoFunction();

  const [pageData, setPageData] = useState({
    username: "",
    userImgURL: defaultProfilePic,
    fullname: "",
  });

  useEffect(() => {
    if (!currentUser.displayName) return;
    console.log(currentUser);
    setPageData({
      username: currentUser.displayName,
      userImgURL: currentUser.photoURL,
      fullname: "",
    });
    const getAllPageData = async () => {
      const fetchedUserInfo = await getUserInfo().catch((err) =>
        console.log(err.code)
      );
      setPageData({
        username: fetchedUserInfo.username,
        userImgURL: fetchedUserInfo.userImgURL,
        fullname: fetchedUserInfo.fullname,
      });
    };
    getAllPageData();
  }, [currentUser]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
    // dispatch({
    //   type: "LOGOUT",
    // });
  };

  return (
    <div className='right-info-container'>
      {currentUser && (
        <div className='top-user-info'>
          <Link to={`/${pageData.username}`}>
            <img src={pageData.userImgURL} alt='user profile' />
          </Link>
          <div className='user-name-div'>
            <Link to={`/${pageData.username}`}>
              <div className='user-name-top'>{pageData.username}</div>
            </Link>
            <div className='user-name-bottom'>{pageData.fullname}</div>
          </div>
          <div className='button-div'>
            <button aria-label='click to log out' onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
      )}
      {!currentUser && (
        <div className='login-div'>
          <Link to='/accounts/login' aria-label='click to log in'>
            <button>Log In</button>
          </Link>
          <Link to='/accounts/emailsignup' aria-label='click to sign up'>
            <button>Sign Up</button>
          </Link>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default FeedRightInfo;
