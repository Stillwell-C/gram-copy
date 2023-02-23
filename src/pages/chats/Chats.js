import React from "react";
import ChatMain from "../../components/chatComponents/chatMain/ChatMain";
import Navbar from "../../components/navbar/Navbar";
import "./chats.scss";

const Chats = () => {
  return (
    <div className='chats-page-container'>
      <div className='navbar'>
        <Navbar />
      </div>
      <div className='chats-main'>
        <ChatMain />
      </div>
    </div>
  );
};

export default Chats;
