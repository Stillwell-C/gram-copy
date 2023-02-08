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
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { db } from "../firebase";

const useSavePost = () => {
  const { currentUser } = useContext(AuthContext);

  const savePost = async (ID) => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, "userInfo", currentUser.userInfoID), {
        savedPosts: arrayUnion(ID),
      });
      await updateDoc(doc(db, "userImgs", ID), {
        savedUsers: arrayUnion(currentUser.userInfoID),
      });
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
    }
  };

  const unsavePost = async (ID) => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, "userInfo", currentUser.userInfoID), {
        savedPosts: arrayRemove(ID),
      });
      await updateDoc(doc(db, "userImgs", ID), {
        savedUsers: arrayRemove(currentUser.userInfoID),
      });
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
    }
  };

  return { savePost, unsavePost };
};

export default useSavePost;
