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
import { auth, db } from "../firebase";

const useSavePost = () => {
  const { currentUser } = useContext(AuthContext);

  const savePost = async (ID) => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, "userInfo", auth.currentUser.uid), {
        savedPosts: arrayUnion(ID),
      });
      await updateDoc(doc(db, "userImgs", ID), {
        savedUsers: arrayUnion(auth.currentUser.uid),
      });
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
    }
  };

  const unsavePost = async (ID) => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, "userInfo", auth.currentUser.uid), {
        savedPosts: arrayRemove(ID),
      });
      await updateDoc(doc(db, "userImgs", ID), {
        savedUsers: arrayRemove(auth.currentUser.uid),
      });
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
    }
  };

  return { savePost, unsavePost };
};

export default useSavePost;
