import { useState, useRef, useCallback, useEffect, useContext } from "react";
import useGetPosts from "../../hooks/useGetPosts";
import "./imageFeed.scss";
import ImgFeedCard from "../../components/imageFeedCard/ImgFeedCard";
import { getURL } from "../../firebase";
import LoadingSpinner from "../../components/loadingSpinner/LoadingSpinner";
import useGetLoggedInUserInfo from "../../hooks/useGetLoggedInUserInfo";
import useGetLoggedInUserInfoFunction from "../../hooks/useGetLoggedInUserInfoFunction";
import { AuthContext } from "../../context/authContext";

const ImageFeed = () => {
  const { currentUser } = useContext(AuthContext);

  const [pageNum, setPageNum] = useState(1);
  const [userLikedPosts, setUserLikedPosts] = useState([]);
  const [userSavedPosts, setUserSavedPosts] = useState([]);
  const { loading, error, errorInfo, posts, hasMoreData } =
    useGetPosts(pageNum);
  const getUserInfo = useGetLoggedInUserInfoFunction();

  const observer = useRef();
  const lastPostRef = useCallback(
    (post) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting && hasMoreData) {
          setPageNum((prev) => prev + 1);
          console.log("near last post");
        }
      });

      if (post) observer.current.observe(post);
    },
    [loading, hasMoreData]
  );

  useEffect(() => {
    console.log("useEffect", posts);
    console.log("more data", hasMoreData);
  }, [posts]);

  useEffect(() => {
    const setInfo = async () => {
      const userInfo = await getUserInfo();
      setUserLikedPosts(userInfo.likedPosts);
      setUserSavedPosts(userInfo.savedPosts);
    };

    currentUser.displayName && setInfo();
  }, [currentUser]);

  const content = posts.map((post, i) => {
    if (posts.length === i + 1) {
      return (
        <ImgFeedCard
          key={post.id}
          post={post}
          userLikedPosts={userLikedPosts}
          userSavedPosts={userSavedPosts}
          ref={lastPostRef}
        />
      );
    }
    return (
      <ImgFeedCard
        key={post.id}
        post={post}
        userLikedPosts={userLikedPosts}
        userSavedPosts={userSavedPosts}
      />
    );
  });

  return (
    <div className='feedContainer'>
      <>
        {content}
        {loading && <LoadingSpinner />}
        {error && errorInfo.message}
      </>
    </div>
  );
};

export default ImageFeed;
