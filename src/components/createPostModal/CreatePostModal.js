import { useState, useRef, useEffect, useContext } from "react";
import "./createPostModal.scss";
import photoImg from "../../assets/photo-svgrepo-com.svg";
import locationImg from "../../assets/location-svgrepo-com.svg";
import downArrow from "../../assets/down-arrow-backup-2-svgrepo-com.svg";
import { storage, db, auth } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { AuthContext } from "../../context/authContext";
import useGetRandomDate from "../../hooks/useGetRandomDate";
import axios from "axios";
import { useAddNewPostMutation } from "../../features/posts/postsApiSlice";

const api_key = "419818228346469";
const cloud_name = "danscxcd2";

const CreatePostModal = ({ setDisplayPostModal }) => {
  const { currentUser } = useContext(AuthContext);

  const [initial, setInitial] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [imgFileUpload, setImgFileUpload] = useState(null);
  const [imgUploadData, setImgUploadData] = useState({});
  const [formData, setFormData] = useState({
    caption: "",
    location: "",
    altText: "",
  });
  const [showCaptionInfo, setShowCaptionInfo] = useState(false);
  const [expandAccessibility, setExpandAccessibility] = useState(false);

  const [addNewPost, { isLoading, isSuccess, isError, error }] =
    useAddNewPostMutation();

  useEffect(() => {
    //upload file uploaded by user to Cloudinary
    const uploadFile = async () => {
      const signatureResponse = await axios.get(
        "http://localhost:3500/auth/cloud-signature"
      );

      const imgData = new FormData();
      imgData.append("file", imgFileUpload);
      imgData.append("api_key", api_key);
      imgData.append("signature", signatureResponse.data.signature);
      imgData.append("timestamp", signatureResponse.data.timestamp);

      console.log(imgData);

      const cloudinaryRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`,
        imgData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          //Remove for production
          onUploadProgress: function (e) {
            console.log(e.loaded / e.total);
          },
        }
      );

      setImgUploadData({
        public_id: cloudinaryRes.data.public_id,
        version: cloudinaryRes.data.version,
        signature: cloudinaryRes.data.signature,
      });
    };

    if (imgFileUpload) uploadFile();
  }, [imgFileUpload]);

  const inputRef = useRef(null);

  const handleClose = () => {
    setDisplayPostModal(false);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
      return;
    }
    if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImgFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleInitialClick = (e) => {
    e.preventDefault();
    console.log("click handled");
    if (e.target.files && e.target.files[0]) {
      setImgFileUpload(e.target.files[0]);
    }
  };

  const onInitialButtonClick = () => {
    inputRef.current.click();
  };

  const handleExpand = (e) => {
    e.preventDefault();
    setExpandAccessibility(!expandAccessibility);
  };

  const uploadPost = async (e) => {
    e.preventDefault();
    if (!imgUploadData) {
      console.log("Error. No image data found.");
      return;
    }
    const uploadData = {
      ...formData,
      user: "64c1dff6ba375748febb3853",
      imgData: imgUploadData,
    };
    console.log(uploadData);
    addNewPost({ ...uploadData });
  };

  useEffect(() => {
    if (isError) {
    }
    console.log(error);
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
    }
    console.log("success");
  }, [isSuccess]);

  return (
    <>
      {initial ? (
        <div className='modal-container initial'>
          <div className='modal-header'>
            <div className={imgFileUpload ? "" : "hidden"}></div>
            <h2>Create new post</h2>
            <div
              className={imgFileUpload ? "button-div" : "button-div hidden"}
              onClick={() => setInitial(false)}
            >
              <button aria-label='select image and proceed to next step'>
                Next
              </button>
            </div>
          </div>
          <div className='modal-body droparea'>
            {!imgFileUpload ? (
              <form
                className='initial-file-upload-form'
                onDragEnter={handleDrag}
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type='file'
                  id='initial-file-upload'
                  className='intial-file-upload'
                  accept='image/png, image/jpeg'
                  ref={inputRef}
                  onChange={handleInitialClick}
                />
                <label
                  id='initial-file-upload-label'
                  className={dragActive ? "drag-active" : ""}
                  htmlFor='intial-file-upload'
                  aria-label='drop an image here or click the select from computer button below to upload image'
                >
                  <div>
                    <img
                      className='media-upload-display-img'
                      src={photoImg}
                      alt='media'
                    />
                  </div>
                  <div>Drag photos here</div>
                  <div>
                    <button
                      className='initial-upload-button'
                      onClick={onInitialButtonClick}
                      aria-label='click here to select an image from your computer to upload'
                    >
                      Select from computer
                    </button>
                  </div>
                </label>
                {dragActive && (
                  <div
                    className='drag-file-element'
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  ></div>
                )}
              </form>
            ) : (
              <img
                className='upload-image-preview'
                alt='User upload preview'
                src={URL.createObjectURL(imgFileUpload)}
              />
            )}
          </div>
        </div>
      ) : (
        <div className='modal-container secondary'>
          <form onSubmit={uploadPost}>
            <div className='modal-header'>
              <div></div>
              <h2>Create new post</h2>
              <div className='button-div'>
                <button
                  type='submit'
                  aria-label='click to make post with image and input information'
                >
                  Share
                </button>
              </div>
            </div>
            <div className='modal-body'>
              <div className='modal-body-left'>
                <img
                  className='upload-image-preview'
                  alt='User upload preview'
                  src={URL.createObjectURL(imgFileUpload)}
                />
              </div>
              <div className='modal-body-right'>
                <div className='top-user-info'>
                  <img
                    className='userImg'
                    src={currentUser.photoURL}
                    alt='user profile'
                  />
                  <div>{currentUser.displayName}</div>
                </div>
                <div className='bottom-user-input'>
                  <label aria-label='Enter a caption for your image. Maximum length is 2200 characters.'>
                    <textarea
                      id='caption'
                      name='caption'
                      className='caption-textarea'
                      value={formData.caption}
                      onChange={(e) => {
                        setFormData({ ...formData, caption: e.target.value });
                      }}
                      maxLength='2200'
                      placeholder='Write a caption...'
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
                      Captions longer than 125 characters appear truncated in
                      feed.
                    </span>
                  </div>
                  <div className='location-input-div segmented-div'>
                    <label aria-label='enter the image location'>
                      <input
                        type='text'
                        name='photoLocation'
                        id='photoLocation'
                        value={formData.location}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            location: e.target.value,
                          });
                        }}
                        placeholder='Add location'
                        maxLength='50'
                      />
                    </label>
                    <img src={locationImg} alt='map location pinpoint icon' />
                  </div>
                  <div
                    className={
                      expandAccessibility
                        ? "accessibility-info segmented-div expand"
                        : "accessibility-info segmented-div"
                    }
                  >
                    <div className='accessibility-top' onClick={handleExpand}>
                      <div>Accessibility</div>
                      <button
                        aria-label='open menu to add image description to assist users with visual impairments'
                        aria-controls='accessibility-input-container'
                        aria-expanded={expandAccessibility ? "true" : "false"}
                      >
                        <img
                          className='down-arrow-img'
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
                        Alt text describes your photos for people with visual
                        impairments. Alt text will be automatically created for
                        your photos or you can choose to write your own.
                      </div>
                      <div className='accessibility-input-div'>
                        <div className='accessibility-img-div'>
                          <img
                            className='upload-image-accessibility-mini'
                            alt='preview of uploaded file'
                            src={URL.createObjectURL(imgFileUpload)}
                            width='44px'
                          />
                        </div>
                        <label aria-label='Add a description of the image. Maximum 140 characters.'>
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
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
      <div className='modal-overlay' onClick={handleClose}>
        <div className='modal-overlay-close'>
          <button aria-label='click to close image upload menu'>&times;</button>
        </div>
      </div>
    </>
  );
};

export default CreatePostModal;
