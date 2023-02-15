import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db, getURL } from "../firebase";

const useGetUserInfoFunction = () => {
  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async (queryInput, queryParameter) => {
    // if (!currentUser) return;
    try {
      const userQuery = await getDocs(
        query(
          collection(db, "userInfo"),
          where(queryParameter, "==", queryInput)
        )
      );
      const userInfo = userQuery.docs[0].data();
      const userImgURL = await getURL(userInfo.userImg);
      return { ...userInfo, userImgURL: userImgURL, id: userQuery.docs[0].id };
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
    }
  };

  return getUserInfo;
};

export default useGetUserInfoFunction;
