import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../../../firebase";
// import { AuthContext } from "../../../context/authContext";
// import { ChatContext } from "../../../context/chatContext";
import "./chatListChat.scss";

const ChatListChat = ({ chat }) => {
  // const { currentUser } = useContext(AuthContext);
  // const { userData, dispatch } = useContext(ChatContext);

  //Placeholders to not cause errors
  const currentUser = "";
  const userData = "";
  const dispatch = () => {};

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
  }, [currentUser.uid, chat]);

  const handleSelect = () => {
    dispatch({ type: "CHANGE_USER", payload: chat[1].userInfo });
  };

  return (
    <button
      className={`individual-chat ${
        userData.user.uid === chat[1].userInfo.uid && "active"
      }`}
      onClick={handleSelect}
      aria-label={`click to open chat with ${chat[1].userInfo.displayName}`}
    >
      <img src={imgURL} alt='user profile' />
      <div className='chat-info'>
        <span className='username'>{chat[1].userInfo.displayName}</span>
        <span className='last-message'>{lastMsg}</span>
      </div>
    </button>
  );
};

export default ChatListChat;
