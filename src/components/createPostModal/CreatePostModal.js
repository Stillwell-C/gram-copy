import { useState, useEffect } from "react";
import "./createPostModal.scss";
import { addNewPost } from "../../features/posts/postApiRoutes";
import CreatePostDragDrop from "../CreatePostDragDrop";
import CreatePostInformationForm from "../CreatePostInformationForm";

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

  return (
    <>
      {dragDropScreen ? (
        <CreatePostDragDrop
          imgFileUpload={imgFileUpload}
          setImgFileUpload={setImgFileUpload}
          setDragDropScreen={setDragDropScreen}
          setImgUploadData={setImgUploadData}
          setImgUploadLoading={setImgUploadLoading}
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
      <div className='modal-overlay' onClick={handleClose}>
        <div className='modal-overlay-close'>
          <button aria-label='click to close image upload menu'>&times;</button>
        </div>
      </div>
    </>
  );
};

export default CreatePostModal;
