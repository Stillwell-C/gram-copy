import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import useAuth from "../hooks/useAuth";
import LogoutButton from "../features/auth/LogoutButton";

const FeedRightInfo = () => {
  const { authenticatedUser, username, fullname, img } = useAuth();

  const userImgURL = `https://res.cloudinary.com/danscxcd2/image/upload/w_150,c_fill/${img}`;

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
            <LogoutButton />
          </div>
        </div>
      )}
      {!authenticatedUser && (
        <div className='login-div'>
          <Link to='/accounts/login' aria-label='click to log in'>
            <button className='grey-button'>Log In</button>
          </Link>
          <Link to='/accounts/emailsignup' aria-label='click to sign up'>
            <button className='grey-button'>Sign Up</button>
          </Link>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default FeedRightInfo;
