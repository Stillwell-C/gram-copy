import React, { useRef, useState } from "react";
import FollowButton from "./FollowButton";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import threeDots from "../assets/three-dots-line-svgrepo-com.svg";
import commentBubble from "../assets/message-circle-01-svgrepo-com.svg";
import message from "../assets/plane-svgrepo-com.svg";
import moment from "moment";
import PhotoModalComments from "./PhotoModalComments";
import LikeButton from "./LikeButton";
import SaveButton from "./SaveButton";
import AddCommentForm from "./AddCommentForm";
import AdditionalOptionsModal from "./AdditionalOptionsModal";
import ReportModal from "./ReportModal";
import "../scss/singlePost.scss";
import TagUsersModal from "./TagUsersModal";
import DeletePostConfirmationModal from "./DeletePostConfirmationModal";

const SinglePost = ({ post, queryKey, setShowPhotoModal }) => {
  const { id } = useAuth();

  const commentRef = useRef(null);

  const [showAdditionalOptionsModal, setShowAdditionalOptionsModal] =
    useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showTagUsersModal, setShowTagUsersModal] = useState(false);
  const [displayCommentsMobile, setDisplayCommentsMobile] = useState(false);

  const userImgURL = `https://res.cloudinary.com/danscxcd2/image/upload/w_90,c_fill/${post?.user?.userImgKey}`;

  // const imgURLXSmall = `https://res.cloudinary.com/danscxcd2/image/upload/w_370/${post?.imgKey}`;
  // const imgURLSmall = `https://res.cloudinary.com/danscxcd2/image/upload/w_500/${post?.imgKey}`;
  // const imgURLMedium = `https://res.cloudinary.com/danscxcd2/image/upload/w_800/${post?.imgKey}`;
  // const imgURLLarge = `https://res.cloudinary.com/danscxcd2/image/upload/w_1000/${post?.imgKey}`;
  // const imgURLXLarge = `https://res.cloudinary.com/danscxcd2/image/upload/w_1500/${post?.imgKey}`;
  // const imgURL = `https://res.cloudinary.com/danscxcd2/image/upload/${post?.imgKey}`;

  const imgURLSmall = `https://res.cloudinary.com/danscxcd2/image/upload/w_500/${post?.imgKey}`;
  const imgURLMedium = `https://res.cloudinary.com/danscxcd2/image/upload/w_1000/${post?.imgKey}`;
  const imgURLLarge = `https://res.cloudinary.com/danscxcd2/image/upload/w_1500/${post?.imgKey}`;
  const imgURL = `https://res.cloudinary.com/danscxcd2/image/upload/${post?.imgKey}`;

  const followButton = (
    <FollowButton
      user={post.user}
      queryKey={{
        key: ["posts", post?.user?.username],
        multipleInvalidation: true,
      }}
    />
  );

  const handleCommentClick = () => {
    commentRef.current.focus();
  };

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
            {id !== post?.user?._id && !post?.isFollow && (
              <>
                <span>•</span>
                {followButton}
              </>
            )}
          </div>
          <div className='photo-location'>
            {post?.location ? post?.location : ""}
          </div>
        </div>
        <div className='header-right'>
          <button
            className='optionButton transparent-button'
            onClick={() => setShowAdditionalOptionsModal(true)}
            aria-label='click for additional options'
          >
            <img src={threeDots} alt='' aria-hidden='true' />
          </button>
        </div>
      </div>
    </div>
  );

  //Make picture
  const singlePhotoImage = (
    <div className='single-post-left flex-container flex-align-center flex-justify-center'>
      <div className='single-post-img-container flex-container flex-align-center flex-justify-center'>
        {/* <picture>
          <source media='(min-width:1200px)' srcSet={imgURL} />
          <source media='(min-width:1000px)' srcSet={imgURLXLarge} />
          <source media='(min-width:768px)' srcSet={imgURLLarge} />
          <source media='(min-width:648px)' srcSet={imgURLMedium} />
          <source media='(min-width:370px)' srcSet={imgURLSmall} />
          <source media='(max-width:369px)' srcSet={imgURLXSmall} />
          <img alt={post.altText ? post.altText : "user upload"} src={imgURL} />
        </picture> */}
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
      <div className='post-bottom-text flex-container flex-column flex-align-start flex-justify-center'>
        <div className='likes-counter'>
          {post?.likes}
          {post?.likes === 1 ? " Like" : " Likes"}
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
            {id !== post?.user?._id && !post?.isFollow && (
              <>
                <span>•</span>
                {followButton}
              </>
            )}
          </div>
          <div className='photo-location'>
            {post?.location ? post?.location : ""}
          </div>
        </div>
        <button
          className='optionButton transparent-button'
          onClick={() => setShowAdditionalOptionsModal(true)}
        >
          <img src={threeDots} alt='three dots' />
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
          copyLink={true}
          post={post}
          setShowDeleteConfirmation={
            post.user._id === id ? setShowDeleteConfirmation : false
          }
          setShowTagUsersModal={
            post.user._id === id ? setShowTagUsersModal : false
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
    </>
  );
};

export default SinglePost;
