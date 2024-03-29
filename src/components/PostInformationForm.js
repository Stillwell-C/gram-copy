import React from "react";
import useAuth from "../hooks/useAuth";
import useLimitLineBreaks from "../hooks/useLimitLineBreaks";

import locationImg from "../assets/location-svgrepo-com.svg";
import downArrow from "../assets/down-arrow-backup-2-svgrepo-com.svg";

const PostInformationForm = ({
  formData,
  setFormData,
  handleExpand,
  showCaptionInfo,
  setShowCaptionInfo,
  expandAccessibility,
  accessibilityImgURL,
}) => {
  const { username, img } = useAuth();

  const limitLineBreaks = useLimitLineBreaks();

  const userImgURL = `https://res.cloudinary.com/danscxcd2/image/upload/w_150,c_fill/${img}`;

  return (
    <div className='modal-body-right flex-container flex-align-start flex-justify-start flex-column height-100 width-100'>
      <div className='top-user-info flex-container flex-align-center flex-justify-start'>
        <img
          className='userImg circular-image'
          src={userImgURL}
          alt='user profile'
        />
        <div>{username}</div>
      </div>
      <div className='bottom-user-input'>
        <label>
          <textarea
            id='caption'
            name='caption'
            className='caption-textarea'
            value={formData.caption}
            onChange={(e) => {
              setFormData({
                ...formData,
                caption: limitLineBreaks(e.target.value, 10),
              });
            }}
            maxLength='2200'
            placeholder='Write a caption...'
            aria-label='image caption'
          />
        </label>
        <div className='textarea-info'>
          <div onClick={() => setShowCaptionInfo(!showCaptionInfo)}>
            {formData.caption ? formData.caption.length : 0}/2,200
          </div>
          <span
            className={
              showCaptionInfo
                ? "caption-length-info"
                : "caption-length-info hidden"
            }
          >
            Captions longer than 125 characters appear truncated in feed.
          </span>
        </div>
        <div className='location-input-div segmented-div width-100 flex-container flex-align-center'>
          <label>
            <input
              type='text'
              name='photoLocation'
              id='photoLocation'
              autoComplete='off'
              spellCheck='false'
              value={formData.location}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  location: e.target.value,
                });
              }}
              placeholder='Add location'
              maxLength='50'
              aria-label='image location'
            />
          </label>
          <img
            src={locationImg}
            alt=''
            aria-hidden='true'
            className='themeable-icon'
          />
        </div>
        <div
          className={`accessibility-info width-100 flex-container flex-column flex-align-start flex-justify-center segmented-div ${
            expandAccessibility ? "expand" : ""
          }`}
        >
          <div
            className='accessibility-top flex-container flex-align-center width-100'
            onClick={handleExpand}
          >
            <div>Accessibility</div>
            <button
              aria-label='open menu to add image description to assist users with visual impairments'
              aria-controls='accessibility-input-container'
              className='transparent-button'
            >
              <img
                className='down-arrow-img themeable-icon'
                aria-expanded={expandAccessibility ? "true" : "false"}
                src={downArrow}
                alt=''
                aria-hidden='true'
              />
            </button>
          </div>
          <div
            className='accessibility-body'
            id='accessibility-input-container'
          >
            <div className='accessibility-info-text'>
              Alt text describes your photos for people with visual impairments.
              Alt text will be automatically created for your photos or you can
              choose to write your own.
            </div>
            <div className='accessibility-input-div flex-container flex-align-center flex-justify-start'>
              <div className='accessibility-img-div flex-container flex-align-center'>
                <img
                  className='upload-image-accessibility-mini'
                  alt='preview of uploaded file'
                  src={accessibilityImgURL}
                  width='44px'
                />
              </div>
              <label>
                <input
                  type='text'
                  name='userAltText'
                  id='userAltText'
                  placeholder='Write alt text...'
                  maxLength='140'
                  value={formData.altText}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      altText: e.target.value,
                    })
                  }
                  autoComplete='off'
                  spellCheck='false'
                  aria-label='input image description to assist users with visual impairments'
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostInformationForm;
