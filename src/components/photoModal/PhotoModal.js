import "./photoModal.scss";
import SinglePost from "../SinglePost";
import FocusTrapModalParent from "../FocusTrapModalParent";

const PhotoModal = ({ setShowPhotoModal, post, queryKey }) => {
  const handleClose = () => {
    setShowPhotoModal(false);
  };

  const content = (
    <div
      className='photo-modal-container'
      role='dialog'
      aria-label='user post dialog'
    >
      <SinglePost
        post={post}
        queryKey={queryKey}
        setShowPhotoModal={setShowPhotoModal}
      />
    </div>
  );

  <FocusTrapModalParent content={content} handleClose={handleClose} />;
};

export default PhotoModal;
