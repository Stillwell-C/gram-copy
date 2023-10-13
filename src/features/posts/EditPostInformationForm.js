import React, { useState } from "react";
import PostInformationForm from "../../components/PostInformationForm";
import { useMutation, useQueryClient } from "react-query";
import useAuth from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { updatePost } from "./postApiRoutes";
import { setError, setErrorRefreshPage } from "../error/errorSlice";

const EditPostInformationForm = ({ post, handleClose, setShowPhotoModal }) => {
  const queryClient = useQueryClient();
  const { id } = useAuth();

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    caption: post?.caption,
    location: post?.location,
    altText: post?.altText,
    id: post?._id,
  });

  const [showCaptionInfo, setShowCaptionInfo] = useState(false);
  const [expandAccessibility, setExpandAccessibility] = useState(false);

  const addNewPostMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries(["profilePosts", id]);

      setFormData({
        caption: "",
        location: "",
        altText: "",
        id: "",
      });

      setShowCaptionInfo(false);
      setExpandAccessibility(false);
      handleClose();
      if (setShowPhotoModal) setShowPhotoModal(false);
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
    if (!post?._id) {
      dispatch(setError(true));
      dispatch(setErrorRefreshPage(false));
      handleClose();
      return;
    }
    addNewPostMutation.mutate(formData);
  };

  const imgURLxSmall = `https://res.cloudinary.com/danscxcd2/image/upload/w_50/${post?.imgKey}`;
  const imgURLSmall = `https://res.cloudinary.com/danscxcd2/image/upload/w_500/${post?.imgKey}`;
  const imgURLMedium = `https://res.cloudinary.com/danscxcd2/image/upload/w_1000/${post?.imgKey}`;
  const imgURLLarge = `https://res.cloudinary.com/danscxcd2/image/upload/w_1500/${post?.imgKey}`;
  const imgURL = `https://res.cloudinary.com/danscxcd2/image/upload/${post?.imgKey}`;

  return (
    <div
      className='secondary-create-post-display'
      role='dialog'
      aria-labelledby='dialog-header'
    >
      <form onSubmit={uploadPost} className='height-100'>
        <div className='modal-header'>
          <div></div>
          <h2 id='dialog-header'>Edit post</h2>
          <div className='button-div'>
            <button
              type='submit'
              aria-label='click to make post with image and input information'
              className='disabled'
            >
              Update
            </button>
          </div>
        </div>
        <div className='modal-content flex-container flex-column'>
          <div className='modal-body-left height-100 flex-container flex-align-center flex-justify-center'>
            <img
              alt={post.altText ? post.altText : "post upload"}
              srcSet={`${imgURLSmall} 500w, ${imgURLMedium} 1000w, ${imgURLLarge} 1500w, ${imgURL} 2000w`}
              sizes='(max-width: 349px) 500px, (max-width: 647px) 1000px, (max-width: 1249px) 1500px, 2000px'
              src={imgURLMedium}
            />
          </div>
          <PostInformationForm
            formData={formData}
            setFormData={setFormData}
            handleExpand={handleExpand}
            showCaptionInfo={showCaptionInfo}
            setShowCaptionInfo={setShowCaptionInfo}
            expandAccessibility={expandAccessibility}
            accessibilityImgURL={imgURLxSmall}
          />
        </div>
      </form>
    </div>
  );
};

export default EditPostInformationForm;
