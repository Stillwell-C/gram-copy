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
import { auth, db } from "../firebase";

const useLikePost = () => {
  const { currentUser } = useContext(AuthContext);

  const likePost = async (ID) => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, "userInfo", auth.currentUser.uid), {
        likedPosts: arrayUnion(ID),
      });
      await updateDoc(doc(db, "userImgs", ID), {
        likedUsers: arrayUnion(auth.currentUser.uid),
      });
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
    }
  };

  const unlikePost = async (ID) => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, "userInfo", auth.currentUser.uid), {
        likedPosts: arrayRemove(ID),
      });
      await updateDoc(doc(db, "userImgs", ID), {
        likedUsers: arrayRemove(auth.currentUser.uid),
      });
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
    }
  };

  return { likePost, unlikePost };
};

export default useLikePost;
