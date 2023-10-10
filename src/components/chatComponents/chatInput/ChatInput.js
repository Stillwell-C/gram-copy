// import React, { useContext, useRef, useState } from "react";
// import "./chatInput.scss";
// import photoImg from "../../../assets/image-svgrepo-com (1).svg";
// // import { AuthContext } from "../../../context/authContext";
// // import { ChatContext } from "../../../context/chatContext";
// import {
//   arrayUnion,
//   doc,
//   serverTimestamp,
//   Timestamp,
//   updateDoc,
// } from "firebase/firestore";
// import { db, storage } from "../../../firebase";
// import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

// const ChatInput = () => {
//   const imgInputRef = useRef(null);
//   // const { currentUser } = useContext(AuthContext);
//   // const { userData } = useContext(ChatContext);

//   //Placeholders to not cause errors
//   const currentUser = "";
//   const userData = "";

//   const [text, setText] = useState("");

//   const sendText = async (e) => {
//     e.preventDefault();
//     if (!text.length) return;

//     try {
//       await updateDoc(doc(db, "chats", userData.chatId), {
//         messages: arrayUnion({
//           id: currentUser.uid + Timestamp.now(),
//           text,
//           senderId: currentUser.uid,
//           date: Timestamp.now(),
//         }),
//       });
//       await updateDoc(doc(db, "userChats", currentUser.uid), {
//         [`${userData.chatId}.lastMessage`]: {
//           text,
//         },
//         [`${userData.chatId}.date`]: serverTimestamp(),
//       });
//       await updateDoc(doc(db, "userChats", userData.user.uid), {
//         [`${userData.chatId}.lastMessage`]: {
//           text,
//         },
//         [`${userData.chatId}.date`]: serverTimestamp(),
//       });
//       setText("");
//     } catch (err) {
//       console.log(err.code);
//     }
//   };

//   const handleImgUpload = async (e) => {
//     e.preventDefault();
//     if (!e.target.files[0]) return;

//     const storageRef = ref(
//       storage,
//       new Date().getTime() + currentUser.uid + e.target.files[0].name
//     );

//     try {
//       await uploadBytesResumable(storageRef, e.target.files[0]);
//       const downloadURL = await getDownloadURL(storageRef);
//       await updateDoc(doc(db, "chats", userData.chatId), {
//         messages: arrayUnion({
//           id: currentUser.uid + Timestamp.now(),
//           img: downloadURL,
//           senderId: currentUser.uid,
//           date: Timestamp.now(),
//         }),
//       });
//       await updateDoc(doc(db, "userChats", currentUser.uid), {
//         [`${userData.chatId}.lastMessage`]: {
//           text: "image",
//         },
//         [`${userData.chatId}.date`]: serverTimestamp(),
//       });
//       await updateDoc(doc(db, "userChats", userData.user.uid), {
//         [`${userData.chatId}.lastMessage`]: {
//           text: "image",
//         },
//         [`${userData.chatId}.date`]: serverTimestamp(),
//       });
//     } catch (err) {
//       console.log(err.code);
//     }
//   };

//   return (
//     <div className='chat-input-container'>
//       <div className='chat-input-div'>
//         <div className='message-input-div'>
//           <form className='message-form' onSubmit={sendText}>
//             <label aria-label='chat message input' htmlFor='message-input'>
//               <input
//                 type='text'
//                 id='message-input'
//                 name='message-input'
//                 className='message-input'
//                 placeholder='Message...'
//                 autoComplete='off'
//                 spellCheck='false'
//                 maxLength='2200'
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//               />
//             </label>
//             {text.length > 0 && (
//               <div className='button-div'>
//                 <button type='submit'>Send</button>
//               </div>
//             )}
//           </form>
//         </div>
//         {!text.length && (
//           <div className='img-button-div button-div'>
//             <button
//               type='button'
//               aria-label='click to send an image'
//               onClick={() => imgInputRef.current.click()}
//             >
//               <img src={photoImg} alt='photograph icon' />
//             </button>
//             <form className='image-form'>
//               <input
//                 type='file'
//                 className='image-upload-input'
//                 accept='image/png, image/jpeg'
//                 ref={imgInputRef}
//                 onChange={handleImgUpload}
//               />
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatInput;
