import "./photoModal.scss";
import SinglePost from "../SinglePost";

const PhotoModal = ({ setShowPhotoModal, post, queryKey }) => {
  return (
    <>
      <div className='photo-modal-container'>
        <SinglePost
          post={post}
          queryKey={queryKey}
          setShowPhotoModal={setShowPhotoModal}
        />
      </div>
      <div className='modal-overlay' onClick={() => setShowPhotoModal(false)}>
        <div className='modal-overlay-close'>
          <button
            className='delete-button'
            aria-label='Click to close delete account modal'
          >
            &times;
          </button>
        </div>
      </div>
    </>
  );
};

export default PhotoModal;
