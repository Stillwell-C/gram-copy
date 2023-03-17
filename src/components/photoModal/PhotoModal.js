import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import AdditionalOptionsModal from "../additionalOptionsModal/AdditionalOptionsModal";
import ReportModal from "../reportModal/ReportModal";

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
  const [isFriend, setIsFriend] = useState(false);
  const [showAdditionalOptionsModal, setShowAdditionalOptionsModal] =
    useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const getUserInfo = useGetLoggedInUserInfoFunction();
  const addComment = useAddComment();
  const navigate = useNavigate();
  const commentRef = useRef(null);
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
        (user) => user === post.userUid
      );
      // const friendStatus = fetchedUserInfo.following.includes(post.userID);
      setIsFriend(friendArr.length ? true : false);
    };
    fetchComments();
    currentUser?.displayName && determineFriend();
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
    if (!currentUser) {
      navigate("/accounts/login");
      return;
    }
    addComment(currentUser.displayName, comment, post);
    setComment("");
  };

  const handleFollow = () => {
    if (!currentUser) {
      navigate("/accounts/login");
      return;
    }
    followUser(post.userUid);
    setIsFriend(true);
  };

  const handleUnfollow = () => {
    if (!currentUser) {
      navigate("/accounts/login");
      return;
    }
    unfollowUser(post.userUid);
    setIsFriend(false);
  };

  const handleCommentClick = () => {
    commentRef.current.focus();
  };

  return (
    <>
      <div className='photo-modal-container'>
        <div className='photo-modal-body'>
          <div className='photo-modal-header'>
            <div className='header-left'>
              <div className='user-img-div'>
                <img src={userImgURL} alt='user profile' />
              </div>
              <div className='photo-info-div'>
                <div className='photo-info-top'>
                  <Link
                    to={`/${post.userName}`}
                    aria-label={`move to ${post.userName}'s profile`}
                  >
                    <div className='userName'>{post.userName}</div>
                  </Link>
                  {currentUser?.displayName !== post.userName && (
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
              <div className='header-right'>
                <button
                  className='optionButton'
                  onClick={() => setShowAdditionalOptionsModal(true)}
                  aria-label='click for additional options'
                >
                  <img src={threeDots} alt='' aria-hidden='true' />
                </button>
              </div>
            </div>
          </div>
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
                  <Link
                    to={`/${post.userName}`}
                    aria-label={`move to ${post.userName}'s profile`}
                  >
                    <div className='userName'>{post.userName}</div>
                  </Link>
                  {currentUser?.displayName !== post.userName && (
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
              <button
                className='optionButton'
                onClick={() => setShowAdditionalOptionsModal(true)}
              >
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
                    <img src={addCommentIcon} alt='' aria-hidden='true' />
                  </button>
                </div>
              )}
            </div>
            <div className='photo-modal-right-bottom'>
              <div className='buttons'>
                <div className='buttons-left'>
                  <button
                    className='likeButton'
                    aria-label={`click to ${liked ? "unlike" : "like"} post`}
                    onClick={handleLike}
                  >
                    <img
                      src={liked ? filledHeart : outlinedHeart}
                      className={liked ? "filled heart" : "heart"}
                      alt=''
                      aria-hidden='true'
                    />
                  </button>
                  <button
                    className='commentButton'
                    onClick={() => commentRef.current.focus()}
                    aria-label='click to write a comment'
                  >
                    <img src={commentBubble} alt='' aria-hidden='true' />
                  </button>
                  <button className='messageButton'>
                    <img src={message} alt='paper airplane' />
                  </button>
                </div>
                <div className='buttons-right'>
                  <button
                    className='bookmarkButton'
                    aria-label={`click to ${saved ? "save" : "unsave"} post`}
                    onClick={handleSave}
                  >
                    <img
                      src={saved ? filledBookmark : outlinedBookmark}
                      alt=''
                      aria-hidden='true'
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
                        ref={commentRef}
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
                      aria-disabled={!activateButton}
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
      {showAdditionalOptionsModal && (
        <AdditionalOptionsModal
          setShowAdditionalOptionsModal={setShowAdditionalOptionsModal}
          setShowReportModal={setShowReportModal}
        />
      )}
      {showReportModal && (
        <ReportModal
          setShowReportModal={setShowReportModal}
          reportDistinction={"image"}
          reportId={post.id}
        />
      )}
    </>
  );
};

export default PhotoModal;
