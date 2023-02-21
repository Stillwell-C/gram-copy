import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import threeDots from "../../assets/three-dots-line-svgrepo-com.svg";
import addCommentIcon from "../../assets/add-circle-svgrepo-com.svg";
import commentBubble from "../../assets/message-circle-01-svgrepo-com.svg";
import message from "../../assets/plane-svgrepo-com.svg";
import filledBookmark from "../../assets/bookmark-filled.svg";
import outlinedBookmark from "../../assets/bookmark-outline.svg";
import outlinedHeart from "../../assets/heart-rounded-svgrepo-com.svg";
import filledHeart from "../../assets/heart-svgrepo-com.svg";
import Comment from "../comment/Comment";
import moment from "moment";
import { AuthContext } from "../../context/authContext";
import "./photoModal.scss";
import useAddComment from "../../hooks/useAddComment";
import useFollowUnfollow from "../../hooks/useFollowUnfollow";
import useGetLoggedInUserInfoFunction from "../../hooks/useGetLoggedInUserInfoFunction";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";

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
  const [commentsPool, setCommentsPool] = useState([]);
  const [commentsArr, setCommentsArr] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [picInfoButton, setPicInfoButton] = useState();
  const [activateButton, setActivateButton] = useState(false);
  const [comment, setComment] = useState("");
  const [isFriend, setIsFriend] = useState(null);

  const getUserInfo = useGetLoggedInUserInfoFunction();
  const addComment = useAddComment();
  const { follow: followUser, unfollow: unfollowUser } = useFollowUnfollow();

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedPost = await getDoc(doc(db, "userImgs", post.id));
      const postInfo = fetchedPost.data();
      setCommentsPool([...postInfo.comments]);
    };
    const determineFriend = async () => {
      const fetchedUserInfo = await getUserInfo();
      const friendArr = fetchedUserInfo.following.filter(
        (user) => user === post.userID
      );
      // const friendStatus = fetchedUserInfo.following.includes(post.userID);
      setIsFriend(friendArr.length ? true : false);
    };
    fetchComments();
    determineFriend();
  }, []);

  useEffect(() => {
    loadComments();
  }, [commentsPool]);

  useEffect(() => {
    setCommentsLoading(false);
  }, [commentsArr]);

  useEffect(() => {
    if (comment.length) {
      setActivateButton(true);
      return;
    }
    setActivateButton(false);
  }, [comment]);

  const loadComments = () => {
    const start = commentsArr.length;
    const end =
      start + 10 > commentsPool.length ? commentsPool.length : start + 10;
    const newArr = [];

    for (let i = start; i < end; i++) {
      newArr.push(commentsPool[i]);
    }

    setCommentsArr([...commentsArr, ...newArr]);
  };

  const comments = commentsArr.map((comment) => (
    <Comment
      comment={comment}
      abbreviate={false}
      showTime={true}
      showImage={true}
      setShowPhotoModal={setShowPhotoModal}
      key={comment.date + comment.userName}
    />
  ));

  useEffect(() => {
    if (isFriend) {
      setPicInfoButton(
        <button
          type='button'
          aria-label={`click to unfollow ${post.userName}`}
          onClick={handleUnfollow}
        >
          Unfollow
        </button>
      );
      return;
    }
    setPicInfoButton(
      <button
        type='button'
        aria-label={`click to follow ${post.userName}`}
        onClick={handleFollow}
      >
        Follow
      </button>
    );
  }, [isFriend]);

  const handleAddComment = (e) => {
    e.preventDefault();
    addComment(currentUser.displayName, comment, post);
    setComment("");
  };

  const handleFollow = () => {
    followUser(post.userID);
    setIsFriend(true);
  };

  const handleUnfollow = () => {
    unfollowUser(post.userID);
    setIsFriend(false);
  };

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
                  {currentUser.displayName !== post.userName && (
                    <>
                      <span>•</span>
                      {picInfoButton}
                    </>
                  )}
                </div>
                <div className='photo-location'>
                  {post.location ? post.location : ""}
                </div>
              </div>
              <button className='optionButton'>
                <img src={threeDots} alt='three dots' />
              </button>
            </div>
            <div className='photo-modal-right-middle'>
              {!commentsLoading && comments}
              {commentsLoading && <LoadingSpinner />}
              {commentsArr.length < commentsPool.length && (
                <div className='add-comments-button-div'>
                  <button
                    type='button'
                    aria-label='click to show more comments'
                    title='click to show more comments'
                    onClick={loadComments}
                  >
                    <img src={addCommentIcon} alt='plus sign icon' />
                  </button>
                </div>
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
                    <img src={commentBubble} alt='comment bubble' />
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
              <div className='photo-bottom-text'>
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
                <form>
                  <div className='input-left'>
                    <label aria-label='Type to input a comment'>
                      <input
                        type='text'
                        maxLength={2200}
                        placeholder='Add a comment...'
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                      />
                    </label>
                  </div>
                  <div className='input-right'>
                    <button
                      type='submit'
                      aria-label='click to submit comment'
                      className={activateButton ? "active" : "deactivated"}
                      disabled={!activateButton}
                      onClick={handleAddComment}
                    >
                      Post
                    </button>
                  </div>
                </form>
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
