import React from "react";
import { Link } from "react-router-dom";

import LogoutButton from "../features/auth/LogoutButton";

import useAuth from "../hooks/useAuth";

const FeedRightInfo = () => {
  const { username, fullname, img } = useAuth();

  const userImgURL = `https://res.cloudinary.com/danscxcd2/image/upload/w_150,c_fill/${img}`;

  return (
    <div className='top-user-info flex-container'>
      <Link to={`/${username}`}>
        <img className='circular-image' src={userImgURL} alt='user profile' />
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
  );
};

export default FeedRightInfo;
