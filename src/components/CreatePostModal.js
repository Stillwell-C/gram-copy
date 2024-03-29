import { useState } from "react";
import FocusTrapModalParent from "./FocusTrapModalParent";

import CreatePostDragDrop from "./CreatePostDragDrop";
import CreatePostInformationForm from "../features/posts/CreatePostInformationForm";

import "../scss/createAndEditPost.scss";

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
          handleClear={handleClear}
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
