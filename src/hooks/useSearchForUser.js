import { collection, getDocs, query, where } from "firebase/firestore";
import React from "react";
import { db } from "../firebase";

const useSearchForUser = () => {
  const userSearch = async (searchInput) => {
    try {
      const usernameQuery = await getDocs(
        query(collection(db, "userInfo"), where("username", "==", searchInput))
      );
      const fullnameQuery = await getDocs(
        query(collection(db, "userInfo"), where("fullname", "==", searchInput))
      );
      const usernameArr = usernameQuery.docs;
      const fullnameArr = fullnameQuery.docs;
      const combinedArr = [];
      for (let result of usernameArr) {
        combinedArr.push(result.data());
      }
      for (let result of fullnameArr) {
        combinedArr.push(result.data());
      }
      const uniqueArrFilter = (combinedArr, track = new Set()) =>
        combinedArr.filter(({ uid }) =>
          track.has(uid) ? false : track.add(uid)
        );
      const uniqueCombinedArr = uniqueArrFilter(combinedArr);
      return uniqueCombinedArr;
    } catch (err) {
      console.log(err.code);
    }
  };

  return userSearch;
};

export default useSearchForUser;
