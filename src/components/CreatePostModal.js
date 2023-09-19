import { useState, useEffect } from "react";
import "../scss/createPostModal.scss";
import { addNewPost } from "../features/posts/postApiRoutes";
import CreatePostDragDrop from "./CreatePostDragDrop";
import CreatePostInformationForm from "./CreatePostInformationForm";
import FocusTrapModalParent from "./FocusTrapModalParent";

const CreatePostModal = ({ setDisplayPostModal }) => {
  const [dragDropScreen, setDragDropScreen] = useState(true);
  const [imgFileUpload, setImgFileUpload] = useState(null);
  const [imgUploadLoading, setImgUploadLoading] = useState(false);
  const [imgUploadData, setImgUploadData] = useState({});

  const handleClose = () => {
    setDisplayPostModal(false);
  };

  const handleClear = () => {
    setImgFileUpload(null);
    setImgUploadData({});
  };

  useEffect(() => {
    if (addNewPost.isError) {
      console.log(addNewPost.error);
    }
  }, [addNewPost.isError]);

  const content = (
    <>
      {dragDropScreen ? (
        <CreatePostDragDrop
          imgFileUpload={imgFileUpload}
          setImgFileUpload={setImgFileUpload}
          setDragDropScreen={setDragDropScreen}
          setImgUploadData={setImgUploadData}
          setImgUploadLoading={setImgUploadLoading}
          handleClose={handleClose}
        />
      ) : (
        <CreatePostInformationForm
          handleClear={handleClear}
          handleClose={handleClose}
          imgUploadData={imgUploadData}
          imgUploadLoading={imgUploadLoading}
          imgFileUpload={imgFileUpload}
        />
      )}
    </>
  );

  return <FocusTrapModalParent content={content} handleClose={handleClose} />;
};

export default CreatePostModal;
