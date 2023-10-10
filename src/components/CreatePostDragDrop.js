import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import useCloudinaryUpload from "../hooks/useCloudinaryUpload";

import photoImg from "../assets/photo-svgrepo-com.svg";

const CreatePostDragDrop = ({
  imgFileUpload,
  setImgFileUpload,
  setDragDropScreen,
  setImgUploadLoading,
  setImgUploadData,
  handleClose,
  handleClear,
}) => {
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const cloudinaryUpload = useCloudinaryUpload();

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

  const handleNextClick = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setImgFileUpload(e.target.files[0]);
    }
  };

  const onNextButtonClick = () => {
    inputRef.current.click();
  };

  useEffect(() => {
    setImgUploadLoading(true);

    const uploadFile = async () => {
      try {
        const cloudinaryResponse = await cloudinaryUpload(imgFileUpload);
        setImgUploadData(cloudinaryResponse);
        setImgUploadLoading(false);
      } catch (err) {
        handleClear();
        handleClose();
      }
    };

    if (imgFileUpload) uploadFile();
  }, [imgFileUpload]);

  const uploadForm = (
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
        onChange={handleNextClick}
      />
      <label
        id='initial-file-upload-label'
        className={`flex-container flex-column flex-align-center flex-justify-center height-100 ${
          dragActive ? "drag-active" : ""
        }`}
        htmlFor='intial-file-upload'
        aria-label='drop an image here or click the select from computer button below to upload image'
      >
        <div>
          <img
            className='media-upload-display-img themeable-icon'
            src={photoImg}
            alt='media'
          />
        </div>
        <div>Drag photos here</div>
        <div>
          <button
            className='initial-upload-button standard-button blue-button'
            onClick={onNextButtonClick}
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
  );

  const previewImgSRC = imgFileUpload ? URL.createObjectURL(imgFileUpload) : "";

  const previewImg = (
    <div className='upload-image-preview flex-container flex-justify-center flex-align-center height-100 width-100'>
      <img alt='User upload preview' src={previewImgSRC} />
    </div>
  );

  return (
    <div
      className='modal-container initial-create-post-display modal-body flex-container flex-column'
      role='dialog'
      aria-labelledby='dialog-header'
    >
      <div className='modal-header'>
        <div className={imgFileUpload ? "" : "hidden"}></div>
        <h2 id='dialog-header'>Create new post</h2>
        <div
          className={imgFileUpload ? "button-div" : "button-div hidden"}
          onClick={() => setDragDropScreen(false)}
        >
          <button aria-label='select image and proceed to next step of creating post'>
            Next
          </button>
        </div>
      </div>
      <div className='modal-content'>
        {!imgFileUpload ? uploadForm : previewImg}
      </div>
    </div>
  );
};

export default CreatePostDragDrop;
