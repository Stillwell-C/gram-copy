// import { doc, onSnapshot } from "firebase/firestore";
// import React, { useContext, useEffect, useState } from "react";
// // import { AuthContext } from "../../../context/authContext";
// // import { ChatContext } from "../../../context/chatContext";
// import { db } from "../../../firebase";
// import ChatListChat from "../chatListChat/ChatListChat";

// const ChatList = () => {
//   // const { currentUser } = useContext(AuthContext);

//   //Placeholder to not cause errors
//   const currentUser = "";
//   const dispatch = () => {};

//   // const { dispatch } = useContext(ChatContext);

//   const [chatList, setChatList] = useState([]);

//   useEffect(() => {
//     const getChats = () => {
//       const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
//         if (doc.data()) setChatList(Object.entries(doc.data()));
//       });

//       return () => unsub();
//     };

//     currentUser.uid && getChats();
//   }, [currentUser.uid]);

//   const chats = chatList
//     ?.sort((a, b) => b[1].date - a[1].date)
//     .map((chat) => <ChatListChat key={chat[0]} chat={chat} />);

//   return <div className='chat-list-container'>{chats}</div>;
// };

// export default ChatList;
