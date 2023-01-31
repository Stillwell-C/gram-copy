import React from "react";
import threeDots from "../../assets/three-dots-line-svgrepo-com.svg";
import heart from "../../assets/heart-rounded-svgrepo-com.svg";
import comment from "../../assets/message-circle-01-svgrepo-com.svg";
import message from "../../assets/message-circle-01-svgrepo-com.svg";
import bookmark from "../../assets/bookmark-svgrepo-com.svg";

const ImgFeedCard = React.forwardRef(({ post }, ref) => {
  const imgContent = (
    <>
      <div className='card-top'>
        <img className='userImg' src={post.userImgURL} alt='user profile' />
        <div className='photoInfo'>
          <div className='userName'>{post.userName}</div>
          <div className='photoLocation'></div>
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
            <button className='likeButton'>
              <img src={heart} alt='heart' />
            </button>
            <button className='commentButton'>
              <img src={comment} alt='comment bubble' />
            </button>
            <button className='messageButton'>
              <img src={message} alt='paper airplane' />
            </button>
          </div>
          <div className='buttons-right'>
            <button className='bookmarkButton'>
              <img src={bookmark} alt='bookmark' />
            </button>
          </div>
        </div>
        <div>Likes: {post.likedUsers.length}</div>
      </div>
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
});

export default ImgFeedCard;
