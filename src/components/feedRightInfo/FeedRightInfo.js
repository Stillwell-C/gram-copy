import React, { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import "./feedRightInfo.scss";

const FeedRightInfo = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className='right-info-container'>
      <div className='top-user-info'>
        <img src={currentUser.userImgURL} alt='user profile' />
        <div className='user-name-div'>
          <div className='user-name-top'>{currentUser.username}</div>
          <div className='user-name-bottom'>{currentUser.fullname}</div>
        </div>
        <div className='button-div'>
          <button>Switch</button>
        </div>
      </div>

      <div className='footer'>
        <nav>
          <a href='#'>About</a>
          <a href='https://github.com/Stillwell-C'>Github</a>
          <a href='#'>Press</a>
          <a href='#'>API</a>
          <a href='#'>Jobs</a>
          <a href='#'>Privacy</a>
          <a href='#'>Terms</a>
          <a href='#'>Locations</a>
          <a href='#'>Language</a>
        </nav>
        <span className='copyright'>© Stillwell-C</span>
      </div>
    </div>
  );
};

export default FeedRightInfo;
