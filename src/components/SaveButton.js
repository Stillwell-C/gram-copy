import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import filledBookmark from "../assets/bookmark-filled.svg";
import outlinedBookmark from "../assets/bookmark-outline.svg";

import { useEffect, useState } from "react";
import {
  useAddNewSaveMutation,
  useDeleteSaveMutation,
} from "../features/saved/savedApiSlice";

const SaveButton = ({ save = false, postID }) => {
  const [saved, setSaved] = useState(false);
  const { authenticatedUser, id } = useAuth();

  const navigate = useNavigate();

  const [
    addNewSave,
    {
      isLoading: isAddLoading,
      isSuccess: isAddSuccess,
      isError: isAddError,
      error: addError,
    },
  ] = useAddNewSaveMutation();
  const [
    deleteSave,
    {
      isLoading: isDeleteLoading,
      isSuccess: isDeleteSuccess,
      isError: isDeleteError,
      error: deleteError,
    },
  ] = useDeleteSaveMutation();

  useEffect(() => {
    setSaved(save);
  }, []);

  const handleSave = () => {
    if (!authenticatedUser) {
      navigate("/accounts/login");
      return;
    }
    if (!saved) addNewSave({ userID: id, parentPostID: postID });
    if (saved) deleteSave({ userID: id, parentPostID: postID });
    setSaved(!saved);
  };

  return (
    <button
      className='bookmarkButton'
      aria-label='click to save post'
      onClick={handleSave}
    >
      <img
        src={saved ? filledBookmark : outlinedBookmark}
        alt=''
        aria-hidden='true'
        className={saved ? "filled" : ""}
      />
    </button>
  );
};

export default SaveButton;
