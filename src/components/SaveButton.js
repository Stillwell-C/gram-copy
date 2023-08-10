import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import filledBookmark from "../assets/bookmark-filled.svg";
import outlinedBookmark from "../assets/bookmark-outline.svg";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { addNewSave, deleteSave } from "../features/saved/savedApiRoutes";

const SaveButton = ({ save = false, postID, postPage }) => {
  const [saved, setSaved] = useState(false);
  const { authenticatedUser, id } = useAuth();

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const addNewSaveMutation = useMutation({
    mutationFn: addNewSave,
    onSuccess: () => {
      queryClient.setQueryData("posts", (oldData) => {
        const data = oldData;
        //Increment like
        data.pages[postPage].posts.find(
          (post) => post._id === postID
        ).isSaved = true;
        return data;
      });
      //Maybe just stop here
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        refetchPage: (page, index, allPages) => {
          return index === postPage;
        },
      });
    },
  });

  const deleteSaveMutation = useMutation({
    mutationFn: deleteSave,
    onSuccess: () => {
      queryClient.setQueryData("posts", (oldData) => {
        const data = oldData;
        //Increment like
        data.pages[postPage].posts.find(
          (post) => post._id === postID
        ).isSaved = false;
        return data;
      });
      //Maybe just stop here
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        refetchPage: (page, index, allPages) => {
          return index === postPage;
        },
      });
    },
  });

  useEffect(() => {
    setSaved(save);
  }, []);

  const handleSave = () => {
    if (!authenticatedUser) {
      navigate("/accounts/login");
      return;
    }
    if (!saved) addNewSaveMutation.mutate({ userID: id, parentPostID: postID });
    if (saved) deleteSaveMutation.mutate({ userID: id, parentPostID: postID });
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
