import React from "react";
import "./additionalOptionsModal.scss";
import { useNavigate } from "react-router-dom";
import FocusTrapModalParent from "../FocusTrapModalParent";

const AdditionalOptionsModal = ({
  setShowReportModal,
  setShowAdditionalOptionsModal,
  post,
  goToPost,
  copyLink,
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

  const content = (
    <div
      className='options-modal-container'
      role='dialog'
      aria-label='additional options dialog'
    >
      <div className='options-modal-body'>
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

  return <FocusTrapModalParent content={content} handleClose={handleClose} />;
};

export default AdditionalOptionsModal;
