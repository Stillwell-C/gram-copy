import { useMutation, useQueryClient } from "react-query";
import { deletePost } from "../features/posts/postApiRoutes";
import useAuth from "../hooks/useAuth";

const DeletePostConfirmationModal = ({ post, setShowDeleteConfirmation }) => {
  const { id } = useAuth();
  const queryClient = useQueryClient();

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profilePosts", id],
      });
    },
  });

  const handleDelete = () => {
    deletePostMutation.mutate({ id: post._id, imgKey: post.imgKey });
    setShowDeleteConfirmation(false);
  };

  return (
    <>
      <div className='delete-confirmation-modal'>
        <div className='delete-confirmation-body'>
          <h4>Are you sure you want to delete this image?</h4>
          <div className='button-div'>
            <button
              aria-label='click to cancel and not delete this image'
              onClick={() => setShowDeleteConfirmation(false)}
            >
              Cancel
            </button>
            <button
              aria-label='click to delete this image'
              className='delete'
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <div
        className='delete-confirmation-overlay'
        onClick={() => setShowDeleteConfirmation(false)}
      ></div>
    </>
  );
};

export default DeletePostConfirmationModal;
