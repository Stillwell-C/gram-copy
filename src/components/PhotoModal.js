import SinglePost from "./SinglePost";
import FocusTrapModalParent from "./FocusTrapModalParent";

import "../scss/photoModal.scss";

const PhotoModal = ({ setShowPhotoModal, post, queryKey }) => {
  const handleClose = () => {
    setShowPhotoModal(false);
  };

  const content = (
    <div
      className='photo-modal-container modal-body'
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

  return <FocusTrapModalParent content={content} handleClose={handleClose} />;
};

export default PhotoModal;
