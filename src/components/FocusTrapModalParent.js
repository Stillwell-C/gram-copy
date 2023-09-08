import FocusTrap from "focus-trap-react";
import React, { useEffect } from "react";

const FocusTrapModalParent = ({ content, handleClose }) => {
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
    <FocusTrap>
      <div>
        {content}
        <div className='modal-overlay' onClick={handleClose}>
          <div className='modal-overlay-close'>
            <button aria-label='click to close image upload menu'>
              &times;
            </button>
          </div>
        </div>
      </div>
    </FocusTrap>
  );
};

export default FocusTrapModalParent;
