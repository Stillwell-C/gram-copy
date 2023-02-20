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

  useEffect(() => {
    getLoggedInUserInfo();
  }, []);

  const getLoggedInUserInfo = async () => {
    if (!currentUser) return;
    try {
      const userQuery = await getDoc(doc(db, "userInfo", auth.currentUser.uid));
      const userInfo = userQuery.data();
      const userImgURL = await getURL(userInfo.userImg);
      //Update user info in auth context to ensure up to date
      dispatch({
        type: "LOGIN",
        payload: { ...currentUser, ...userInfo, userImgURL: userImgURL },
      });
      return { ...userInfo, userImgURL: userImgURL, id: userQuery.id };
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
    }
  };

  return getLoggedInUserInfo;
};

export default useGetLoggedInUserInfoFunction;
