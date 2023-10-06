import { useMutation, useQueryClient } from "react-query";
import { deletePost } from "./postApiRoutes";
import useAuth from "../../hooks/useAuth";
import FocusTrapModalParent from "../../components/FocusTrapModalParent";
import { useDispatch } from "react-redux";
import { setError, setErrorRefreshPage } from "../error/errorSlice";

const DeletePostConfirmationModal = ({ post, setShowDeleteConfirmation }) => {
  const { id } = useAuth();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profilePosts", id],
      });
    },
    onError: () => {
      dispatch(setError(true));
      dispatch(setErrorRefreshPage(false));
    },
  });

  const handleDelete = () => {
    deletePostMutation.mutate({ id: post._id, imgKey: post.imgKey });
    setShowDeleteConfirmation(false);
  };

  const handleClose = () => {
    setShowDeleteConfirmation(false);
  };

  const content = (
    <div
      className='delete-confirmation-modal'
      role='dialog'
      aria-label='delete post confirmation dialog'
    >
      <div className='delete-confirmation-body'>
        <h4>Are you sure you want to delete this image?</h4>
        <div className='button-div'>
          <button
            aria-label='click to cancel and not delete this image'
            onClick={() => setShowDeleteConfirmation(false)}
            id='modal-cancel-btn'
            className='grey-button standard-button'
          >
            Cancel
          </button>
          <button
            aria-label='click to delete this image'
            className='delete blue-button standard-button'
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <FocusTrapModalParent
      content={content}
      handleClose={handleClose}
      initialFocus='#modal-cancel-btn'
      showClose={false}
    />
  );
};

export default DeletePostConfirmationModal;
