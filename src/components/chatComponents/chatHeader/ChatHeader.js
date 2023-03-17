import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ChatContext } from "../../../context/chatContext";

import infoSvg from "../../../assets/info-circle-svgrepo-com.svg";
import "./chatHeader.scss";

const ChatHeader = () => {
  const { userData } = useContext(ChatContext);
  console.log(userData);

  return (
    <div className='chat-header-container'>
      <div className='user-img-div'>
        <Link
          to={`/${userData.user.displayName}`}
          aria-label="move to user's profile"
        >
          <img src={userData.user.photoURL} alt='user profile' />
        </Link>
      </div>
      <div className='user-info-div'>
        <Link
          to={`/${userData.user.displayName}`}
          aria-label="move to user's profile"
        >
          <span className='username-text'>{userData.user.displayName}</span>
        </Link>
      </div>
      <div className='button-div'>
        <button>
          <img src={infoSvg} alt='' aria-hidden='true' />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
