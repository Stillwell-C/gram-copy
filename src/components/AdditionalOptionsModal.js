import React from "react";
import "../scss/additionalOptionsModal.scss";
import { useNavigate } from "react-router-dom";
import FocusTrapModalParent from "./FocusTrapModalParent";

const AdditionalOptionsModal = ({
  setShowReportModal,
  setShowAdditionalOptionsModal,
  post,
  goToPost,
  copyLink,
  setShowDeleteConfirmation,
  setShowTagUsersModal,
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
        aria-label='click to close'
      >
        Go to post
      </button>
    </div>
  );

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(`http://localhost:3000/p/${post._id}`);
  };

  const copyLinkButton = (
    <div className='select-option-div'>
      <button
        className='cancel-button'
        onClick={handleCopyLink}
        aria-label='click to close'
      >
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
        aria-label='click to close'
      >
        Tag Users
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
        aria-label='click to close'
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
            aria-label='Click to report'
            onClick={handleShowReportModal}
          >
            Report
          </button>
        </div>
        {goToPost && goToPostButton}
        {copyLink && copyLinkButton}
        {setShowTagUsersModal && showTagUsersModalButton}
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
