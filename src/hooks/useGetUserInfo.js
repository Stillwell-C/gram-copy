import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { db, getURL } from "../firebase";

const useGetUserInfo = (queryInput, queryParameter) => {
  const [email, setEmail] = useState("");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [fullname, setFullName] = useState("");
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [userBio, setUserBio] = useState("");
  const [userImg, setUserImg] = useState("");
  const [userImgURL, setUserImgURL] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [allData, setAllData] = useState({});

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
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
      setAllData({ ...userInfo, userImgURL: userImgURL });
      setEmail(userInfo.email);
      setFollowers([...userInfo.followers]);
      setFollowing([...userInfo.following]);
      setFullName(userInfo.fullname);
      setLikedPosts([...userInfo.likedPosts]);
      setSavedPosts([...userInfo.savedPosts]);
      setUserBio(userInfo.userBio);
      setUserImg(userInfo.userImg);
      setUserImgURL(userImgURL);
      setUserPosts(userInfo.userPosts);
      setUsername(userInfo.username);
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
    }
  };

  return {
    email,
    followers,
    following,
    fullname,
    likedPosts,
    savedPosts,
    userBio,
    userImg,
    userImgURL,
    userPosts,
    username,
    allData,
  };
};

export default useGetUserInfo;
