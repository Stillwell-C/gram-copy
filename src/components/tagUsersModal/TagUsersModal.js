import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import "./tagUsersModal.scss";

const TagUsersModal = ({ post, setShowTagUsersModal }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showTaggedUsersModal, setShowTaggedUsersModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [taggedUsersArr, setTaggedUsersArr] = useState([]);
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

  const handleGetTaggedUsers = async () => {
    setShowTaggedUsersModal(true);
    const postDoc = await getDoc(doc(db, "userImgs", post.id));
    const postData = postDoc.data();
    const userArr = [];
    for (let user of postData.taggedUsers) {
      const userDoc = await getDoc(doc(db, "userInfo", user));
      userArr.push(userDoc.data());
    }
    setTaggedUsersArr(userArr);
  };

  const handleUntagUser = async (userUid) => {
    await updateDoc(doc(db, "userImgs", post.id), {
      taggedUsers: arrayRemove(userUid),
    });
    await updateDoc(doc(db, "userInfo", userUid), {
      taggedPosts: arrayRemove(post.id),
    });
    setTaggedUsersArr((prevState) =>
      prevState.filter((user) => user.uid !== userUid)
    );
  };

  const handleSelectUser = (userData) => {
    setSelectedUser(userData);
  };

  return (
    <>
      <div className='tag-users-modal-container'>
        <div
          className='tag-users-modal-body'
          style={{ display: showTaggedUsersModal ? "none" : "flex" }}
        >
          <div className='modal-header'>
            <div
              style={{ display: selectedUser ? "none" : "flex" }}
              className='header-btn-div left'
            >
              <button
                aria-label={`click to see currently tagged users`}
                onClick={handleGetTaggedUsers}
                type='button'
              >
                Tagged users
              </button>
            </div>
            <div
              style={{ display: selectedUser ? "flex" : "none" }}
              className='header-btn-div left'
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
              className='header-btn-div close-div'
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
              className='next-div header-btn-div'
            >
              <button
                aria-label={`click to tag the user ${selectedUser?.username} in this image`}
                onClick={handleTagUser}
              >
                Tag
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
        <div className='check-tagged-users-body'>
          <div className='modal-header'>
            <div className='header-btn-div left'>
              {" "}
              <button
                aria-label={`click to return to previous screen`}
                onClick={() => setShowTaggedUsersModal(false)}
              >
                Back
              </button>
            </div>
            <div className='header-text-div'>
              <h2>Tagged Users</h2>
            </div>
            <div className='header-btn-div close-div'>
              <button
                onClick={() => setShowTagUsersModal(false)}
                aria-label='click to close'
              >
                &times;
              </button>
            </div>
          </div>
          <div className='modal-content'>
            <div className='user-list'>
              {taggedUsersArr.map((user) => (
                <div className='individual-user'>
                  <div className='individual-user-left'>
                    <Link
                      to={`/${user.username}`}
                      aria-label={`click to move to ${user.username}'s profile`}
                    >
                      <div className='profile-picture'>
                        <img src={user.userImgURL} alt='user profile' />
                      </div>
                    </Link>
                    <div className='userinfo-div'>
                      <Link
                        key={user.uid}
                        to={`/${user.username}`}
                        aria-label={`click to move to ${user.username}'s profile`}
                      >
                        <div className='username'>{user.username}</div>
                      </Link>
                      <div className='fullname'>{user.fullname}</div>
                    </div>
                  </div>
                  <div className='button-div'>
                    <button
                      aria-label={`click to remove ${user.username} tag from image`}
                      onClick={() => handleUntagUser(user.uid)}
                    >
                      Remove
                    </button>
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
