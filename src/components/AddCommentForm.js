import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { addNewComment } from "../features/comments/commentsApiRoutes";

const AddCommentForm = React.forwardRef(({ post }, ref) => {
  const { authenticatedUser, id } = useAuth();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [comment, setComment] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const addNewCommentMutation = useMutation({
    mutationFn: addNewComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", post._id],
        refetchPage: (page, index, allPages) => {
          return index === page.totalPages - 1;
        },
      });
      setComment("");
    },
  });

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!authenticatedUser) {
      navigate("/accounts/login");
      return;
    }
    addNewCommentMutation.mutate({
      parentPostId: post._id,
      commentBody: comment,
    });
  };

  useEffect(() => {
    if (addNewComment.isLoading || comment.length < 1) {
      setButtonDisabled(true);
      return;
    }
    setButtonDisabled(false);
  }, [comment.length, addNewComment.isLoading]);

  return (
    <div className='input-comment-div width-100'>
      <form
        onSubmit={handleAddComment}
        className={`input-left ${
          addNewComment.isLoading ? "disabled" : ""
        } flex-container flex-align-center height-100`}
      >
        <div className='input-left'>
          <label>
            <input
              type='text'
              maxLength={2200}
              placeholder='Add a comment...'
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              disabled={addNewComment.isLoading}
              ref={ref}
            />
          </label>
        </div>
        <div className='input-right flex-container flex-align-center flex-justify-cetner'>
          <button
            type='submit'
            className={`${buttonDisabled ? "disabled" : ""} transparent-button`}
            disabled={buttonDisabled}
            aria-disabled={buttonDisabled ? "true" : "false"}
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
});

export default AddCommentForm;
