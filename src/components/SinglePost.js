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
import AdditionalOptionsModal from "./additionalOptionsModal/AdditionalOptionsModal";
import ReportModal from "./reportModal/ReportModal";
import "../scss/singlePost.scss";

const SinglePost = ({ post, queryKey, setShowPhotoModal }) => {
  const { id } = useAuth();

  const commentRef = useRef(null);

  const [showAdditionalOptionsModal, setShowAdditionalOptionsModal] =
    useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const userImgURL = `https://res.cloudinary.com/danscxcd2/image/upload/w_150,c_fill/${post?.user?.userImgKey}`;
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

  return (
    <>
      <div className='single-post-body'>
        <div className='single-post-header'>
          <div className='header-left'>
            <div className='user-img-div'>
              <img src={userImgURL} alt='user profile' />
            </div>
            <div className='photo-info-div'>
              <div className='photo-info-top'>
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
              alt={post?.altText ? post?.altText : "user upload"}
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
                {moment(post?.updatedAt).fromNow().toUpperCase()}
              </div>
            </div>
            <AddCommentForm post={post} ref={commentRef} />
          </div>
        </div>
      </div>
      {showAdditionalOptionsModal && (
        <AdditionalOptionsModal
          setShowAdditionalOptionsModal={setShowAdditionalOptionsModal}
          setShowReportModal={setShowReportModal}
          goToPost={setShowPhotoModal ? true : false}
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
};

export default SinglePost;
