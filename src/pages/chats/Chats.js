import React from "react";
import ChatMain from "../../components/chatComponents/chatMain/ChatMain";
import HeaderBar from "../../components/headerBar/HeaderBar";
import Navbar from "../../components/navbar/Navbar";
import "./chats.scss";

const Chats = () => {
  return (
    <div className='chats-page-container'>
      <div className='navbar'>
        <HeaderBar />
        <Navbar />
      </div>
      <div className='chats-main'>
        <ChatMain />
      </div>
    </div>
  );
};

export default Chats;
