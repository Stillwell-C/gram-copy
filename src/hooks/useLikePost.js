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
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { db } from "../firebase";

const useLikePost = () => {
  const { currentUser } = useContext(AuthContext);

  const likePost = async (ID) => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, "userInfo", currentUser.userInfoID), {
        likedPosts: arrayUnion(ID),
      });
      await updateDoc(doc(db, "userImgs", ID), {
        likedUsers: arrayUnion(currentUser.userInfoID),
      });
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
    }
  };

  const unlikePost = async (ID) => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, "userInfo", currentUser.userInfoID), {
        likedPosts: arrayRemove(ID),
      });
      await updateDoc(doc(db, "userImgs", ID), {
        likedUsers: arrayRemove(currentUser.userInfoID),
      });
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
    }
  };

  return { likePost, unlikePost };
};

export default useLikePost;
