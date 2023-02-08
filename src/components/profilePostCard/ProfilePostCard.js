import React from "react";
import message from "../../assets/message-bubble-svgrepo-com.svg";
import heart from "../../assets/heart-svgrepo-com.svg";
import "./profilePostCard.scss";

const ProfilePostCard = React.forwardRef(({ post }, ref) => {
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
        <div className='background'></div>
      </div>
    </div>
  );
});

export default ProfilePostCard;
