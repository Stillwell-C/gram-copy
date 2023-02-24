import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { db } from "../../../firebase";

import "./sendMessageModal.scss";

const SendMessageModal = ({ setShowSendMessageModal }) => {
  const { currentUser } = useContext(AuthContext);

  const [usernameQueryInput, setUsernameQueryInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    handleSearch();
  }, [usernameQueryInput]);

  const handleSearch = async () => {
    setSelectedResult(null);
    if (usernameQueryInput.length < 1) {
      setSearchResults([]);
      return;
    }
    const userQuery = await getDocs(
      query(
        collection(db, "userInfo"),
        where("username", "==", usernameQueryInput)
      )
    );
    const userArr = userQuery.docs;
    console.log(userArr);
    setSearchResults(userArr);
  };

  const handleSelectResult = (index) => {
    if (index === selectedResult) {
      setSelectedResult(null);
      return;
    }
    setSelectedResult(index);
  };

  const handleStartNewChat = async () => {
    const selectedUser = searchResults[selectedResult].data();
    const sharedId =
      currentUser.uid > selectedUser.uid
        ? currentUser.uid + selectedUser.uid
        : selectedUser.uid + currentUser.uid;

    console.log(selectedUser);

    try {
      //Check to see if chat between users exists
      const databaseCheck = await getDoc(doc(db, "chats", sharedId));

      if (!databaseCheck.exists()) {
        //If chat does not exist, create one
        await setDoc(doc(db, "chats", sharedId), { messages: [] });
      }

      //Then create individual docs for each user
      const senderDoc = await getDoc(doc(db, "userChats", currentUser.uid));
      if (senderDoc.exists()) {
        if (senderDoc.exists()) {
          await updateDoc(doc(db, "userChats", currentUser.uid), {
            [`${sharedId}.userInfo`]: {
              uid: selectedUser.uid,
              displayName: selectedUser.username,
              photoURL: selectedUser.userImgURL,
            },
            [`${sharedId}.date`]: serverTimestamp(),
          });
        }
      } else {
        await setDoc(doc(db, "userChats", currentUser.uid), {
          [sharedId]: {
            userInfo: {
              uid: selectedUser.uid,
              displayName: selectedUser.username,
              photoURL: selectedUser.userImgURL,
            },
            date: serverTimestamp(),
          },
        });
      }

      const recieverDoc = await getDoc(doc(db, "userChats", selectedUser.uid));
      if (recieverDoc.exists()) {
        await updateDoc(doc(db, "userChats", selectedUser.uid), {
          [`${sharedId}.userInfo`]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [`${sharedId}.date`]: serverTimestamp(),
        });
      } else {
        await setDoc(doc(db, "userChats", selectedUser.uid), {
          [sharedId]: {
            userInfo: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            },
          },
          date: serverTimestamp(),
        });
      }
    } catch (err) {
      console.log(err.code);
      console.log(err.message);
    }

    setShowSendMessageModal(false);
  };

  const unselected = (
    <svg height='24' width='24'>
      <circle
        cx='12'
        cy='12'
        r='11.25'
        stroke='black'
        strokeWidth='1.5'
        fill='none'
      />
    </svg>
  );

  const selected = (
    <svg height='24' width='24'>
      <circle
        cx='12'
        cy='12'
        r='11.25'
        stroke='#0095f6'
        strokeWidth='1.5'
        fill='#0095f6'
      />
    </svg>
  );

  return (
    <>
      <div className='send-message-modal-body'>
        <div className='modal-header'>
          <div className='header-left'>
            <button
              onClick={() => setShowSendMessageModal(false)}
              aria-label='click to close new message modal'
            >
              &times;
            </button>
          </div>
          <div className='header-text'>
            <h2>New Message</h2>
          </div>
          <div className='header-right'>
            <button
              aria-label='click to create a new chat with your selected user'
              disabled={selectedResult === null}
              className={`${selectedResult !== null && "active"}`}
              onClick={handleStartNewChat}
            >
              Next
            </button>
          </div>
        </div>
        <div className='search-div'>
          <div className='search-div-text'>
            <h4>To:</h4>
          </div>
          <div className='search-input-div'>
            <label
              aria-label='input username to search for users'
              htmlFor='username-msg-query'
            >
              <input
                type='text'
                autoComplete='off'
                name='username-msg-query'
                id='username-msg-query'
                placeholder='Search...'
                value={usernameQueryInput}
                onChange={(e) => setUsernameQueryInput(e.target.value)}
                spellCheck='false'
              />
            </label>
          </div>
        </div>
        <div className='search-results'>
          {searchResults.length > 0 &&
            searchResults.map((doc, index) => (
              <div
                key={doc.data().uid}
                className='individual-result'
                onClick={() => handleSelectResult(index)}
              >
                <div className='profile-picture'>
                  <img src={doc.data().userImgURL} alt='user profile' />
                </div>
                <div className='userinfo-div'>
                  <div className='username'>{doc.data().username}</div>
                  <div className='fullname'>{doc.data().fullname}</div>
                </div>
                <div className='confirmation-div'>
                  <button
                    aria-label={
                      selectedResult === index
                        ? "This user is selected. Click to deslect"
                        : "This user is not selected. Click to select"
                    }
                  >
                    {selectedResult === index ? selected : unselected}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div
        onClick={() => setShowSendMessageModal(false)}
        className='send-message-modal-overlay'
      ></div>
    </>
  );
};

export default SendMessageModal;
