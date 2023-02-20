import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { auth, db } from "../firebase";

const useFollowUnfollow = () => {
  const { currentUser } = useContext(AuthContext);

  const follow = async (secondUserID) => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, "userInfo", auth.currentUser.uid), {
        following: arrayUnion(secondUserID),
      });
      await updateDoc(doc(db, "userInfo", secondUserID), {
        followers: arrayUnion(auth.currentUser.uid),
      });
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
    }
  };

  const unfollow = async (secondUserID) => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, "userInfo", auth.currentUser.uid), {
        following: arrayRemove(secondUserID),
      });
      await updateDoc(doc(db, "userInfo", secondUserID), {
        followers: arrayRemove(auth.currentUser.uid),
      });
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
    }
  };

  return { follow, unfollow };
};

export default useFollowUnfollow;
