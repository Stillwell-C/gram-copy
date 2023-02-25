import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../../../context/chatContext";
import { db } from "../../../firebase";
import ChatMessage from "../chatMessage/ChatMessage";
import "./chatBody.scss";

const ChatBody = () => {
  const [messages, setMessages] = useState([]);

  const { userData } = useContext(ChatContext);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", userData.chatId), (doc) => {
      if (doc.exists()) setMessages(doc.data().messages);
    });

    return () => unsub();
  }, [userData.chatId]);

  return (
    <div className='chat-body-container'>
      {messages.map((message) => (
        <ChatMessage message={message} key={message.id} />
      ))}
    </div>
  );
};

export default ChatBody;
