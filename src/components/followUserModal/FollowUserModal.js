import "./followUserModal.scss";
import { FadeLoader } from "react-spinners";
import FocusTrapModalParent from "../FocusTrapModalParent";

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
    <div className='follow-user-modal-container'>
      <div
        className='follow-user-modal-body'
        role='dialog'
        aria-labelledby='dialog-header'
      >
        <div className='follow-user-modal-header'>
          <div></div>
          <div className='modal-header-text'>
            <h2 id='dialog-header'>
              {modalType.slice(0, 1).toUpperCase() + modalType.slice(1)}
            </h2>
          </div>
          <div className='close-div'>
            <button
              onClick={() => setShowModal(false)}
              aria-label='click to close'
            >
              &times;
            </button>
          </div>
        </div>
        <div className='follow-user-modal-content'>
          {users}
          <div className='loading-div'>
            {(isFetching || isLoading) && (
              <FadeLoader cssOverride={{ scale: "0.5" }} color='#333' />
            )}
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
