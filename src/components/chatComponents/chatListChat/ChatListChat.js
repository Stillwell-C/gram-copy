import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { db } from "../../../firebase";
import { ChatContext } from "../../../context/chatContext";
import "./chatListChat.scss";

const ChatListChat = ({ chat }) => {
  const { currentUser } = useContext(AuthContext);
  const { userData, dispatch } = useContext(ChatContext);

  const [imgURL, setImgURL] = useState(chat[1].userInfo.photoURL);
  const [lastMsg, setLastMsg] = useState("");

  useEffect(() => {
    const getURL = async () => {
      const userInfo = await getDoc(doc(db, "userInfo", chat[1].userInfo.uid));

      if (userInfo.data().userImgURL !== chat[1].userInfo.photoURL) {
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [`${chat[0]}.userInfo`]: {
            photoURL: userInfo.userImgURL,
          },
        });
        setImgURL(userInfo.userImgURL);
      }
    };

    if (chat[1].lastMessage) {
      if (chat[1].lastMessage.text.length > 20) {
        setLastMsg(chat[1].lastMessage.text.slice(0, 20) + "...");
      }
      if (chat[1].lastMessage.text.length < 20) {
        setLastMsg(chat[1].lastMessage.text);
      }
    }

    currentUser.uid && getURL();
  }, [currentUser.uid]);

  const handleSelect = () => {
    dispatch({ type: "CHANGE_USER", payload: chat[1].userInfo });
  };

  return (
    <div
      className={`individual-chat ${
        userData.user.uid === chat[1].userInfo.uid && "active"
      }`}
      onClick={handleSelect}
    >
      <img src={imgURL} alt='user profile' />
      <div className='chat-info'>
        <span className='username'>{chat[1].userInfo.displayName}</span>
        <span className='last-message'>{lastMsg}</span>
      </div>
    </div>
  );
};

export default ChatListChat;
