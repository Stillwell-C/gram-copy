import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../firebase";
import "./tagUsersModal.scss";

const TagUsersModal = ({ post, setShowTagUsersModal }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSearch = async (searchInput) => {
    setSelectedUser(null);
    setSearchQuery(searchInput);
    console.log(searchInput);
    if (searchInput > 1) {
      setSearchResults([]);
      return;
    }
    try {
      const usernameQuery = await getDocs(
        query(collection(db, "userInfo"), where("username", "==", searchInput))
      );
      const usernameArr = usernameQuery.docs;
      setSearchResults(usernameArr);
      console.log(usernameArr);
    } catch (err) {
      console.log(err.code);
    }
  };

  const handleTagUser = async () => {
    await updateDoc(doc(db, "userImgs", post.id), {
      taggedUsers: arrayUnion(selectedUser.uid),
    });
    await updateDoc(doc(db, "userInfo", selectedUser.uid), {
      taggedPosts: arrayUnion(post.id),
    });
    setShowTagUsersModal(false);
  };

  const handleSelectUser = (userData) => {
    setSelectedUser(userData);
  };

  return (
    <>
      <div className='tag-users-modal-container'>
        <div className='tag-users-modal-body'>
          <div className='modal-header'>
            <div style={{ display: selectedUser ? "none" : "flex" }}></div>
            <div
              style={{ display: selectedUser ? "flex" : "none" }}
              className='cancel-div'
            >
              <button
                aria-label={`click to close and not tag the user ${selectedUser?.username} in this image`}
                onClick={() => setShowTagUsersModal(false)}
              >
                Cancel
              </button>
            </div>
            <div className='header-text-div'>
              <h2>Tag Users</h2>
            </div>
            <div
              className='close-div'
              style={{ display: selectedUser ? "none" : "flex" }}
            >
              <button
                onClick={() => setShowTagUsersModal(false)}
                aria-label='click to close'
              >
                &times;
              </button>
            </div>
            <div
              style={{ display: selectedUser ? "flex" : "none" }}
              className='next-div'
            >
              <button
                aria-label={`click to tag the user ${selectedUser?.username} in this image`}
                onClick={handleTagUser}
              >
                Next
              </button>
            </div>
          </div>
          <div className='modal-content'>
            <div className='user-search'>
              <label
                aria-label='search for users to tag in this image'
                htmlFor='username-search'
              >
                <input
                  type='text'
                  autoComplete='off'
                  name='username-search'
                  id='username-search'
                  placeholder='Username Search'
                  spellCheck='false'
                  maxLength='30'
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </label>
            </div>

            <div className='search-results'>
              {searchResults.length > 0 &&
                searchResults.map((doc) => (
                  <div
                    key={doc.data().uid}
                    className={`search-result ${
                      doc.data().uid === selectedUser?.uid && "highlight"
                    }`}
                    onClick={() => handleSelectUser(doc.data())}
                  >
                    <div className='profile-picture'>
                      <img src={doc.data().userImgURL} alt='user profile' />
                    </div>
                    <div className='userinfo-div'>
                      <div className='username'>{doc.data().username}</div>
                      <div className='fullname'>{doc.data().fullname}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div
        className='tag-users-modal-overlay'
        aria-label='click to close modal'
        onClick={() => setShowTagUsersModal(false)}
      ></div>
    </>
  );
};

export default TagUsersModal;
