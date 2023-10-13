import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";

import { addNewPost } from "./postApiRoutes";
import useAuth from "../../hooks/useAuth";
import { setError, setErrorRefreshPage } from "../error/errorSlice";

import PostInformationForm from "../../components/PostInformationForm";

const CreatePostInformationForm = ({
  handleClear,
  handleClose,
  imgUploadData,
  imgUploadLoading,
  imgFileUpload,
}) => {
  const queryClient = useQueryClient();
  const { id } = useAuth();

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    caption: "",
    location: "",
    altText: "",
  });

  const [showCaptionInfo, setShowCaptionInfo] = useState(false);
  const [expandAccessibility, setExpandAccessibility] = useState(false);

  const addNewPostMutation = useMutation({
    mutationFn: addNewPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["profilePosts", id]);

      setFormData({
        caption: "",
        location: "",
        altText: "",
      });

      setShowCaptionInfo(false);
      setExpandAccessibility(false);
      handleClear();
      handleClose();
    },
    onError: () => {
      dispatch(setError(true));
      dispatch(setErrorRefreshPage(false));
    },
  });

  const handleExpand = (e) => {
    e.preventDefault();
    setExpandAccessibility(!expandAccessibility);
  };

  const uploadPost = async (e) => {
    e.preventDefault();
    if (!imgUploadData) {
      dispatch(setError(true));
      dispatch(setErrorRefreshPage(false));
      handleClear();
      handleClose();
      return;
    }
    const uploadData = {
      ...formData,
      imgData: imgUploadData,
    };
    addNewPostMutation.mutate({ ...uploadData });
  };

  return (
    <div
      className='modal-body modal-container secondary-create-post-display'
      role='dialog'
      aria-labelledby='dialog-header'
    >
      <form onSubmit={uploadPost} className='height-100'>
        <div className='modal-header'>
          <div></div>
          <h2 id='dialog-header'>Create new post</h2>
          <div className='button-div'>
            <button
              type='submit'
              aria-label='click to make post with image and input information'
              disabled={imgUploadLoading}
              className='disabled'
            >
              Share
            </button>
          </div>
        </div>
        <div className='modal-content flex-container flex-column'>
          <div className='modal-body-left height-100 flex-container flex-align-center flex-justify-center'>
            <img
              className='upload-image-preview'
              alt='User upload preview'
              src={URL.createObjectURL(imgFileUpload)}
            />
          </div>
          <PostInformationForm
            formData={formData}
            setFormData={setFormData}
            handleExpand={handleExpand}
            showCaptionInfo={showCaptionInfo}
            setShowCaptionInfo={setShowCaptionInfo}
            expandAccessibility={expandAccessibility}
            accessibilityImgURL={URL.createObjectURL(imgFileUpload)}
          />
        </div>
      </form>
    </div>
  );
};

export default CreatePostInformationForm;
