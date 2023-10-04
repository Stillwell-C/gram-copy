import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
// import { AuthContext } from "../../../context/authContext";
// import { ChatContext } from "../../../context/chatContext";
import { db } from "../../../firebase";
import ChatMessage from "../chatMessage/ChatMessage";
import "./chatBody.scss";

const ChatBody = () => {
  const [messages, setMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  // const { currentUser } = useContext(AuthContext);
  // const { userData } = useContext(ChatContext);

  //Placeholders to not cause errors
  const currentUser = "";
  const userData = "";

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", userData.chatId), (doc) => {
      if (doc.exists()) setMessages(doc.data().messages);
    });

    return () => unsub();
  }, [userData.chatId]);

  useEffect(() => {
    const messageArr = [];
    let lastMsg = null;

    for (let message of messages) {
      let time = false;
      if (!lastMsg) {
        time = true;
      }
      if (
        lastMsg &&
        Math.abs(message.date.toDate() - lastMsg.date.toDate()) >= 350000
      ) {
        time = true;
      }
      if (lastMsg && lastMsg.senderId !== message.senderId) {
        time = true;
      }
      lastMsg = message;
      messageArr.push(
        <ChatMessage message={message} key={message.id} time={time} />
      );
    }

    setChatMessages(messageArr);
  }, [messages]);

  return <div className='chat-body-container'>{chatMessages}</div>;
};

export default ChatBody;
