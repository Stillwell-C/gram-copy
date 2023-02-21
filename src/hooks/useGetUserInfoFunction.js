import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const useGetUserInfoFunction = () => {
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
      return { ...userInfo };
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
    }
  };

  return getUserInfo;
};

export default useGetUserInfoFunction;
