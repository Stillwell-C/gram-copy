import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import threeDots from "../../assets/three-dots-line-svgrepo-com.svg";
import commentBubble from "../../assets/message-circle-01-svgrepo-com.svg";
import message from "../../assets/plane-svgrepo-com.svg";
import filledBookmark from "../../assets/bookmark-filled.svg";
import outlinedBookmark from "../../assets/bookmark-outline.svg";
import outlinedHeart from "../../assets/heart-rounded-svgrepo-com.svg";
import filledHeart from "../../assets/heart-svgrepo-com.svg";
import moment from "moment";
import "./photoModal.scss";
import useFollowUnfollow from "../../hooks/useFollowUnfollow";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import AdditionalOptionsModal from "../additionalOptionsModal/AdditionalOptionsModal";
import ReportModal from "../reportModal/ReportModal";
import useAuth from "../../hooks/useAuth";
import PhotoModalComments from "../PhotoModalComments";

const PhotoModal = ({ setShowPhotoModal, post, handleLike, handleSave }) => {
  const { authenticatedUser, id } = useAuth();

  const [picInfoButton, setPicInfoButton] = useState();
  const [activateButton, setActivateButton] = useState(false);
  const [comment, setComment] = useState("");
  const [isFriend, setIsFriend] = useState(false);
  const [showAdditionalOptionsModal, setShowAdditionalOptionsModal] =
    useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const navigate = useNavigate();
  const commentRef = useRef(null);
  const { follow: followUser, unfollow: unfollowUser } = useFollowUnfollow();

  const userImgURL = `https://res.cloudinary.com/danscxcd2/image/upload/w_150,c_fill/${post?.user?.userImgKey}`;
  const imgURL = `https://res.cloudinary.com/danscxcd2/image/upload/${post?.imgKey}`;

  useEffect(() => {
    if (comment.length) {
      setActivateButton(true);
      return;
    }
    setActivateButton(false);
  }, [comment]);

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

  const handleFollow = () => {
    if (!authenticatedUser) {
      navigate("/accounts/login");
      return;
    }
    followUser(post.userUid);
    setIsFriend(true);
  };

  const handleUnfollow = () => {
    if (!authenticatedUser) {
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
                    to={`/${post.user.username}`}
                    aria-label={`move to ${post.user.username}'s profile`}
                  >
                    <div className='userName'>{post.user.username}</div>
                  </Link>
                  {id !== post.user._id && (
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
                src={imgURL}
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
                    to={`/${post.user.username}`}
                    aria-label={`move to ${post.user.username}'s profile`}
                  >
                    <div className='userName'>{post.user.username}</div>
                  </Link>
                  {id !== post.user._id && (
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
              <PhotoModalComments
                post={post}
                setShowPhotoModal={setShowPhotoModal}
              />
            </div>
            <div className='photo-modal-right-bottom'>
              <div className='buttons'>
                <div className='buttons-left'>
                  <button
                    className='likeButton'
                    aria-label={`click to ${
                      post.isLiked ? "unlike" : "like"
                    } post`}
                    onClick={handleLike}
                  >
                    <img
                      src={post.isLiked ? filledHeart : outlinedHeart}
                      className={post.isLiked ? "filled heart" : "heart"}
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
                    aria-label={`click to ${
                      post.isSave ? "save" : "unsave"
                    } post`}
                    onClick={handleSave}
                  >
                    <img
                      src={post.isSaved ? filledBookmark : outlinedBookmark}
                      alt=''
                      aria-hidden='true'
                      className={post.isSaved ? "filled" : ""}
                    />
                  </button>
                </div>
              </div>
              <div className='photo-bottom-text'>
                <div className='likes-counter'>
                  {/* {post.likedUsers.length + likesOffset}{" "}
                  {post.likedUsers.length + likesOffset === 1
                    ? "Like"
                    : "Likes"} */}
                  {post?.likes}
                  {post?.likes === 1 ? " Like" : " Likes"}
                </div>
                <div className='time-ago'>
                  {moment(post.updatedAt).fromNow().toUpperCase()}
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
                      // onClick={handleAddComment}
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
