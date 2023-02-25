import React from "react";
import ChatHeader from "../chatHeader/ChatHeader";
import ChatBody from "../chatBody/ChatBody";
import ChatInput from "../chatInput/ChatInput";
import "./chatContainer.scss";

const ChatContainer = () => {
  return (
    <div className='chat-container-div'>
      <ChatHeader />
      <ChatBody />
      <ChatInput />
    </div>
  );
};

export default ChatContainer;
