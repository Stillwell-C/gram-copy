import React from "react";
import "./additionalOptionsModal.scss";

const AdditionalOptionsModal = ({
  setShowReportModal,
  setShowAdditionalOptionsModal,
}) => {
  const handleShowReportModal = () => {
    setShowAdditionalOptionsModal(false);
    setShowReportModal(true);
  };

  return (
    <>
      <div className='options-modal-container'>
        <div className='options-modal-body'>
          <div className='options-modal-header'>
            <button
              onClick={() => setShowAdditionalOptionsModal(false)}
              aria-label='click to close'
            >
              &times;
            </button>
          </div>
          <div className='select-option-div'>
            <button
              className='report-button'
              aria-label='Click to report'
              onClick={handleShowReportModal}
            >
              Report
            </button>
          </div>
        </div>
      </div>
      <div
        className='options-modal-overlay'
        aria-label='click to close'
        onClick={() => setShowAdditionalOptionsModal(false)}
      ></div>
    </>
  );
};

export default AdditionalOptionsModal;
