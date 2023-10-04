import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectErrorMessage,
  setError,
  setErrorMessage,
} from "../features/error/errorSlice";
import FocusTrapModalParent from "./FocusTrapModalParent";

const ErrorModal = () => {
  const dispatch = useDispatch();

  const errorMessage = useSelector(selectErrorMessage);

  const errorMessageText = errorMessage.length
    ? errorMessage
    : "An error occurred. Please try again.";

  const handleDismiss = () => {
    dispatch(setError(false));
    dispatch(setErrorMessage(""));
    window.location.reload();
  };

  const modalContent = (
    <div
      className='error-modal modal-body flex-container flex-column flex-align-center'
      role='dialog'
      aria-describedby='error-modal-header'
    >
      <div className='error-modal-top-div margin-top-1 flex-container flex-column flex-align-center'>
        <h2 id='error-modal-header' className='margin-btm-1'>
          Error
        </h2>
        <p>{errorMessageText}</p>
      </div>
      <div className='error-modal-btn-div flex-container flex-column flex-align-center flex-justify-center'>
        <button
          className='transparent-button'
          id='error-modal-btn'
          onClick={handleDismiss}
        >
          Dismiss
        </button>
      </div>
    </div>
  );

  return (
    <FocusTrapModalParent
      content={modalContent}
      initialFocus='#error-modal-btn'
      showClose={false}
    />
  );
};

export default ErrorModal;
