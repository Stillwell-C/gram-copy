import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { db } from "../../firebase";
import FollowUserModalUser from "../followUserModalUser/FollowUserModalUser";
import "./followUserModal.scss";
import { FadeLoader } from "react-spinners";
import FocusTrapModalParent from "../FocusTrapModalParent";

const FollowUserModal = ({
  users,
  modalType,
  setShowModal,
  isLoading,
  isFetching,
}) => {
  // const [userArr, setUserArr] = useState([]);
  // const [userInfoArr, setUserInfoArr] = useState([]);
  // const { currentUser } = useContext(AuthContext);

  // useEffect(() => {
  //   if (modalType === "followers") {
  //     setUserArr(pageFollowers);
  //     return;
  //   }
  //   setUserArr(pageFollowing);
  // }, []);

  // useEffect(() => {
  //   let userData = [];
  //   const getData = async () => {
  //     let currentUserData = null;
  //     if (currentUser?.uid) {
  //       const currentUserDoc = await getDoc(
  //         doc(db, "userInfo", currentUser.uid)
  //       );
  //       currentUserData = currentUserDoc.data();
  //     }
  //     for (let userUid of userArr) {
  //       const singleUserData = await getDoc(doc(db, "userInfo", userUid));
  //       const currentUserFollowing = currentUser
  //         ? currentUserData.following.includes(userUid)
  //         : false;
  //       userData.push({ ...singleUserData.data(), currentUserFollowing });
  //     }
  //     setUserInfoArr(userData);
  //   };

  //   getData();
  // }, [userArr]);

  // const renderedUsers = userInfoArr.map((userDoc) => (
  //   <FollowUserModalUser userDoc={userDoc} key={userDoc.uid} />
  // ));

  const handleClose = () => {
    setShowModal(false);
  };

  const content = (
    <div className='follow-user-modal-container'>
      <div
        className='follow-user-modal-body'
        role='dialog'
        aria-labelledby='dialog-header'
      >
        <div className='follow-user-modal-header'>
          <div></div>
          <div className='modal-header-text'>
            <h2 id='dialog-header'>
              {modalType.slice(0, 1).toUpperCase() + modalType.slice(1)}
            </h2>
          </div>
          <div className='close-div'>
            <button
              onClick={() => setShowModal(false)}
              aria-label='click to close'
            >
              &times;
            </button>
          </div>
        </div>
        <div className='follow-user-modal-content'>
          {users}
          <div className='loading-div'>
            {(isFetching || isLoading) && (
              <FadeLoader cssOverride={{ scale: "0.5" }} color='#333' />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <FocusTrapModalParent
      content={content}
      handleClose={handleClose}
      showClose={false}
    />
  );
};

export default FollowUserModal;
