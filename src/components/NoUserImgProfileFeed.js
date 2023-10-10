import React from "react";

import camera from "../assets/camera-player-multimedia-svgrepo-com.svg";

const NoUserImgProfileFeed = ({ handleAddPostModal }) => {
  return (
    <div className='share-photo-info flex-container flex-column flex-align-center flex-justify-center'>
      <button
        type='button'
        className='camera-icon-button transparent-button'
        aria-label='upload an image from your computer'
        onClick={handleAddPostModal}
      >
        <img src={camera} alt='camera' />
      </button>
      <h2 className='header-text'>Share Photos</h2>
      <div className='sub-text'>
        When you share photos, they will appear on your profile
      </div>
      <button
        type='button'
        className='bottom-upload-button transparent-button'
        aria-label='upload an image from your computer'
        onClick={handleAddPostModal}
      >
        Share your first photo
      </button>
    </div>
  );
};

export default NoUserImgProfileFeed;
