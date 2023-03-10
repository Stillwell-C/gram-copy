import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  where,
} from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage, getURL } from "../firebase";
import useGetUserInfoFunction from "./useGetUserInfoFunction";

const useGetPostsCompound = (
  pageNum,
  queryInput,
  queryOperand,
  queryParameter,
  initialLimit,
  secondaryLimit
) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorInfo, setErrorInfo] = useState({});
  const [posts, setPosts] = useState([]);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [lastDoc, setLastDoc] = useState();
  const [userInfo, setUserInfo] = useState({});
  const [querySearchParam, setQuerySearchParam] = useState("");

  const getInfo = useGetUserInfoFunction();

  useEffect(() => {
    const getUserInfo = async () => {
      const fetchedInfo = await getInfo(queryInput, "username");
      setUserInfo(fetchedInfo);
    };
    queryInput && getUserInfo();
  }, [queryInput]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setErrorInfo({});
    userInfo.username && querySearchParam.length > 0 && getNewPosts();
  }, [pageNum, userInfo]);

  useEffect(() => {
    if (queryParameter === "posts") setQuerySearchParam("userUid");
  }, [queryParameter]);

  const getNewPosts = async () => {
    try {
      let newDocs;

      if (pageNum === 1) {
        newDocs = await getDocs(
          query(
            collection(db, "userImgs"),
            where(querySearchParam, queryOperand, userInfo.uid),
            orderBy("date", "desc"),
            limit(initialLimit)
          )
        );
      }
      if (pageNum > 1) {
        const lastPost = posts[posts.length - 1];
        console.log("last post", lastPost);
        newDocs = await getDocs(
          query(
            collection(db, "userImgs"),
            where(querySearchParam, queryOperand, userInfo.uid),
            orderBy("date", "desc"),
            limit(secondaryLimit),
            startAfter(lastDoc)
          )
        );
      }

      setLastDoc(newDocs.docs[newDocs.docs.length - 1]);

      const newDocData = [];
      const pushToArr = async (doc) => {
        try {
          newDocData.push({
            ...doc.data(),
            userImgURL: userInfo.userImgURL,
            id: doc.id,
          });
        } catch (err) {
          console.log(err.message);
        }
      };

      for (let doc of newDocs.docs) {
        await pushToArr(doc);
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

export default useGetPostsCompound;
