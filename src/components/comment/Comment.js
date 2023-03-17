import React, { useEffect, useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";

import defaultProfilePic from "../../assets/Default_pfp.svg";
import useGetUserInfoFunction from "../../hooks/useGetUserInfoFunction";

const Comment = ({
  comment,
  abbreviate,
  showImage,
  showTime,
  setShowPhotoModal,
}) => {
  let commentBody = comment.comment;
  if (abbreviate && commentBody.length > 150) {
    commentBody = `${commentBody.slice(0, 150)}...`;
  }

  const [dateCheck, setDateCheck] = useState(false);
  const [formatedDate, setFormatedDate] = useState("");
  const [commentImgURL, setCommentImgURL] = useState(defaultProfilePic);

  const getCommentInfo = useGetUserInfoFunction();

  useEffect(() => {
    const setImgURL = async () => {
      const commentInfo = await getCommentInfo(comment.username, "username");
      setCommentImgURL(commentInfo.userImgURL);
    };
    setImgURL();
  }, []);

  useEffect(() => {
    if (comment.date) setDateCheck(true);
    let fromNow = moment(comment.date.toDate()).fromNow(true);
    // let numArr = fromNow.match(/^\d{1,2}/);
    // let charArr = fromNow.match(/([a-z])/);
    // setFormatedDate(`${numArr[0]}${charArr[0]}`);
    setFormatedDate(fromNow);
  }, [comment.date]);

  return (
    <div className='single-comment'>
      {showImage && (
        <div className='comment-image'>
          <Link
            aria-label={`move to ${comment.username}'s profile`}
            to={`/${comment.username}`}
            onClick={() => setShowPhotoModal(false)}
          >
            <img src={commentImgURL} alt='user profile' aria-hidden='true' />
          </Link>
        </div>
      )}
      <div className='comment-main'>
        <div className='comment-main-top'>
          <Link
            aria-label={`move to ${comment.username}'s profile`}
            to={`/${comment.username}`}
            onClick={() => setShowPhotoModal(false)}
          >
            <span className='comment-username'>{comment.username}</span>
          </Link>
          <span className='comment-body'>{commentBody}</span>
        </div>
        {showTime && dateCheck && (
          <div className='comment-main-bottom'>{formatedDate}</div>
        )}
      </div>
    </div>
  );
};

export default Comment;
