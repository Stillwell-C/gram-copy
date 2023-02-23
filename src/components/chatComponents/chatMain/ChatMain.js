import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import "./chatMain.scss";

import sendNewMessage from "../../../assets/pencil-edit-svgrepo-com.svg";
import SendMessageModal from "../sendMessageModal.js/SendMessageModal";

const ChatMain = () => {
  const { currentUser } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);

  useEffect(() => {
    setUsername(currentUser.displayName);
  }, [currentUser.displayName]);

  return (
    <div className='chat-main-container'>
      <div className='chat-main-body'>
        <div className='chat-main-left'>
          <div className='chat-left-top'>
            <div></div>
            <div className='username-display'>{username}</div>
            <div className='top-button-div'>
              <button
                className='create-msg-btn'
                aria-label='click to write a new message'
                onClick={() => setShowSendMessageModal(true)}
              >
                <img src={sendNewMessage} alt='pencil writing message icon' />{" "}
              </button>
            </div>
            <div className='chat-left-bottom'></div>
          </div>
        </div>
        <div className='chat-main-right'></div>
      </div>
      {showSendMessageModal && (
        <SendMessageModal setShowSendMessageModal={setShowSendMessageModal} />
      )}
    </div>
  );
};

export default ChatMain;
