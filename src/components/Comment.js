import React, { useEffect, useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";

import defaultProfilePic from "../assets/Default_pfp.svg";

const Comment = ({
  comment,
  abbreviate,
  showImage,
  showTime,
  setShowPhotoModal,
}) => {
  const [dateCheck, setDateCheck] = useState(false);
  const [formatedDate, setFormatedDate] = useState("");

  const userImgURL = comment?.author?.userImgKey
    ? `https://res.cloudinary.com/danscxcd2/image/upload/w_90,c_fill/${comment?.author?.userImgKey}`
    : defaultProfilePic;

  useEffect(() => {
    if (comment.updatedAt) setDateCheck(true);
    let fromNow = moment(comment?.updatedAt).fromNow(true);
    setFormatedDate(fromNow);
  }, [comment?.updatedAt]);

  const handleClose = () => {
    if (setShowPhotoModal) {
      setShowPhotoModal(false);
    }
  };

  const parseComment = (commentText) => {
    const hashtagRegex = /#(\w+)/g;
    const atRegex = /@(\w+)/g;
    const commentLines = abbreviate
      ? commentText.split("\n").slice(0, 4)
      : commentText.split("\n").slice(0, 20);
    const parsedText = commentLines.map((line) => {
      const lineWords = line.split(" ");
      return lineWords.map((fragment, i) => {
        const key = `${fragment}-${i}`;
        let parsedFragment = fragment;
        if (hashtagRegex.test(fragment)) {
          parsedFragment = (
            <Link to={`/search/hash/${fragment.substring(1)}`}>{fragment}</Link>
          );
        }
        if (atRegex.test(fragment)) {
          parsedFragment = (
            <Link to={`/${fragment.substring(1)}`}>{fragment}</Link>
          );
        }
        const spaceOrBreak = i + 1 === lineWords.length ? <br /> : " ";
        return (
          <React.Fragment key={key}>
            {parsedFragment}
            {spaceOrBreak}
          </React.Fragment>
        );
      });
    });
    return (
      <span className='comment-body'>
        {parsedText}
        {abbreviate && commentText.split("\n").length > 4 && <>...</>}
      </span>
    );
  };

  const parsedCommentBody = parseComment(comment.commentBody);

  return (
    <div className='single-comment'>
      {showImage && (
        <div className='comment-image'>
          <Link
            aria-label={
              comment?.author?.username
                ? `move to ${comment?.author?.username}'s profile`
                : "user not located. unable to move to user profile"
            }
            to={`/${comment?.author?.username || "#"}`}
            onClick={handleClose}
          >
            <img src={userImgURL} alt='user profile' aria-hidden='true' />
          </Link>
        </div>
      )}
      <div className='comment-main'>
        <div className='comment-main-top'>
          <Link
            aria-label={
              comment?.author?.username
                ? `move to ${comment?.author?.username}'s profile`
                : "user not located. unable to move to user profile"
            }
            to={`/${comment?.author?.username || "#"}`}
            onClick={handleClose}
          >
            <span className='comment-username'>
              {comment?.author?.username || "A user"}
            </span>
          </Link>
          {parsedCommentBody}
        </div>
        {showTime && dateCheck && (
          <div className='comment-main-bottom'>{formatedDate}</div>
        )}
      </div>
    </div>
  );
};

export default Comment;
