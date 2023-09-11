import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "./footer/Footer";
import useAuth from "../hooks/useAuth";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";

const FeedRightInfo = () => {
  const { authenticatedUser, username, fullname, img } = useAuth();

  const userImgURL = `https://res.cloudinary.com/danscxcd2/image/upload/w_150,c_fill/${img}`;

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) window.location.reload();
  }, [isSuccess]);

  useEffect(() => {
    if (isError) window.location.reload();
  }, [isError]);

  const handleLogout = () => {
    if (authenticatedUser) {
      sendLogout();
    }
  };

  return (
    <div className='right-info-container'>
      {authenticatedUser && (
        <div className='top-user-info flex-container'>
          <Link to={`/${username}`}>
            <img
              className='circular-image'
              src={userImgURL}
              alt='user profile'
            />
          </Link>
          <div className='user-name-div fg-1 flex-container flex-column flex-justify-center flex-align-start'>
            <Link to={`/${username}`}>
              <div className='user-name-top'>{username}</div>
            </Link>
            <div className='user-name-bottom'>{fullname}</div>
          </div>
          <div className='button-div flex-container flex-align-center flex-justify-center'>
            <button aria-label='click to log out' onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
      )}
      {!authenticatedUser && (
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
