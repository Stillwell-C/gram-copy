import React from "react";
import { Link } from "react-router-dom";
import defaultProfilePic from "../assets/Default_pfp.svg";
import moment from "moment";

const Notification = ({ notification }) => {
  // const date = new Date(notification.createdAt).toLocaleDateString("en-US", {
  //   month: "short",
  //   day: "numeric",
  // });

  let notificationMessage;
  const userImgURL = notification?.notifyingUser?.userImgKey
    ? `https://res.cloudinary.com/danscxcd2/image/upload/w_90,c_fill/${notification?.notifyingUser?.userImgKey}`
    : defaultProfilePic;

  if (notification.notificationType === "POSTLIKE") {
    notificationMessage = (
      <p className='notification-link'>
        <Link to={`/${notification?.notifyingUser?.username || "#"}`}>
          {notification?.notifyingUser?.username || "A user"}
        </Link>{" "}
        liked your <Link to={`/p/${notification?.post}`}>post</Link>
      </p>
    );
  }
  if (notification.notificationType === "FOLLOW") {
    notificationMessage = (
      <p className='notification-link'>
        <Link to={`/${notification?.notifyingUser?.username || "#"}`}>
          {notification?.notifyingUser?.username || "A user"}
        </Link>{" "}
        followed you
      </p>
    );
  }
  if (notification.notificationType === "COMMENT") {
    notificationMessage = (
      <p className='notification-link'>
        <Link to={`/${notification?.notifyingUser?.username || "#"}`}>
          {notification?.notifyingUser?.username || "A user"}
        </Link>{" "}
        commented on your <Link to={`/p/${notification?.post}`}>post</Link>
      </p>
    );
  }

  let date;
  if (notification?.createdAt) {
    date = moment(notification?.createdAt).fromNow(true);
  }

  return (
    <div className='flex-container gap-1 single-notification flex-justify-start'>
      <div className='notification-left height-100'>
        <Link
          to={`/${notification?.notifyingUser?.username}`}
          className='flex-container flex-align-center height-100'
        >
          <img
            className='user-image circular-image'
            src={userImgURL}
            alt='user profile'
          />
        </Link>
      </div>
      <div className='notification-right'>
        {notificationMessage}
        {date && <time className='notification-date'>{date} ago</time>}
      </div>
    </div>
  );
};

export default Notification;
