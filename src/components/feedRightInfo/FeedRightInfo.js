import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import useGetLoggedInUserInfo from "../../hooks/useGetLoggedInUserInfo";
import Footer from "../footer/Footer";
import "./feedRightInfo.scss";

const FeedRightInfo = () => {
  const { currentUser, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  //TODO: combine this with same call in userFeed and send down through state
  const { userImgURL, username, fullname } = useGetLoggedInUserInfo();

  const handleLogout = () => {
    navigate("/");
    dispatch({
      type: "LOGOUT",
    });
  };

  return (
    <div className='right-info-container'>
      {currentUser && (
        <div className='top-user-info'>
          <Link to={`/${username}`}>
            <img src={userImgURL} alt='user profile' />
          </Link>
          <div className='user-name-div'>
            <Link to={`/${username}`}>
              <div className='user-name-top'>{username}</div>
            </Link>
            <div className='user-name-bottom'>{fullname}</div>
          </div>
          <div className='button-div'>
            <button aria-label='click to log out' onClick={() => handleLogout}>
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
