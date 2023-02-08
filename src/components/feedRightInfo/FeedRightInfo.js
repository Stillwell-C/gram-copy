import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import Footer from "../footer/Footer";
import "./feedRightInfo.scss";

const FeedRightInfo = () => {
  const { currentUser, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

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
          <Link to={`/${currentUser.username}`}>
            <img src={currentUser.userImgURL} alt='user profile' />
          </Link>
          <div className='user-name-div'>
            <Link to={`/${currentUser.username}`}>
              <div className='user-name-top'>{currentUser.username}</div>
            </Link>
            <div className='user-name-bottom'>{currentUser.fullname}</div>
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
