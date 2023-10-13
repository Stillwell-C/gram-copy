import FocusTrapModalParent from "./FocusTrapModalParent";

import "../scss/postModal.scss";
import EditPostInformationForm from "../features/posts/EditPostInformationForm";

const EditPostModal = ({
  setShowEditPostModal,
  post,
  setShowPhotoModal = false,
}) => {
  const handleClose = () => {
    setShowEditPostModal(false);
  };

  const content = (
    <EditPostInformationForm
      post={post}
      handleClose={handleClose}
      setShowPhotoModal={setShowPhotoModal}
    />
  );

  return <FocusTrapModalParent content={content} handleClose={handleClose} />;
};

export default EditPostModal;
