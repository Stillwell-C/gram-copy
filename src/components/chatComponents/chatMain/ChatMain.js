import React, { useContext, useEffect, useState } from "react";
import "./chatMain.scss";

import sendNewMessage from "../../../assets/pencil-edit-svgrepo-com.svg";
import SendMessageModal from "../sendMessageModal/SendMessageModal";
import ChatList from "../chatList/ChatList";
// import { AuthContext } from "../../../context/authContext";
// import { ChatContext } from "../../../context/chatContext";
import ChatContainer from "../chatContainer/ChatContainer";

const ChatMain = () => {
  // const { currentUser } = useContext(AuthContext);
  // const { userData } = useContext(ChatContext);

  // const [username, setUsername] = useState("");
  // const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  // const [displayChat, setDisplayChat] = useState(false);

  // useEffect(() => {
  //   setUsername(currentUser.displayName);
  // }, [currentUser.displayName]);

  // useEffect(() => {
  //   if (userData.user.uid) {
  //     setDisplayChat(true);
  //     return;
  //   }
  //   setDisplayChat(false);
  // }, [userData]);

  return (
    // <main className='chat-main-container'>
    //   <div className='chat-main-body'>
    //     <div className='chat-main-left'>
    //       <div className='chat-left-top'>
    //         <div></div>
    //         <div className='username-display'>{username}</div>
    //         <div className='top-button-div'>
    //           <button
    //             className='create-msg-btn'
    //             aria-label='click to write a new message'
    //             onClick={() => setShowSendMessageModal(true)}
    //           >
    //             <img src={sendNewMessage} alt='pencil writing message icon' />
    //           </button>
    //         </div>
    //       </div>
    //       <div className='chat-left-bottom'>
    //         <ChatList />
    //       </div>
    //     </div>
    //     <div className='chat-main-right'>
    //       {displayChat && <ChatContainer />}
    //     </div>
    //   </div>
    //   {showSendMessageModal && (
    //     <SendMessageModal setShowSendMessageModal={setShowSendMessageModal} />
    //   )}
    // </main>
    <main className='flex-container flex-align-center flex-justify-center flex-column fg-1'>
      <h2 className='margin-btm-1'>Page under construction</h2>
      <p>Sorry for the inconvenience.</p>
      <p>Please check back later.</p>
    </main>
  );
};

export default ChatMain;
