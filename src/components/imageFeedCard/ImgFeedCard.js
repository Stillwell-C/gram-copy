import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import threeDots from "../../assets/three-dots-line-svgrepo-com.svg";
import commentBubble from "../../assets/message-circle-01-svgrepo-com.svg";
import message from "../../assets/plane-svgrepo-com.svg";
import filledBookmark from "../../assets/bookmark-filled.svg";
import outlinedBookmark from "../../assets/bookmark-outline.svg";
import outlinedHeart from "../../assets/heart-rounded-svgrepo-com.svg";
import filledHeart from "../../assets/heart-svgrepo-com.svg";
import defaultProfilePic from "../../assets/Default_pfp.svg";
import Comment from "../comment/Comment";
import moment from "moment";
import { AuthContext } from "../../context/authContext";
import useLikePost from "../../hooks/useLikePost";
import useSavePost from "../../hooks/useSavePost";
import useGetUserInfo from "../../hooks/useGetUserInfo";
import PhotoModal from "../photoModal/PhotoModal";
import useGetUserInfoFunction from "../../hooks/useGetUserInfoFunction";
import useAddComment from "../../hooks/useAddComment";
import ReportModal from "../reportModal/ReportModal";
import AdditionalOptionsModal from "../additionalOptionsModal/AdditionalOptionsModal";

const ImgFeedCard = React.forwardRef(
  ({ post, userLikedPosts, userSavedPosts }, ref) => {
    //TODO: Have infoID, so could streamline this later
    // const getImageInfo = useGetUserInfoFunction();
    const addComment = useAddComment();
    const navigate = useNavigate();

    const [liked, setLiked] = useState(false);
    const [initialLike, setInitialLike] = useState(false);
    const [likesOffset, setLikesOffset] = useState(0);
    const [saved, setSaved] = useState(false);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [showAdditionalOptionsModal, setShowAdditionalOptionsModal] =
      useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [pageImgURL, setPageImgURL] = useState(defaultProfilePic);
    const [comment, setComment] = useState("");

    // useEffect(() => {
    //   const setImgURL = async () => {
    //     const imageInfo = await getImageInfo(post.userName, "username");
    //     setPageImgURL(imageInfo.userImgURL);
    //   };
    //   setImgURL();
    // }, []);

    const userImgURL = `https://res.cloudinary.com/danscxcd2/image/upload/${post?.user?.userImgKey}`;
    const imgURL = `https://res.cloudinary.com/danscxcd2/image/upload/${post?.imgKey}`;
    // `https://res.cloudinary.com/danscxcd2/image/upload/w_200,h_100,c_fill,q_100/${post?.imgKey}.jpg`;

    const { currentUser } = useContext(AuthContext);
    const { likePost, unlikePost } = useLikePost();
    const { savePost, unsavePost } = useSavePost();

    // useEffect(() => {
    //   if (!currentUser) return;
    //   //TODO: get updated info
    //   //Figure out best way to do this
    //   const liked = userLikedPosts.filter(
    //     (singleLikedPost) => singleLikedPost === post.id
    //   );
    //   const saved = userSavedPosts.filter(
    //     (singleSavedPost) => singleSavedPost === post.id
    //   );
    //   if (liked.length) {
    //     setLiked(true);
    //     setInitialLike(true);
    //   }
    //   if (saved.length) setSaved(true);
    // }, []);

    useEffect(() => {
      if (!currentUser) {
        setLiked(false);
        setInitialLike(false);
        setSaved(false);
      }
    }, [currentUser]);

    const handleLike = () => {
      if (!currentUser) {
        navigate("/accounts/login");
        return;
      }
      if (liked) {
        unlikePost(post.id);
        initialLike ? setLikesOffset(-1) : setLikesOffset(0);
      }
      if (!liked) {
        likePost(post.id);
        initialLike ? setLikesOffset(0) : setLikesOffset(1);
      }
      setLiked(!liked);
    };

    const handleSave = () => {
      if (!currentUser) {
        navigate("/accounts/login");
        return;
      }
      if (saved) unsavePost(post.id);
      if (!saved) savePost(post.id);
      setSaved(!saved);
    };

    const handleComment = (e) => {
      e.preventDefault();
      if (!currentUser) {
        navigate("/accounts/login");
        return;
      }
      addComment(currentUser.displayName, comment, post);
      setComment("");
    };

    const imgContent = (
      <>
        <div className='card-top'>
          <Link
            to={`/${post.user.username}`}
            className='photo-link'
            aria-label={`move to ${post.user.username}'s profile`}
          >
            <img
              className='userImg'
              src={userImgURL}
              alt=''
              aria-hidden='true'
            />
          </Link>
          <div className='photoInfo'>
            <Link
              to={`/${post.user.username}`}
              aria-label={`move to ${post.user.username}'s profile`}
            >
              <div className='userName'>{post.user.username}</div>
            </Link>
            <div className='photoLocation'>
              {post.location && post.location}
            </div>
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
              <button
                className='likeButton'
                aria-label='click to like post'
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
                aria-label='open post to view and make comments'
              >
                <img
                  src={commentBubble}
                  alt=''
                  onClick={() => setShowPhotoModal(true)}
                  aria-hidden='true'
                />
              </button>
              <button
                className='messageButton'
                aria-label='click to share post'
              >
                <img src={message} alt='' aria-hidden='true' />
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
                  alt=''
                  aria-hidden='true'
                  className={saved ? "filled" : ""}
                />
              </button>
            </div>
          </div>
          <div className='card-bottom-text'>
            <div className='likes-counter'>
              {post?.likes + likesOffset}{" "}
              {post?.likes + likesOffset === 1 ? "Like" : "Likes"}
            </div>
            <div className='comments'>
              {/* {post?.comments[0] && (
                <Comment comment={post.comments[0]} abbreviate={true} />
              )}
              {post?.comments[1] && (
                <Comment comment={post.comments[1]} abbreviate={true} />
              )} */}
            </div>
            <div className='view-more-div'>
              <button
                type='button'
                className='view-comments-button'
                aria-label='click to view all comments'
                onClick={() => setShowPhotoModal(true)}
              >
                {/* {post.comments[1]
                  ? `View all ${post.comments.length} comments`
                  : `View all comments`} */}
              </button>
            </div>
            <div className='time-ago'>
              {/* {moment(post.date.toDate()).fromNow().toUpperCase()} */}
            </div>
          </div>
          <div className='input-comment-div'>
            <form onSubmit={handleComment}>
              <div className='input-left'>
                <label>
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
                  className={`${comment.length < 1 && "disabled"}`}
                  disabled={comment.length < 1 ? true : false}
                  aria-disabled={comment.length < 1 ? "true" : "false"}
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
        {showPhotoModal && (
          <PhotoModal
            setShowPhotoModal={setShowPhotoModal}
            userImgURL={pageImgURL}
            post={post}
            liked={liked}
            saved={saved}
            handleLike={handleLike}
            handleSave={handleSave}
            likesOffset={likesOffset}
          />
        )}
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

    const imgCard = ref ? (
      <article className='card' ref={ref}>
        {imgContent}
      </article>
    ) : (
      <article className='card'>{imgContent}</article>
    );

    return imgCard;
  }
);

export default ImgFeedCard;
