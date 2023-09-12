import React, { useState } from "react";
import message from "../../assets/message-bubble-svgrepo-com.svg";
import heart from "../../assets/heart-svgrepo-com.svg";
import trashIcon from "../../assets/trash-delete-svgrepo-com.svg";
import tagUserIcon from "../../assets/user-add-svgrepo-com.svg";
import PhotoModal from "../photoModal/PhotoModal";
import TagUsersModal from "../tagUsersModal/TagUsersModal";
import useAuth from "../../hooks/useAuth";
import DeletePostConfirmationModal from "../DeletePostConfirmationModal";

const ProfilePostCard = React.forwardRef(
  ({ post, profilePosts, queryKey }, ref) => {
    const { id } = useAuth();

    const imgURL = `https://res.cloudinary.com/danscxcd2/image/upload/w_300,c_fill/${post?.imgKey}`;

    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showTagUsersModal, setShowTagUsersModal] = useState(false);

    const cardContent = (
      <>
        <img
          className='post-img'
          alt={post.altText ? post.altText : "user upload"}
          src={imgURL}
        />
        <div className='hover-div'>
          {id === post.user._id && profilePosts && (
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
          {id === post.user._id && profilePosts && (
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
          <div className='icon-div flex-container'>
            <div className='icon-row'>
              <img src={heart} alt='heart icon' />
              <span>{post.likes}</span>
            </div>
            <div className='icon-row'>
              <img src={message} alt='message bubble icon' />
              <span>{post?.comments || 0}</span>
            </div>
          </div>
          <div
            className='background'
            onClick={() => setShowPhotoModal(true)}
          ></div>
        </div>
        {showDeleteConfirmation && (
          <DeletePostConfirmationModal
            setShowDeleteConfirmation={setShowDeleteConfirmation}
            post={post}
          />
        )}
        {showPhotoModal && (
          <PhotoModal
            setShowPhotoModal={setShowPhotoModal}
            post={post}
            queryKey={queryKey}
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
      <article
        aria-label='click to see image and comments dialog'
        className='post-card-container'
        ref={ref}
      >
        {cardContent}
      </article>
    ) : (
      <article
        aria-label='click to see image and comments dialog'
        className='post-card-container'
      >
        {cardContent}
      </article>
    );

    return postCard;
  }
);

export default ProfilePostCard;
