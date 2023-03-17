import React from "react";
import camera from "../../assets/camera-player-multimedia-svgrepo-com.svg";
import "./noUserImgProfileFeed.scss";

const NoUserImgProfileFeed = ({ handleAddPostModal }) => {
  return (
    <div className='feed-empty-container'>
      <div className='share-photo-info'>
        <button
          type='button'
          className='camera-icon-button'
          aria-label='upload an image from your computer'
          onClick={handleAddPostModal}
        >
          <img src={camera} alt='camera' />
        </button>
        <h3 className='header-text'>Share Photos</h3>
        <div className='sub-text'>
          When you share photos, they will appear on your profile
        </div>
        <button
          type='button'
          className='bottom-upload-button'
          aria-label='upload an image from your computer'
          onClick={handleAddPostModal}
        >
          Share your first photo
        </button>
      </div>
    </div>
  );
};

export default NoUserImgProfileFeed;
