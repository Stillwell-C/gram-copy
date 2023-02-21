import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { auth, db, getURL } from "../firebase";

const useGetLoggedInUserInfoFunction = () => {
  const { currentUser, dispatch } = useContext(AuthContext);

  const getLoggedInUserInfo = async () => {
    if (!currentUser) return;
    try {
      const userQuery = await getDoc(doc(db, "userInfo", auth.currentUser.uid));
      const userInfo = userQuery.data();

      // const userQuery = await getDocs(
      //   query(
      //     collection(db, "userInfo"),
      //     where("username", "==", currentUser.displayName)
      //   )
      // );
      // const userInfo = userQuery.docs[0].data();
      //Update user info in auth context to ensure up to date
      // dispatch({
      //   type: "LOGIN",
      //   payload: { ...currentUser, ...userInfo },
      // });
      return userInfo;
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
    }
  };

  return getLoggedInUserInfo;
};

export default useGetLoggedInUserInfoFunction;
