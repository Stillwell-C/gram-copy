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
      const userQuery = await getDocs(
        query(
          collection(db, "userInfo"),
          where("email", "==", currentUser.email)
        )
      );
      await updateDoc(doc(db, "userInfo", userQuery.docs[0].id), {
        savedPosts: arrayUnion(ID),
      });
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
    }
  };

  const unsavePost = async (ID) => {
    if (!currentUser) return;
    try {
      const userQuery = await getDocs(
        query(
          collection(db, "userInfo"),
          where("email", "==", currentUser.email)
        )
      );
      await updateDoc(doc(db, "userInfo", userQuery.docs[0].id), {
        savedPosts: arrayRemove(ID),
      });
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
    }
  };

  return { savePost, unsavePost };
};

export default useSavePost;
