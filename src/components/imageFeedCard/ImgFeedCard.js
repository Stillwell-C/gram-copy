import React from "react";
import { Link } from "react-router-dom";
import threeDots from "../../assets/three-dots-line-svgrepo-com.svg";
import heart from "../../assets/heart-rounded-svgrepo-com.svg";
import comment from "../../assets/message-circle-01-svgrepo-com.svg";
import message from "../../assets/plane-svgrepo-com.svg";
import bookmark from "../../assets/bookmark-svgrepo-com.svg";
import Comment from "../comment/Comment";
import moment from "moment";

const ImgFeedCard = React.forwardRef(({ post }, ref) => {
  const imgContent = (
    <>
      <div className='card-top'>
        <img className='userImg' src={post.userImgURL} alt='user profile' />
        <div className='photoInfo'>
          <Link to={`/${post.userName}`}>
            <div className='userName'>{post.userName}</div>
          </Link>
          <div className='photoLocation'>{post.location && post.location}</div>
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
        <div className='card-bottom-text'>
          <div className='likes-counter'>{post.likedUsers.length} Likes</div>
          <div className='comments'>
            {post.comments[0] && (
              <Comment comment={post.comments[0]} abbreviate={true} />
            )}
            {post.comments[1] && (
              <Comment comment={post.comments[1]} abbreviate={true} />
            )}
          </div>
          <div className='view-more-div'>
            {post.comments[1]
              ? `View all ${post.comments.length} posts`
              : `View all posts`}
          </div>
          <div className='time-ago'>
            {moment(post.date.toDate()).fromNow().toUpperCase()}
          </div>
        </div>
        <div className='input-comment-div'>
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
        </div>
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
