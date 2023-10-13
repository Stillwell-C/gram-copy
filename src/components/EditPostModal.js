import FocusTrapModalParent from "./FocusTrapModalParent";

import "../scss/postModal.scss";
import EditPostInformationForm from "../features/posts/EditPostInformationForm";

const EditPostModal = ({ setShowEditPostModal, post }) => {
  const handleClose = () => {
    setShowEditPostModal(false);
  };

  const content = (
    <EditPostInformationForm post={post} handleClose={handleClose} />
  );

  return <FocusTrapModalParent content={content} handleClose={handleClose} />;
};

export default EditPostModal;
