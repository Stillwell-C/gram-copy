import React from "react";
import { Link } from "react-router-dom";

const Notification = ({ notification }) => {
  let notificationMessage;

  const date = new Date(notification.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  if (notification.notificationType === "POSTLIKE") {
    notificationMessage = (
      <p>
        <Link to={`/${notification?.notifyingUser?._id}`}>
          {notification?.notifyingUser?.username}
        </Link>{" "}
        liked your <Link to={`/p/${notification?.post}`}>post</Link>
      </p>
    );
  }
  if (notification.notificationType === "FOLLOW") {
    notificationMessage = (
      <p>
        <Link to={`/${notification?.notifyingUser?._id}`}>
          {notification?.notifyingUser?.username}
        </Link>{" "}
        followed you
      </p>
    );
  }
  if (notification.notificationType === "COMMENT") {
    notificationMessage = (
      <p>
        <Link to={`/${notification?.notifyingUser?._id}`}>
          {notification?.notifyingUser?.username}
        </Link>{" "}
        commented on your <Link to={`/p/${notification?.post}`}>post</Link>
      </p>
    );
  }

  return (
    <div className='flex-container gap-1 single-notification'>
      <time>{date}</time> {notificationMessage}
    </div>
  );
};

export default Notification;
