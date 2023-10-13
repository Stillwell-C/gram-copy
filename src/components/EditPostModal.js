import FocusTrapModalParent from "./FocusTrapModalParent";

import "../scss/postModal.scss";
import EditPostInformationForm from "../features/posts/EditPostInformationForm";

const EditPostModal = ({ setClosePostModal, post }) => {
  const handleClose = () => {
    setClosePostModal(true);
  };

  const content = (
    <EditPostInformationForm post={post} handleClose={handleClose} />
  );

  return <FocusTrapModalParent content={content} handleClose={handleClose} />;
};

export default EditPostModal;
