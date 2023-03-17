import React, { useContext, useEffect, useState } from "react";
import message from "../../assets/message-bubble-svgrepo-com.svg";
import heart from "../../assets/heart-svgrepo-com.svg";
import trashIcon from "../../assets/trash-delete-svgrepo-com.svg";
import tagUserIcon from "../../assets/user-add-svgrepo-com.svg";
import "./profilePostCard.scss";
import useGetUserInfo from "../../hooks/useGetUserInfo";
import { AuthContext } from "../../context/authContext";
import useLikePost from "../../hooks/useLikePost";
import useSavePost from "../../hooks/useSavePost";
import PhotoModal from "../photoModal/PhotoModal";
import { Link, useNavigate } from "react-router-dom";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import TagUsersModal from "../tagUsersModal/TagUsersModal";

const ProfilePostCard = React.forwardRef(
  ({ post, userLikedPosts, userSavedPosts, postType }, ref) => {
    const { userImgURL } = useGetUserInfo(post.userName, "username");

    const navigate = useNavigate();

    const [liked, setLiked] = useState(false);
    const [initialLike, setInitialLike] = useState(false);
    const [likesOffset, setLikesOffset] = useState(0);
    const [saved, setSaved] = useState(false);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showTagUsersModal, setShowTagUsersModal] = useState(false);

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

    const handleDelete = async () => {
      await deleteDoc(doc(db, "userImgs", post.id));
      showDeleteConfirmation(false);
    };

    const cardContent = (
      <>
        <img
          className='post-img'
          alt={post.altText ? post.altText : "user upload"}
          src={post.imgURL}
        />
        <div className='hover-div'>
          {currentUser?.uid === post.userUid && postType === "post" && (
            <div className='delete-btn-div'>
              <button
                className='delete-btn'
                aria-label='click to delete this image'
                onClick={() => setShowDeleteConfirmation(true)}
              >
                <img src={trashIcon} alt='trash can icon' />
              </button>
            </div>
          )}
          {currentUser?.uid === post.userUid && postType === "post" && (
            <div className='tag-user-btn-div'>
              <button
                className='tag-user-btn'
                aria-label='click to tag a user in this image'
                onClick={() => setShowTagUsersModal(true)}
              >
                <img src={tagUserIcon} alt='tag user icon' />
              </button>
            </div>
          )}
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
        {showDeleteConfirmation && (
          <>
            <div className='delete-confirmation-modal'>
              <div className='delete-confirmation-body'>
                <h4>Are you sure you want to delete this image?</h4>
                <div className='button-div'>
                  <button
                    aria-label='click to cancel and not delete this image'
                    onClick={() => setShowDeleteConfirmation(false)}
                  >
                    Cancel
                  </button>
                  <button
                    aria-label='click to delete this image'
                    className='delete'
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <div
              className='delete-confirmation-overlay'
              onClick={() => setShowDeleteConfirmation(false)}
            ></div>
          </>
        )}
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
        {showTagUsersModal && (
          <TagUsersModal
            post={post}
            setShowTagUsersModal={setShowTagUsersModal}
          />
        )}
      </>
    );

    const postCard = ref ? (
      <Link
        to='#'
        aria-label='click to see image and comments'
        className='post-card-container'
        ref={ref}
      >
        {cardContent}
      </Link>
    ) : (
      <Link
        to='#'
        aria-label='click to see image and comments'
        className='post-card-container'
      >
        {cardContent}
      </Link>
    );

    return postCard;
  }
);

export default ProfilePostCard;
