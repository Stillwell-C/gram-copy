import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import threeDots from "../../assets/three-dots-line-svgrepo-com.svg";
import addComment from "../../assets/add-circle-svgrepo-com.svg";
import comment from "../../assets/message-circle-01-svgrepo-com.svg";
import message from "../../assets/plane-svgrepo-com.svg";
import filledBookmark from "../../assets/bookmark-filled.svg";
import outlinedBookmark from "../../assets/bookmark-outline.svg";
import outlinedHeart from "../../assets/heart-rounded-svgrepo-com.svg";
import filledHeart from "../../assets/heart-svgrepo-com.svg";
import Comment from "../comment/Comment";
import moment from "moment";
import { AuthContext } from "../../context/authContext";
import "./photoModal.scss";

const PhotoModal = ({
  setShowPhotoModal,
  userImgURL,
  post,
  liked,
  saved,
  handleLike,
  handleSave,
  likesOffset,
}) => {
  const { currentUser } = useContext(AuthContext);
  const [commentsArr, setCommentsArr] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, []);

  useEffect(() => {
    setCommentsLoading(false);
  }, [commentsArr]);

  const loadComments = () => {
    const start = commentsArr.length;
    const end =
      start + 10 > post.comments.length ? post.comments.length : start + 10;
    const newArr = [];

    for (let i = start; i < end; i++) {
      newArr.push(post.comments[i]);
    }

    setCommentsArr([...commentsArr, ...newArr]);
  };

  const comments = commentsArr.map((comment) => (
    <Comment
      comment={comment}
      abbreviate={false}
      key={comment.date + comment.userName}
    />
  ));

  let picInfoButton;
  const friendArr = currentUser.following.filter(
    (user) => user === post.userName
  );
  if (friendArr.length) {
    picInfoButton = (
      <button type='button' aria-label={`click to unfollow ${post.userName}`}>
        Unfollow
      </button>
    );
  }
  if (!friendArr.length) {
    picInfoButton = (
      <button type='button' aria-label={`click to follow ${post.userName}`}>
        Follow
      </button>
    );
  }

  return (
    <>
      <div className='photo-modal-container'>
        <div className='photo-modal-body'>
          <div className='photo-modal-left'>
            <div className='img-container'>
              <img
                src={post.imgURL}
                alt={post.altText ? post.altText : "user upload"}
              />
            </div>
          </div>
          <div className='photo-modal-right'>
            <div className='photo-modal-right-top'>
              <div className='user-img-div'>
                <img src={userImgURL} alt='user profile' />
              </div>
              <div className='photo-info-div'>
                <div className='photo-info-top'>
                  <Link to={`/${post.userName}`}>
                    <div className='userName'>{post.userName}</div>
                  </Link>
                  {currentUser.username !== post.userName && picInfoButton}
                </div>
                <div className='photoLocation'>
                  {post.location && post.location}
                </div>
              </div>
              <button className='optionButton'>
                <img src={threeDots} alt='three dots' />
              </button>
            </div>
            <div className='photo-modal-right-middle'>
              {!commentsLoading && comments}
              {commentsArr.length < post.comments.length && (
                <button
                  type='button'
                  aria-label='click to show more comments'
                  title='click to show more comments'
                  onClick={loadComments}
                >
                  <img src={addComment} alt='plus sign icon' />
                </button>
              )}
            </div>
            <div className='photo-modal-right-bottom'>
              <div className='buttons'>
                <div className='buttons-left'>
                  <button
                    className='likeButton'
                    aria-label='click to like post'
                    onClick={handleLike}
                  >
                    <img
                      src={liked ? filledHeart : outlinedHeart}
                      className={liked ? "filled heart" : "heart"}
                      alt='heart'
                    />
                  </button>
                  <button className='commentButton'>
                    <img src={comment} alt='comment bubble' />
                  </button>
                  <button className='messageButton'>
                    <img src={message} alt='paper airplane' />
                  </button>
                </div>
                <div className='buttons-right'>
                  <button
                    className='bookmarkButton'
                    aria-label='click to save post'
                    onClick={handleSave}
                  >
                    <img
                      src={saved ? filledBookmark : outlinedBookmark}
                      alt='bookmark'
                      className={saved ? "filled" : ""}
                    />
                  </button>
                </div>
              </div>
              <div className='card-bottom-text'>
                <div className='likes-counter'>
                  {post.likedUsers.length + likesOffset}{" "}
                  {post.likedUsers.length + likesOffset === 1
                    ? "Like"
                    : "Likes"}
                </div>
                <div className='time-ago'>
                  {moment(post.date.toDate()).fromNow().toUpperCase()}
                </div>
              </div>
              <div className='input-comment-div'>
                <div className='input-left'>
                  <label>
                    <input
                      type='text'
                      maxLength={2200}
                      placeholder='Add a comment...'
                    />
                  </label>
                </div>
                <div className='input-right'>
                  <button>Post</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='modal-overlay' onClick={() => setShowPhotoModal(false)}>
        <div className='modal-overlay-close'>
          <button
            className='delete-button'
            aria-label='Click to close delete account modal'
          >
            &times;
          </button>
        </div>
      </div>
    </>
  );
};

export default PhotoModal;
