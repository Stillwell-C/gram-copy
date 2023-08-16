import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import threeDots from "../../assets/three-dots-line-svgrepo-com.svg";
import commentBubble from "../../assets/message-circle-01-svgrepo-com.svg";
import message from "../../assets/plane-svgrepo-com.svg";
import moment from "moment";
import "./photoModal.scss";
import useFollowUnfollow from "../../hooks/useFollowUnfollow";
import AdditionalOptionsModal from "../additionalOptionsModal/AdditionalOptionsModal";
import ReportModal from "../reportModal/ReportModal";
import useAuth from "../../hooks/useAuth";
import PhotoModalComments from "../PhotoModalComments";
import AddCommentForm from "../AddCommentForm";
import LikeButton from "../LikeButton";
import SaveButton from "../SaveButton";

const PhotoModal = ({ setShowPhotoModal, post, queryKey }) => {
  const { authenticatedUser, id } = useAuth();

  const [showAdditionalOptionsModal, setShowAdditionalOptionsModal] =
    useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const commentRef = useRef(null);

  const userImgURL = `https://res.cloudinary.com/danscxcd2/image/upload/w_150,c_fill/${post?.user?.userImgKey}`;
  const imgURL = `https://res.cloudinary.com/danscxcd2/image/upload/${post?.imgKey}`;

  // <button
  //   type='button'
  //   aria-label={`click to unfollow ${post.userName}`}
  //   onClick={handleUnfollow}
  // >
  //   Unfollow
  // </button>

  const handleFollow = () => {
    // if (!authenticatedUser) {
    //   navigate("/accounts/login");
    //   return;
    // }
    // followUser(post.userUid);
    // setIsFriend(true);
    console.log("not implemented yet");
  };

  const followButton = (
    <button
      type='button'
      aria-label={`click to follow ${post.userName}`}
      onClick={handleFollow}
    >
      Follow
    </button>
  );

  // const handleUnfollow = () => {
  //   if (!authenticatedUser) {
  //     navigate("/accounts/login");
  //     return;
  //   }
  //   unfollowUser(post.userUid);
  //   setIsFriend(false);
  // };

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
                      {followButton}
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
                  {id !== post.user._id && !post?.isFollow && (
                    <>
                      <span>•</span>
                      {followButton}
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
                  <LikeButton
                    like={post?.isLiked}
                    postID={post?._id}
                    postPage={post?.pageNo}
                    queryKey={queryKey}
                  />
                  <button
                    className='commentButton'
                    onClick={handleCommentClick}
                    aria-label='click to write a comment'
                  >
                    <img src={commentBubble} alt='' aria-hidden='true' />
                  </button>
                  <button className='messageButton'>
                    <img src={message} alt='paper airplane' />
                  </button>
                </div>
                <div className='buttons-right'>
                  <SaveButton
                    save={post?.isSaved}
                    postID={post?._id}
                    postPage={post?.pageNo}
                    queryKey={queryKey}
                  />
                </div>
              </div>
              <div className='photo-bottom-text'>
                <div className='likes-counter'>
                  {post?.likes}
                  {post?.likes === 1 ? " Like" : " Likes"}
                </div>
                <div className='time-ago'>
                  {moment(post.updatedAt).fromNow().toUpperCase()}
                </div>
              </div>
              <AddCommentForm post={post} ref={commentRef} />
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
