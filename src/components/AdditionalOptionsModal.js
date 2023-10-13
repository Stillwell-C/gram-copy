import React from "react";
import { useNavigate } from "react-router-dom";

import FocusTrapModalParent from "./FocusTrapModalParent";

import "../scss/additionalOptionsModal.scss";

const AdditionalOptionsModal = ({
  setShowReportModal,
  setShowAdditionalOptionsModal,
  post,
  goToPost,
  goToProfile,
  copyLink,
  setShowDeleteConfirmation,
  setShowTagUsersModal,
  setShowEditPostModal,
}) => {
  const navigate = useNavigate();

  const handleShowReportModal = () => {
    setShowAdditionalOptionsModal(false);
    setShowReportModal(true);
  };

  const handleClose = () => {
    setShowAdditionalOptionsModal(false);
  };

  const goToPostButton = (
    <div className='select-option-div'>
      <button
        className='cancel-button'
        onClick={() => navigate(`/p/${post._id}`)}
        aria-label=''
      >
        Go to post
      </button>
    </div>
  );

  const goToProfileButton = (
    <div className='select-option-div'>
      <button
        className='cancel-button'
        onClick={() => navigate(`/${post.user.username}`)}
        aria-label=''
      >
        Go to profile
      </button>
    </div>
  );

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(
      `https://gram-copy.vercel.app/p/${post._id}`
    );
    handleClose();
  };

  const copyLinkButton = (
    <div className='select-option-div'>
      <button className='cancel-button' onClick={handleCopyLink} aria-label=''>
        Copy Link
      </button>
    </div>
  );

  const handleOpenTagUsersModal = () => {
    setShowAdditionalOptionsModal(false);
    setShowTagUsersModal(true);
  };

  const showTagUsersModalButton = (
    <div className='select-option-div'>
      <button
        className='cancel-button'
        onClick={handleOpenTagUsersModal}
        aria-label=''
      >
        Tag Users
      </button>
    </div>
  );

  const handleOpenEditPostModal = () => {
    setShowAdditionalOptionsModal(false);
    setShowEditPostModal(true);
  };

  const showEditPostModalButton = (
    <div className='select-option-div'>
      <button
        className='cancel-button'
        onClick={handleOpenEditPostModal}
        aria-label=''
      >
        Edit post
      </button>
    </div>
  );

  const handleDeletePost = () => {
    setShowAdditionalOptionsModal(false);
    setShowDeleteConfirmation(true);
  };

  const showDeleteConfirmationModalButton = (
    <div className='select-option-div'>
      <button
        className='cancel-button'
        onClick={handleDeletePost}
        aria-label=''
      >
        Delete Post
      </button>
    </div>
  );

  const content = (
    <div
      className='options-modal-container modal-body'
      role='dialog'
      aria-label='additional options dialog'
    >
      <div className='options-modal-body flex-container flex-column flex-align-center'>
        <div className='select-option-div'>
          <button
            className='report-button'
            aria-label='report'
            onClick={handleShowReportModal}
          >
            Report
          </button>
        </div>
        {goToPost && goToPostButton}
        {goToProfile && goToProfileButton}
        {copyLink && copyLinkButton}
        {setShowTagUsersModal && showTagUsersModalButton}
        {setShowEditPostModal && showEditPostModalButton}
        {setShowDeleteConfirmation && showDeleteConfirmationModalButton}
        <div className='select-option-div'>
          <button
            className='cancel-button'
            onClick={() => setShowAdditionalOptionsModal(false)}
            aria-label='click to close'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <FocusTrapModalParent
      content={content}
      handleClose={handleClose}
      showClose={false}
    />
  );
};

export default AdditionalOptionsModal;
