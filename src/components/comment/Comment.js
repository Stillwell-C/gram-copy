import React from "react";

const Comment = ({ comment, abbreviate }) => {
  let commentBody = comment.comment;
  if (abbreviate && commentBody.length > 150) {
    commentBody = `${commentBody.slice(0, 150)}...`;
  }

  return (
    <div className='single-comment'>
      <span className='comment-username'>{comment.username}</span>
      <span className='comment-comment-body'>{commentBody}</span>
    </div>
  );
};

export default Comment;
