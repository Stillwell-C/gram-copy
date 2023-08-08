import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useAddNewCommentMutation } from "../features/comments/commentsApiSlice";

const AddCommentForm = ({ post }) => {
  const { authenticatedUser, id } = useAuth();

  const navigate = useNavigate();

  const [comment, setComment] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [addComment, { isLoading, isError, error, isSuccess }] =
    useAddNewCommentMutation();

  useEffect(() => {
    if (isError) console.log(error);
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      setComment("");
    }
  }, [isSuccess]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!authenticatedUser) {
      navigate("/accounts/login");
      return;
    }
    addComment({ author: id, parentPostId: post._id, commentBody: comment });
  };

  useEffect(() => {
    if (isLoading || comment.length < 1) {
      setButtonDisabled(true);
      return;
    }
    setButtonDisabled(false);
  }, [comment.length, isLoading]);

  return (
    <div className='input-comment-div'>
      <form
        onSubmit={handleAddComment}
        className={`input-left ${isLoading ? "disabled" : ""}`}
      >
        <div className='input-left'>
          <label>
            <input
              type='text'
              maxLength={2200}
              placeholder='Add a comment...'
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              disabled={isLoading}
            />
          </label>
        </div>
        <div className='input-right'>
          <button
            type='submit'
            className={`${buttonDisabled ? "disabled" : ""}`}
            disabled={buttonDisabled}
            aria-disabled={buttonDisabled ? "true" : "false"}
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCommentForm;
