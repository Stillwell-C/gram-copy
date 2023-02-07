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

const useLikePost = () => {
  const { currentUser } = useContext(AuthContext);

  const likePost = async (ID) => {
    if (!currentUser) return;
    try {
      const userQuery = await getDocs(
        query(
          collection(db, "userInfo"),
          where("email", "==", currentUser.email)
        )
      );
      await updateDoc(doc(db, "userInfo", userQuery.docs[0].id), {
        likedPosts: arrayUnion(ID),
      });
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
    }
  };

  const unlikePost = async (ID) => {
    if (!currentUser) return;
    try {
      const userQuery = await getDocs(
        query(
          collection(db, "userInfo"),
          where("email", "==", currentUser.email)
        )
      );
      await updateDoc(doc(db, "userInfo", userQuery.docs[0].id), {
        likedPosts: arrayRemove(ID),
      });
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
    }
  };

  return { likePost, unlikePost };
};

export default useLikePost;
