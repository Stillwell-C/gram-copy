import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage, getURL } from "../firebase";
import useGetUserInfo from "./useGetUserInfo";

const useGetUserPosts = (username, pageNum, userQueryInput) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorInfo, setErrorInfo] = useState({});
  const [posts, setPosts] = useState([]);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [lastDocIndex, setLastDocIndex] = useState();
  //TODO: possibly need some initial loading state for this if error
  const { userPosts, savedPosts } = useGetUserInfo(username, "username");
  const [userQuery, setUserQuery] = useState();

  useEffect(() => {
    setLoading(true);
    setError(false);
    setErrorInfo({});
    runQuery();
  }, [pageNum, userPosts]);

  const runQuery = () => {
    if (userQueryInput === "saved") {
      setUserQuery(savedPosts);
      if (savedPosts.length < 1) {
        setLoading(false);
        return;
      }
      getNewDocs();
      return;
    }
    if (userQuery === "tagged") {
      //TODO: Set up this mechanism
      setUserQuery(userPosts);
      if (userPosts.length < 1) {
        setLoading(false);
        return;
      }
      getNewDocs();
      return;
    }
    setUserQuery(userPosts);
    if (userPosts.length < 1) {
      setLoading(false);
      return;
    }
    getNewDocs();
    return;
  };

  const getNewDocs = async () => {
    try {
      let newIDs = [];

      if (pageNum === 1) {
        for (let i = 1; i < 10; i++) {
          if (userQuery[userQuery.length - i]) {
            newIDs.push(userQuery[userQuery.length - i]);
            setLastDocIndex(i);
          }
        }
      }
      if (pageNum > 1) {
        for (let i = lastDocIndex + 1; i < lastDocIndex + 7; i++) {
          if (userQuery[userQuery.length - i]) {
            newIDs.push(userQuery[userQuery.length - i]);
            setLastDocIndex(i);
          }
        }
      }

      const newDocData = [];
      const pushToArr = async (ID) => {
        try {
          const rawDoc = await getDoc(doc(db, "userImgs", ID));
          const imgURL = await getURL(rawDoc.data().imgName);
          const userImgURL = await getURL(rawDoc.data().userImg);
          newDocData.push({
            ...rawDoc.data(),
            imgURL: imgURL,
            userImgURL: userImgURL,
            id: ID,
          });
        } catch (err) {
          console.log(err.message);
        }
      };

      for (let ID of newIDs) {
        await pushToArr(ID);
      }

      if (pageNum === 1) setPosts(newDocData);
      if (pageNum > 1) setPosts((prev) => [...prev, ...newDocData]);
      setHasMoreData(Boolean(newDocData.length));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(true);
      console.log(err);
      setErrorInfo({ message: err.message });
    }
  };

  return { loading, error, errorInfo, posts, hasMoreData };
};

export default useGetUserPosts;
