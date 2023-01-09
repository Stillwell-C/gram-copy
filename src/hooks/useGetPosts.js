import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

const useGetPosts = (pageNum) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorInfo, setErrorInfo] = useState({});
  const [posts, setPosts] = useState([]);
  const [hasMoreData, setHasMoreData] = useState(false);

  useEffect(() => {
    console.log("pgNum", pageNum);
    setLoading(true);
    setError(false);
    setErrorInfo({});

    getNewDocs();
    // getDocs(query(collection(db, "testStorage"), limit(5))).then((docs) => {
    //   docs.forEach((doc) => console.log(doc.data()));
    // });
  }, [pageNum]);

  useEffect(() => {
    console.log(posts);
  }, [posts]);

  const getNewDocs = async () => {
    try {
      let newDocs;

      if (!posts.length) {
        newDocs = await getDocs(
          query(collection(db, "testStorage"), orderBy("order"), limit(5))
        );
      }
      if (posts.length) {
        const lastPost = posts[posts.length - 1].order;
        console.log(lastPost);
        newDocs = await getDocs(
          query(
            collection(db, "testStorage"),
            orderBy("order"),
            startAfter(lastPost),
            limit(5)
          )
        );
      }

      const newDocData = [];
      newDocs.forEach((doc) => {
        newDocData.push({ ...doc.data(), id: doc.id });
      });
      if (!posts.length) setPosts(newDocData);
      if (posts.length) setPosts((prev) => [...prev, ...newDocData]);
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
