import React, { useEffect, useState } from "react";
import useGetUserInfo from "../../hooks/useGetUserInfo";
import moment from "moment";
import { Link } from "react-router-dom";

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

  useEffect(() => {
    if (comment.date) setDateCheck(true);
    if (typeof comment.date === "string") {
      let fromNow = moment(comment.date).fromNow(true);
      // causes bugs for things such as 'a minute' & 'a few seconds'
      // let numArr = fromNow.match(/^\d{1,2}/);
      // let charArr = fromNow.match(/([a-z])/);
      // setFormatedDate(`${numArr[0]}${charArr[0]}`);
      setFormatedDate(fromNow);
    }
    if (typeof comment.date === "object") {
      let fromNow = moment(comment.date.toDate()).fromNow(true);
      // let numArr = fromNow.match(/^\d{1,2}/);
      // let charArr = fromNow.match(/([a-z])/);
      // setFormatedDate(`${numArr[0]}${charArr[0]}`);
      setFormatedDate(fromNow);
    }
  }, [comment.date]);

  const { userImgURL } = useGetUserInfo(comment.username, "username");

  return (
    <div className='single-comment'>
      {showImage && (
        <div className='comment-image'>
          <Link
            to={`/${comment.username}`}
            onClick={() => setShowPhotoModal(false)}
          >
            <img src={userImgURL} alt='user profile' />
          </Link>
        </div>
      )}
      <div className='comment-main'>
        <div className='comment-main-top'>
          <Link
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
