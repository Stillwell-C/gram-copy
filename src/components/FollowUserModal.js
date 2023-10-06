import "../scss/followUserModal.scss";
import { FadeLoader } from "react-spinners";
import FocusTrapModalParent from "./FocusTrapModalParent";
import FadeLoaderStyled from "./FadeLoaderStyled";

const FollowUserModal = ({
  users,
  modalType,
  setShowModal,
  isLoading,
  isFetching,
}) => {
  const handleClose = () => {
    setShowModal(false);
  };

  const content = (
    <div className='follow-user-modal-container modal-body'>
      <div
        className='follow-user-modal-body flex-container flex-column flex-align-center width-100 height-100'
        role='dialog'
        aria-labelledby='dialog-header'
      >
        <div className='follow-user-modal-header width-100 flex-container flex-align-center flex-justify-center'>
          <div></div>
          <div className='modal-header-text flex-container flex-align-center flex-justify-center'>
            <h2 id='dialog-header'>
              {modalType.slice(0, 1).toUpperCase() + modalType.slice(1)}
            </h2>
          </div>
          <div className='close-div flex-container flex-align-center'>
            <button
              onClick={() => setShowModal(false)}
              aria-label='click to close'
              className='transparent-button'
            >
              &times;
            </button>
          </div>
        </div>
        <div className='follow-user-modal-content width-100 height-100 flex-container flex-column'>
          {users}
          <div className='loading-div'>
            {(isFetching || isLoading) && <FadeLoaderStyled />}
          </div>
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

export default FollowUserModal;
