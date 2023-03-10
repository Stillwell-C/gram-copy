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
    const getImageInfo = useGetUserInfoFunction();
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

    useEffect(() => {
      const setImgURL = async () => {
        const imageInfo = await getImageInfo(post.userName, "username");
        setPageImgURL(imageInfo.userImgURL);
      };
      setImgURL();
    }, []);

    const { currentUser } = useContext(AuthContext);
    const { likePost, unlikePost } = useLikePost();
    const { savePost, unsavePost } = useSavePost();

    useEffect(() => {
      if (!currentUser) return;
      //TODO: get updated info
      //Figure out best way to do this
      const liked = userLikedPosts.filter(
        (singleLikedPost) => singleLikedPost === post.id
      );
      const saved = userSavedPosts.filter(
        (singleSavedPost) => singleSavedPost === post.id
      );
      if (liked.length) {
        setLiked(true);
        setInitialLike(true);
      }
      if (saved.length) setSaved(true);
    }, []);

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
          <img className='userImg' src={pageImgURL} alt='user profile' />
          <div className='photoInfo'>
            <Link to={`/${post.userName}`}>
              <div className='userName'>{post.userName}</div>
            </Link>
            <div className='photoLocation'>
              {post.location && post.location}
            </div>
          </div>
          <button
            className='optionButton'
            onClick={() => setShowAdditionalOptionsModal(true)}
          >
            <img src={threeDots} alt='three dots' />
          </button>
        </div>
        <img
          className='mainImg'
          alt={post.altText ? post.altText : "user upload"}
          src={post.imgURL}
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
                  alt='heart'
                />
              </button>
              <button className='commentButton'>
                <img
                  src={commentBubble}
                  alt='comment bubble'
                  onClick={() => setShowPhotoModal(true)}
                />
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
          <div className='card-bottom-text'>
            <div className='likes-counter'>
              {post.likedUsers.length + likesOffset}{" "}
              {post.likedUsers.length + likesOffset === 1 ? "Like" : "Likes"}
            </div>
            <div className='comments'>
              {post.comments[0] && (
                <Comment comment={post.comments[0]} abbreviate={true} />
              )}
              {post.comments[1] && (
                <Comment comment={post.comments[1]} abbreviate={true} />
              )}
            </div>
            <div className='view-more-div'>
              <button
                type='button'
                className='view-comments-button'
                aria-label='click to view more comments'
                onClick={() => setShowPhotoModal(true)}
              >
                {post.comments[1]
                  ? `View all ${post.comments.length} comments`
                  : `View all comments`}
              </button>
            </div>
            <div className='time-ago'>
              {moment(post.date.toDate()).fromNow().toUpperCase()}
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
                <button type='submit'>Post</button>
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
      <div className='card' ref={ref}>
        {imgContent}
      </div>
    ) : (
      <div className='card'>{imgContent}</div>
    );

    return imgCard;
  }
);

export default ImgFeedCard;
