import React, { useEffect, useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";

import defaultProfilePic from "../assets/Default_pfp.svg";
import useParseTextForLinks from "../hooks/useTextParseForLinks";

const Comment = ({
  comment,
  abbreviate,
  showImage,
  showTime,
  setShowPhotoModal,
}) => {
  const [dateCheck, setDateCheck] = useState(false);
  const [formatedDate, setFormatedDate] = useState("");

  const parseTextForLinks = useParseTextForLinks();

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

  const commentMaxLength = abbreviate ? 4 : 20;
  const parsedCommentBody = parseTextForLinks(
    comment.commentBody,
    commentMaxLength,
    abbreviate
  );

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
