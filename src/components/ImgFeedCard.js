import React, { useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

import Comment from "./Comment";
import PhotoModal from "./PhotoModal";
import ReportModal from "../features/reports/ReportModal";
import AdditionalOptionsModal from "./AdditionalOptionsModal";
import SaveButton from "../features/saved/SaveButton";
import LikeButton from "../features/likes/LikeButton";
import AddCommentForm from "../features/comments/AddCommentForm";
import DeletePostConfirmationModal from "../features/posts/DeletePostConfirmationModal";
import TagUsersModal from "./TagUsersModal";
import EditPostModal from "./EditPostModal";

import useAuth from "../hooks/useAuth";

import threeDots from "../assets/three-dots-line-svgrepo-com.svg";
import commentBubble from "../assets/message-circle-01-svgrepo-com.svg";
import message from "../assets/plane-svgrepo-com.svg";

const ImgFeedCard = React.forwardRef(({ post, queryKey }, ref) => {
  const { id } = useAuth();

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showAdditionalOptionsModal, setShowAdditionalOptionsModal] =
    useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showTagUsersModal, setShowTagUsersModal] = useState(false);
  const [showEditPostModal, setShowEditPostModal] = useState(false);

  const userImgURL = `https://res.cloudinary.com/danscxcd2/image/upload/w_90,c_fill/${post?.user?.userImgKey}`;

  const imgURL = `https://res.cloudinary.com/danscxcd2/image/upload/${post?.imgKey}`;
  const imgURLSmall = `https://res.cloudinary.com/danscxcd2/image/upload/w_500,c_fill/${post?.imgKey}`;
  const imgURLLarge = `https://res.cloudinary.com/danscxcd2/image/upload/w_900,c_fill/${post?.imgKey}`;

  const imgContent = (
    <>
      <div className='card-top flex-container flex-align-center'>
        <div className='card-top-left flex-container fg-1'>
          <Link
            to={`/${post.user.username}`}
            className='photo-link flex-container flex-align-center height-100'
            aria-label={`move to ${post.user.username}'s profile`}
          >
            <img
              className='userImg circular-image'
              src={userImgURL}
              alt='user profile'
              aria-hidden='true'
            />
          </Link>
          <div className='photoInfo flex-container flex-column flex-justify-center'>
            <Link
              to={`/${post.user.username}`}
              aria-label={`move to ${post.user.username}'s profile`}
            >
              <div className='userName'>{post.user.username}</div>
            </Link>
            <div className='photoLocation'>
              {post.location && (
                <Link
                  to={`/search/location/${post.location}`}
                  aria-label={`search for other posts from this location`}
                >
                  {post.location}
                </Link>
              )}
            </div>
          </div>
        </div>
        <button
          className='optionButton icon-button'
          onClick={() => setShowAdditionalOptionsModal(true)}
          aria-label='click for additional options'
        >
          <img src={threeDots} alt='three dots' className='themeable-icon' />
        </button>
      </div>
      <div className='main-img-div flex-container flex-align-center'>
        <div className='img-div flex-container flex-align-center flex-justify-center height-100 width-100'>
          {/* <picture>
            <source
              className='mainImg'
              media='(min-width:370px)'
              srcSet={imgURLLarge}
              alt={post.altText ? post.altText : "user upload"}
            />
            <source
              className='mainImg'
              srcSet={imgURLSmall}
              alt={post.altText ? post.altText : "user upload"}
            />
            <img
              className='mainImg'
              alt={post.altText ? post.altText : "user upload"}
              src={imgURL}
            />
          </picture> */}
          <img
            className='mainImg'
            alt={post.altText ? post.altText : "user upload"}
            srcSet={`${imgURLSmall} 500w, ${imgURLLarge} 900w`}
            sizes='(max-width: 469px) 500px, 900px'
            src={imgURL}
          />
        </div>
      </div>
      <div className='card-bottom'>
        <div className='bottom-buttons flex-container flex-align-center'>
          <div className='buttons-left flex-container flex-align-center'>
            <LikeButton
              like={post?.isLiked}
              postID={post?._id}
              postPage={post?.pageNo}
              queryKey={queryKey}
            />
            <button
              className='commentButton icon-button'
              aria-label='open post to view and make comments'
            >
              <img
                src={commentBubble}
                alt=''
                onClick={() => setShowPhotoModal(true)}
                aria-hidden='true'
                className='themeable-icon empty'
              />
            </button>
            <button
              className='messageButton icon-button'
              aria-label='click to share post'
            >
              <img
                src={message}
                alt=''
                className='themeable-icon empty'
                aria-hidden='true'
              />
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
        <div className='card-bottom-text flex-container flex-justify-center flex-column gap-5p'>
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
              className='view-comments-button transparent-button'
              aria-label='click to view all comments'
              onClick={() => setShowPhotoModal(true)}
            >
              {post?.comments >= 3
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
        <PhotoModal
          setShowPhotoModal={setShowPhotoModal}
          post={post}
          queryKey={queryKey}
        />
      )}
      {showAdditionalOptionsModal && (
        <AdditionalOptionsModal
          setShowAdditionalOptionsModal={setShowAdditionalOptionsModal}
          setShowReportModal={setShowReportModal}
          goToPost={true}
          goToProfile={id !== post.user._id ? true : false}
          copyLink={true}
          post={post}
          setShowDeleteConfirmation={
            post.user._id === id ? setShowDeleteConfirmation : false
          }
          setShowTagUsersModal={
            post.user._id === id ? setShowTagUsersModal : false
          }
          setShowEditPostModal={
            post.user._id === id ? setShowEditPostModal : false
          }
        />
      )}
      {showReportModal && (
        <ReportModal
          setShowReportModal={setShowReportModal}
          reportDistinction={"Post"}
          reportId={post?._id}
        />
      )}
      {showDeleteConfirmation && post.user._id === id && (
        <DeletePostConfirmationModal
          setShowDeleteConfirmation={setShowDeleteConfirmation}
          post={post}
        />
      )}
      {showTagUsersModal && post.user._id === id && (
        <TagUsersModal
          post={post}
          setShowTagUsersModal={setShowTagUsersModal}
        />
      )}
      {showEditPostModal && post.user._id === id && (
        <EditPostModal
          post={post}
          setShowEditPostModal={setShowEditPostModal}
        />
      )}
    </>
  );

  const imgCard = ref ? (
    <article className='img-feed-card width-100' ref={ref}>
      {imgContent}
    </article>
  ) : (
    <article className='img-feed-card width-100'>{imgContent}</article>
  );

  return imgCard;
});

export default ImgFeedCard;
