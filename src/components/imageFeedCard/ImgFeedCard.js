import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import threeDots from "../../assets/three-dots-line-svgrepo-com.svg";
import comment from "../../assets/message-circle-01-svgrepo-com.svg";
import message from "../../assets/plane-svgrepo-com.svg";
import filledBookmark from "../../assets/bookmark-filled.svg";
import outlinedBookmark from "../../assets/bookmark-outline.svg";
import outlinedHeart from "../../assets/heart-rounded-svgrepo-com.svg";
import filledHeart from "../../assets/heart-svgrepo-com.svg";
import Comment from "../comment/Comment";
import moment from "moment";
import { AuthContext } from "../../context/authContext";
import useLikePost from "../../hooks/useLikePost";
import useSavePost from "../../hooks/useSavePost";
import useGetUserInfo from "../../hooks/useGetUserInfo";
import PhotoModal from "../photoModal/PhotoModal";

const ImgFeedCard = React.forwardRef(
  ({ post, userLikedPosts, userSavedPosts }, ref) => {
    //TODO: Have infoID, so could streamline this later
    const { userImgURL } = useGetUserInfo(post.userName, "username");

    const [liked, setLiked] = useState(false);
    const [initialLike, setInitialLike] = useState(false);
    const [likesOffset, setLikesOffset] = useState(0);
    const [saved, setSaved] = useState(false);
    const [showPhotoModal, setShowPhotoModal] = useState(false);

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

    const handleLike = () => {
      if (!currentUser) return;
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
      if (!currentUser) return;
      if (saved) unsavePost(post.id);
      if (!saved) savePost(post.id);
      setSaved(!saved);
    };

    const imgContent = (
      <>
        <div className='card-top'>
          <img className='userImg' src={userImgURL} alt='user profile' />
          <div className='photoInfo'>
            <Link to={`/${post.userName}`}>
              <div className='userName'>{post.userName}</div>
            </Link>
            <div className='photoLocation'>
              {post.location && post.location}
            </div>
          </div>
          <button className='optionButton'>
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
                <img src={comment} alt='comment bubble' />
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
            <form>
              <div className='input-left'>
                <label>
                  <input
                    type='text'
                    maxLength={2200}
                    placeholder='Add a comment...'
                  />
                </label>
              </div>
              <div className='input-right'>
                <button>Post</button>
              </div>
            </form>
          </div>
        </div>
        {showPhotoModal && (
          <PhotoModal
            setShowPhotoModal={setShowPhotoModal}
            userImgURL={userImgURL}
            post={post}
            liked={liked}
            saved={saved}
            handleLike={handleLike}
            handleSave={handleSave}
            likesOffset={likesOffset}
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
