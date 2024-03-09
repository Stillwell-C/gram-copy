import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";

import useAuth from "../../hooks/useAuth";
import { addNewSave, deleteSave, getSave } from "./savedApiRoutes";
import { setError, setErrorRefreshPage } from "../error/errorSlice";

import filledBookmark from "../../assets/bookmark-filled.svg";
import outlinedBookmark from "../../assets/bookmark-outline.svg";

const SaveButton = ({ postID }) => {
  const { authenticatedUser } = useAuth();

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [saved, setSaved] = useState(false);

  const saveQueryKey = "save:" + postID;

  const { data: save, isLoading } = useQuery({
    queryKey: saveQueryKey,
    enabled: authenticatedUser,
    queryFn: () => getSave({ parentPostID: postID }),
    refetchOnWindowFocus: false,
  });

  const addNewSaveMutation = useMutation({
    mutationFn: addNewSave,
    onSuccess: () => {
      queryClient.setQueryData(saveQueryKey, (oldData) => {
        const data = oldData;
        if (data?.isSaved) {
          data.isSaved = true;
        }
        return data;
      });
    },
    onError: () => {
      dispatch(setError(true));
      dispatch(setErrorRefreshPage(false));
    },
  });

  const deleteSaveMutation = useMutation({
    mutationFn: deleteSave,
    onSuccess: () => {
      queryClient.setQueryData(saveQueryKey, (oldData) => {
        const data = oldData;
        if (data?.isSaved) {
          data.isSaved = false;
        }
        return data;
      });
    },
  });

  useEffect(() => {
    if (isLoading) return;
    setSaved(save?.isSaved ?? false);
  }, [save]);

  const handleSave = () => {
    if (!authenticatedUser) {
      navigate("/accounts/login");
      return;
    }
    if (!saved) addNewSaveMutation.mutate({ parentPostID: postID });
    if (saved) deleteSaveMutation.mutate({ parentPostID: postID });
    setSaved(!saved);
  };

  return (
    <button
      className='bookmarkButton icon-button'
      aria-label='save post'
      onClick={handleSave}
      disabled={addNewSaveMutation.isLoading || deleteSaveMutation.isLoading}
      aria-disabled={
        addNewSaveMutation.isLoading || deleteSaveMutation.isLoading
      }
    >
      <img
        src={saved ? filledBookmark : outlinedBookmark}
        alt=''
        aria-hidden='true'
        className={`themeable-icon ${saved ? "filled" : "empty"}`}
      />
    </button>
  );
};

export default SaveButton;
