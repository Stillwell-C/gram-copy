import React, { useEffect, useRef, useState } from "react";
import photoImg from "../assets/photo-svgrepo-com.svg";
import axios from "axios";
import gramCopyApi from "../app/api/gramCopyApi";

const api_key = "419818228346469";
const cloud_name = "danscxcd2";

const CreatePostDragDrop = ({
  imgFileUpload,
  setImgFileUpload,
  setDragDropScreen,
  setImgUploadLoading,
  setImgUploadData,
}) => {
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef(null);

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
    console.log("click handled");
    if (e.target.files && e.target.files[0]) {
      setImgFileUpload(e.target.files[0]);
    }
  };

  const onNextButtonClick = () => {
    inputRef.current.click();
  };

  useEffect(() => {
    setImgUploadLoading(true);
    //upload file uploaded by user to Cloudinary
    const uploadFile = async () => {
      const signatureResponse = await gramCopyApi.get("/auth/cloud-signature");

      const imgData = new FormData();
      imgData.append("file", imgFileUpload);
      imgData.append("api_key", api_key);
      imgData.append("signature", signatureResponse.data.signature);
      imgData.append("timestamp", signatureResponse.data.timestamp);

      console.log(imgData);

      try {
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

        console.log(cloudinaryRes);

        setImgUploadData({
          public_id: cloudinaryRes.data.public_id,
          version: cloudinaryRes.data.version,
          signature: cloudinaryRes.data.signature,
          format: cloudinaryRes.data.format,
        });
        setImgUploadLoading(false);
      } catch (err) {
        console.log(err);
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
    <img
      className='upload-image-preview'
      alt='User upload preview'
      src={previewImgSRC}
    />
  );

  return (
    <div
      className='modal-container initial'
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
          <button aria-label='select image and proceed to next step'>
            Next
          </button>
        </div>
      </div>
      <div className='modal-body droparea'>
        {!imgFileUpload ? uploadForm : previewImg}
      </div>
    </div>
  );
};

export default CreatePostDragDrop;
