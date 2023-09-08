import React, { useState } from "react";
import { Link } from "react-router-dom";
import threeDots from "../../assets/three-dots-line-svgrepo-com.svg";
import commentBubble from "../../assets/message-circle-01-svgrepo-com.svg";
import message from "../../assets/plane-svgrepo-com.svg";
import Comment from "../comment/Comment";
import moment from "moment";
import PhotoModal from "../photoModal/PhotoModal";
import ReportModal from "../reportModal/ReportModal";
import AdditionalOptionsModal from "../additionalOptionsModal/AdditionalOptionsModal";
import SaveButton from "../SaveButton";
import LikeButton from "../LikeButton";
import AddCommentForm from "../AddCommentForm";

const ImgFeedCard = React.forwardRef(({ post }, ref) => {
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showAdditionalOptionsModal, setShowAdditionalOptionsModal] =
    useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const userImgURL = `https://res.cloudinary.com/danscxcd2/image/upload/w_150,c_fill/${post?.user?.userImgKey}`;
  const imgURL = `https://res.cloudinary.com/danscxcd2/image/upload/${post?.imgKey}`;

  const imgContent = (
    <>
      <div className='card-top'>
        <Link
          to={`/${post.user.username}`}
          className='photo-link'
          aria-label={`move to ${post.user.username}'s profile`}
        >
          <img className='userImg' src={userImgURL} alt='' aria-hidden='true' />
        </Link>
        <div className='photoInfo'>
          <Link
            to={`/${post.user.username}`}
            aria-label={`move to ${post.user.username}'s profile`}
          >
            <div className='userName'>{post.user.username}</div>
          </Link>
          <div className='photoLocation'>{post.location && post.location}</div>
        </div>
        <button
          className='optionButton'
          onClick={() => setShowAdditionalOptionsModal(true)}
          aria-label='click for additional options'
        >
          <img src={threeDots} alt='three dots' />
        </button>
      </div>
      <img
        className='mainImg'
        alt={post.altText ? post.altText : "user upload"}
        src={imgURL}
      />
      <div className='card-bottom'>
        <div className='buttons'>
          <div className='buttons-left'>
            <LikeButton
              like={post?.isLiked}
              postID={post?._id}
              postPage={post?.pageNo}
            />
            <button
              className='commentButton'
              aria-label='open post to view and make comments'
            >
              <img
                src={commentBubble}
                alt=''
                onClick={() => setShowPhotoModal(true)}
                aria-hidden='true'
              />
            </button>
            <button className='messageButton' aria-label='click to share post'>
              <img src={message} alt='' aria-hidden='true' />
            </button>
          </div>
          <div className='buttons-right'>
            <SaveButton
              save={post?.isSaved}
              postID={post?._id}
              postPage={post?.pageNo}
            />
          </div>
        </div>
        <div className='card-bottom-text'>
          <div className='likes-counter'>
            {post?.likes}
            {post?.likes === 1 ? " Like" : " Likes"}
          </div>
          <div className='comments'>
            {post?.caption && (
              <Comment
                comment={{
                  commentBody: post.caption,
                  updatedAt: post.updatedAt,
                  author: {
                    username: post.user.username,
                    userImgKey: post.user.userImgKey,
                  },
                }}
                abbreviate={true}
              />
            )}
          </div>
          <div className='view-more-div'>
            <button
              type='button'
              className='view-comments-button'
              aria-label='click to view all comments'
              onClick={() => setShowPhotoModal(true)}
            >
              {post?.comments > 3
                ? `View all ${post.comments} comments`
                : `View all comments`}
            </button>
          </div>
          <div className='time-ago'>
            {moment(post.updatedAt).fromNow().toUpperCase()}
          </div>
        </div>
        <AddCommentForm post={post} />
      </div>
      {showPhotoModal && (
        <PhotoModal setShowPhotoModal={setShowPhotoModal} post={post} />
      )}
      {showAdditionalOptionsModal && (
        <AdditionalOptionsModal
          setShowAdditionalOptionsModal={setShowAdditionalOptionsModal}
          setShowReportModal={setShowReportModal}
          goToPost={true}
          copyLink={true}
          post={post}
        />
      )}
      {showReportModal && (
        <ReportModal
          setShowReportModal={setShowReportModal}
          reportDistinction={"Post"}
          reportId={post?._id}
        />
      )}
    </>
  );

  const imgCard = ref ? (
    <article className='card' ref={ref}>
      {imgContent}
    </article>
  ) : (
    <article className='card'>{imgContent}</article>
  );

  return imgCard;
});

export default ImgFeedCard;
