import React, { useContext, useEffect, useState } from "react";
import message from "../../assets/message-bubble-svgrepo-com.svg";
import heart from "../../assets/heart-svgrepo-com.svg";
import "./profilePostCard.scss";
import useGetUserInfo from "../../hooks/useGetUserInfo";
import { AuthContext } from "../../context/authContext";
import useLikePost from "../../hooks/useLikePost";
import useSavePost from "../../hooks/useSavePost";
import PhotoModal from "../photoModal/PhotoModal";

const ProfilePostCard = React.forwardRef(
  ({ post, userLikedPosts, userSavedPosts }, ref) => {
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

    return (
      <div className='post-card-container'>
        <img
          className='post-img'
          alt={post.altText ? post.altText : "user upload"}
          src={post.imgURL}
        />
        <div className='hover-div'>
          <div className='icon-div'>
            <div className='icon-row'>
              <img src={heart} alt='heart icon' />
              <span>{post.likedUsers.length}</span>
            </div>
            <div className='icon-row'>
              <img src={message} alt='message bubble icon' />
              <span>{post.comments.length}</span>
            </div>
          </div>
          <div
            className='background'
            onClick={() => setShowPhotoModal(true)}
          ></div>
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
      </div>
    );
  }
);

export default ProfilePostCard;
