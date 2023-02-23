import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";

import "./sendMessageModal.scss";

const SendMessageModal = ({ setShowSendMessageModal }) => {
  const [usernameQueryInput, setUsernameQueryInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    handleSearch();
  }, [usernameQueryInput]);

  const handleSearch = async () => {
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
            <button aria-label='click to create a new chat with your selected user'>
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
            searchResults.map((doc) => (
              <div className='individual-result'>
                <div className='profile-picture'>
                  <img src={doc.data().userImgURL} alt='user profile' />
                </div>
                <div className='userinfo-div'>
                  <div className='username'>{doc.data().username}</div>
                  <div className='fullname'>{doc.data().fullname}</div>
                </div>
                <div className='confirmation-div'>
                  <button aria-label={`change this dynamicaly`}></button>
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
