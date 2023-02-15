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
import { db } from "../firebase";

const useFollowUnfollow = () => {
  const { currentUser } = useContext(AuthContext);

  const follow = async (secondUserID) => {
    if (!currentUser) return;
    try {
      //   const userQuery = await getDocs(
      //     query(
      //       collection(db, "userInfo"),
      //       where("username", "==", secondUsername)
      //     )
      //   );
      //   const secondUserID = userQuery.docs[0].id;
      await updateDoc(doc(db, "userInfo", currentUser.userInfoID), {
        following: arrayUnion(secondUserID),
      });
      await updateDoc(doc(db, "userInfo", secondUserID), {
        followers: arrayUnion(currentUser.userInfoID),
      });
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
    }
  };

  const unfollow = async (secondUserID) => {
    if (!currentUser) return;
    try {
      //   const userQuery = await getDocs(
      //     query(
      //       collection(db, "userInfo"),
      //       where("username", "==", secondUsername)
      //     )
      //   );
      //   const secondUserID = userQuery.docs[0].id;
      await updateDoc(doc(db, "userInfo", currentUser.userInfoID), {
        following: arrayRemove(secondUserID),
      });
      await updateDoc(doc(db, "userInfo", secondUserID), {
        followers: arrayRemove(currentUser.userInfoID),
      });
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
    }
  };

  return { follow, unfollow };
};

export default useFollowUnfollow;
