import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";
import { ChatContext } from "../../../context/chatContext";

import "./chatMessage.scss";

const ChatMessage = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { userData } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div className='message-container' ref={ref}>
      <div className='time-display'>
        {message.date
          .toDate()
          .toLocaleTimeString("en-US", { timeStyle: "short" })}
      </div>
      <div
        className={`message-lower ${
          message.senderId !== currentUser.uid && "recieved-message"
        }`}
      >
        {message.senderId !== currentUser.uid && (
          <div className='user-img-div'>
            <Link
              to={`/${userData.user.displayName}`}
              aria-label="click to go to user's profile"
            >
              <img src={userData.user.photoURL} alt='user profile' />
            </Link>
          </div>
        )}
        <div className='message-content'>
          {message.text && <p>{message.text}</p>}
          {message.img && (
            <img
              src={message.img}
              alt={`Sent by ${
                message.senderId === currentUser.uid
                  ? "you"
                  : userData.user.displayName
              }`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
