import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { db } from "../../firebase";
import FollowUserModalUser from "../followUserModalUser/FollowUserModalUser";
import "./followUserModal.scss";

const FollowUserModal = ({
  setShowFollowModal,
  modalType,
  pageFollowers,
  pageFollowing,
}) => {
  const [userArr, setUserArr] = useState([]);
  const [userInfoArr, setUserInfoArr] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (modalType === "followers") {
      setUserArr(pageFollowers);
      return;
    }
    setUserArr(pageFollowing);
  }, []);

  useEffect(() => {
    let userData = [];
    const getData = async () => {
      const currentUserData = await getDoc(
        doc(db, "userInfo", currentUser.uid)
      );
      for (let userUid of userArr) {
        const singleUserData = await getDoc(doc(db, "userInfo", userUid));
        const currentUserFollowing = currentUserData
          .data()
          .following.includes(userUid);
        userData.push({ ...singleUserData.data(), currentUserFollowing });
      }
      setUserInfoArr(userData);
    };

    getData();
  }, [userArr]);

  const renderedUsers = userInfoArr.map((userDoc) => (
    <FollowUserModalUser userDoc={userDoc} />
  ));

  return (
    <>
      <div className='follow-user-modal-container'>
        <div className='follow-user-modal-body'>
          <div className='follow-user-modal-header'>
            <div></div>
            <div className='modal-header-text'>
              <h2>
                {modalType.slice(0, 1).toUpperCase() + modalType.slice(1)}
              </h2>
            </div>
            <div className='close-div'>
              <button
                onClick={() => setShowFollowModal(false)}
                aria-label='click to close'
              >
                &times;
              </button>
            </div>
          </div>
          <div className='follow-user-modal-content'>{renderedUsers}</div>
        </div>
      </div>
      <div
        className='follow-user-modal-overlay'
        aria-label='click to close modal'
        onClick={() => setShowFollowModal(false)}
      ></div>
    </>
  );
};

export default FollowUserModal;
