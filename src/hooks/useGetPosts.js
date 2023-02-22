import { useState, useEffect } from "react";
import {
  collection,
  doc,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage, getURL } from "../firebase";

const useGetPosts = (pageNum) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorInfo, setErrorInfo] = useState({});
  const [posts, setPosts] = useState([]);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [lastDoc, setLastDoc] = useState();

  useEffect(() => {
    setLoading(true);
    setError(false);
    setErrorInfo({});

    getNewDocs();
  }, [pageNum]);

  const getNewDocs = async () => {
    try {
      let newDocs;

      if (pageNum === 1) {
        newDocs = await getDocs(
          query(collection(db, "userImgs"), orderBy("date", "desc"), limit(3))
        );
      }
      if (pageNum > 1) {
        const lastPost = posts[posts.length - 1];
        console.log("last post", lastPost);
        newDocs = await getDocs(
          query(
            collection(db, "userImgs"),
            orderBy("date", "desc"),
            limit(3),
            startAfter(lastDoc)
          )
        );
      }

      console.log(newDocs);

      setLastDoc(newDocs.docs[newDocs.docs.length - 1]);

      const newDocData = [];
      const pushToArr = async (document) => {
        try {
          const docInfo = document.data();
          const userInfo = await getDoc(doc(db, "userInfo", docInfo.userUid));
          newDocData.push({
            ...docInfo,
            userImgURL: userInfo.userImgURL,
            id: document.id,
          });
        } catch (err) {
          console.log(err.message);
        }
      };

      for (let document of newDocs.docs) {
        await pushToArr(document);
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

export default useGetPosts;
