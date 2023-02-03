import React, { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Footer from "../footer/Footer";
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
      <Footer />
    </div>
  );
};

export default FeedRightInfo;
