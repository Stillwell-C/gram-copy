import React, { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import moment from "moment";

import FollowButton from "../features/follow/FollowButton";
import PhotoModalComments from "../features/comments/PhotoModalComments";
import LikeButton from "../features/likes/LikeButton";
import SaveButton from "../features/saved/SaveButton";
import AddCommentForm from "../features/comments/AddCommentForm";
import AdditionalOptionsModal from "./AdditionalOptionsModal";
import ReportModal from "../features/reports/ReportModal";
import TagUsersModal from "./TagUsersModal";
import DeletePostConfirmationModal from "../features/posts/DeletePostConfirmationModal";

import useAuth from "../hooks/useAuth";

import threeDots from "../assets/three-dots-line-svgrepo-com.svg";
import commentBubble from "../assets/message-circle-01-svgrepo-com.svg";
import message from "../assets/plane-svgrepo-com.svg";

import "../scss/singlePost.scss";
import LikesCounter from "../features/likes/LikesCounter";

const SinglePost = ({ post, queryKey, setShowPhotoModal }) => {
  const { id } = useAuth();
  const { userID } = useParams();

  const commentRef = useRef(null);

  const [showAdditionalOptionsModal, setShowAdditionalOptionsModal] =
    useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showTagUsersModal, setShowTagUsersModal] = useState(false);
  const [displayCommentsMobile, setDisplayCommentsMobile] = useState(false);
  const [followedUserToParent, setFollowedUserToParent] = useState(false);

  const userImgURL = `https://res.cloudinary.com/danscxcd2/image/upload/w_90,c_fill/${post?.user?.userImgKey}`;

  const imgURLSmall = `https://res.cloudinary.com/danscxcd2/image/upload/w_500/${post?.imgKey}`;
  const imgURLMedium = `https://res.cloudinary.com/danscxcd2/image/upload/w_1000/${post?.imgKey}`;
  const imgURLLarge = `https://res.cloudinary.com/danscxcd2/image/upload/w_1500/${post?.imgKey}`;
  const imgURL = `https://res.cloudinary.com/danscxcd2/image/upload/${post?.imgKey}`;

  const followButton = (
    <FollowButton
      user={post.user}
      queryKey={queryKey}
      displayOnFollow={false}
      setFollowedUserToParent={setFollowedUserToParent}
    />
  );

  const handleCommentClick = () => {
    commentRef.current.focus();
  };

  const showProfile = userID !== id && id !== post.user._id;

  const mobileHeader = (
    <div className='single-post-header flex-container width-100'>
      <div className='header-left flex-container fg-1 flex-align-center flex-justify-start'>
        <div className='user-img-div flex-container flex-align-center'>
          <img src={userImgURL} alt='user profile' className='circular-image' />
        </div>
        <div className='photo-info-div flex-container flex-column flex-justify-center flex-align-start width-100'>
          <div className='photo-info-top flex-container flex-align-center'>
            <Link
              to={`/${post?.user?.username}`}
              aria-label={`move to ${post?.user?.username}'s profile`}
            >
              <div className='userName'>{post?.user?.username}</div>
            </Link>
            {id !== post?.user?._id && !followedUserToParent && (
              <>
                <span>•</span>
                {followButton}
              </>
            )}
          </div>
          <div className='photo-location'>
            {post?.location && (
              <Link
                to={`/search/location/${post.location}`}
                aria-label={`search for other posts from this location`}
              >
                {post?.location}
              </Link>
            )}
          </div>
        </div>
        <div className='header-right'>
          <button
            className='optionButton transparent-button'
            onClick={() => setShowAdditionalOptionsModal(true)}
            aria-label='click for additional options'
          >
            <img
              src={threeDots}
              alt=''
              className='themeable-icon'
              aria-hidden='true'
            />
          </button>
        </div>
      </div>
    </div>
  );

  const singlePhotoImage = (
    <div className='single-post-left flex-container flex-align-center flex-justify-center'>
      <div className='single-post-img-container flex-container flex-align-center flex-justify-center'>
        <img
          alt={post.altText ? post.altText : "user upload"}
          srcSet={`${imgURLSmall} 500w, ${imgURLMedium} 1000w, ${imgURLLarge} 1500w, ${imgURL} 2000w`}
          sizes='(max-width: 349px) 500px, (max-width: 647px) 1000px, (max-width: 1249px) 1500px, 2000px'
          src={imgURLMedium}
        />
      </div>
    </div>
  );

  const singlePhotoBottom = (
    <div className='single-post-bottom flex-container flex-column'>
      <div className='buttons flex-container flex-align-center'>
        <div className='buttons-left flex-container flex-align-center flex-justify-center'>
          <LikeButton
            postID={post?._id}
            postPage={post?.pageNo}
            queryKey={queryKey}
          />
          <button
            className='commentButton'
            onClick={handleCommentClick}
            aria-label='click to write a comment'
          >
            <img
              src={commentBubble}
              className='themeable-icon empty'
              alt=''
              aria-hidden='true'
            />
          </button>
          <button className='messageButton'>
            <img
              src={message}
              className='themeable-icon empty'
              alt='paper airplane'
            />
          </button>
        </div>
        <div className='buttons-right'>
          <SaveButton postID={post?._id} />
        </div>
      </div>
      <div className='post-bottom-text flex-container flex-column flex-align-start flex-justify-center'>
        <div className='likes-counter'>
          <LikesCounter
            postLikes={post?.likes}
            postID={post?._id}
            postPage={post?.pageNo}
            queryKey={queryKey}
          />
        </div>
        <div className='time-ago'>
          {moment(post?.updatedAt).fromNow().toUpperCase()}
        </div>
      </div>
      <div className='comments-toggle'>
        {!displayCommentsMobile && (
          <button
            className='transparent-button'
            aria-label='view comments'
            onClick={() => setDisplayCommentsMobile(true)}
          >
            View comments
          </button>
        )}
        {displayCommentsMobile && (
          <button
            className='transparent-button'
            aria-label='view image'
            onClick={() => setDisplayCommentsMobile(false)}
          >
            View image
          </button>
        )}{" "}
      </div>
      <AddCommentForm post={post} ref={commentRef} />
    </div>
  );

  const singlePostComments = (
    <div className='single-post-comments flex-container flex-column flex-align-start flex-justify-start width-100 fg-1'>
      <PhotoModalComments post={post} setShowPhotoModal={setShowPhotoModal} />
    </div>
  );

  const mobileComments = (
    <div className='mobile-comments-container flex-container'>
      {singlePostComments}
    </div>
  );

  const singlePhotoRight = (
    <div className='photo-modal-right flex-container flex-column height-100'>
      <div className='photo-modal-right-top flex-align-center'>
        <div className='user-img-div flex-container flex-align-center'>
          <img src={userImgURL} alt='user profile' className='circular-image' />
        </div>
        <div className='photo-info-div flex-container flex-column flex-justify-center flex-align-start width-100'>
          <div className='photo-info-top flex-container flex-align-center'>
            <Link
              to={`/${post?.user?.username}`}
              aria-label={`move to ${post?.user?.username}'s profile`}
            >
              <div className='userName'>{post?.user?.username}</div>
            </Link>
            {id !== post?.user?._id && !followedUserToParent && (
              <>
                <span>•</span>
                {followButton}
              </>
            )}
          </div>
          <div className='photo-location'>
            {post?.location && (
              <Link
                to={`/search/location/${post.location}`}
                aria-label={`search for other posts from this location`}
              >
                {post?.location}
              </Link>
            )}
          </div>
        </div>
        <button
          className='optionButton transparent-button'
          onClick={() => setShowAdditionalOptionsModal(true)}
        >
          <img src={threeDots} className='themeable-icon' alt='three dots' />
        </button>
      </div>
      {singlePostComments}
      {singlePhotoBottom}
    </div>
  );

  return (
    <>
      <div className='single-post-body single-post-large-display'>
        {singlePhotoImage}
        {singlePhotoRight}
      </div>
      <div className='single-post-body single-post-mobile-display'>
        {mobileHeader}
        {displayCommentsMobile ? mobileComments : singlePhotoImage}
        {singlePhotoBottom}
      </div>
      {showAdditionalOptionsModal && (
        <AdditionalOptionsModal
          setShowAdditionalOptionsModal={setShowAdditionalOptionsModal}
          setShowReportModal={setShowReportModal}
          goToPost={setShowPhotoModal ? true : false}
          goToProfile={showProfile ? true : false}
          copyLink={true}
          post={post}
          setShowDeleteConfirmation={
            post.user._id === id ? setShowDeleteConfirmation : false
          }
          setShowTagUsersModal={
            post.user._id === id ? setShowTagUsersModal : false
          }
          goToEditPost={post.user._id === id ? true : false}
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
    </>
  );
};

export default SinglePost;
