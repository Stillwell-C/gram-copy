import FocusTrap from "focus-trap-react";
import React, { useEffect } from "react";
import "../scss/modal.scss";

const FocusTrapModalParent = ({
  content,
  handleClose,
  showClose = true,
  initialFocus = false,
}) => {
  useEffect(() => {
    //This will close modal with escape key
    function keyListener(e) {
      if (e.keyCode === 27) {
        handleClose();
      }
    }

    document.addEventListener("keydown", keyListener);

    return () => document.removeEventListener("keydown", keyListener);
  }, []);

  return (
    <FocusTrap focusTrapOptions={{ initialFocus }}>
      <div>
        <div>{content}</div>
        <div className='modal-overlay' onClick={handleClose}>
          <div className='modal-overlay-close'>
            {showClose && (
              <button aria-label='click to close image upload menu'>
                &times;
              </button>
            )}
          </div>
        </div>
      </div>
    </FocusTrap>
  );
};

export default FocusTrapModalParent;
