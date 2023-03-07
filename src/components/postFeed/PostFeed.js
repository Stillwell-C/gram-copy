import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AuthContext } from "../../context/authContext";
import useGetPostsCompound from "../../hooks/useGetPostsCompound";
import useGetUserPosts from "../../hooks/useGetUserPosts";
import CreatePostModal from "../createPostModal/CreatePostModal";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import NoUserImgProfileFeed from "../noUserImgProfileFeed/NoUserImgProfileFeed";
import ProfilePostCard from "../profilePostCard/ProfilePostCard";

const PostFeed = ({
  userParam,
  userPosts,
  userQueryInput,
  userLikedPosts,
  userSavedPosts,
}) => {
  const [displayNoImgFeed, setDisplayNoImgFeed] = useState(false);
  const [displayPostModal, setDisplayPostModal] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  // const { loading, error, errorInfo, posts, hasMoreData } = useGetUserPosts(
  //   userParam,
  //   pageNum,
  //   userQueryInput
  // );
  const { loading, error, errorInfo, posts, hasMoreData } = useGetPostsCompound(
    pageNum,
    userParam,
    "==",
    userQueryInput,
    9,
    6
  );

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (
      !loading &&
      userPosts.length < 1 &&
      userQueryInput === "posts" &&
      currentUser?.displayName === userParam
    ) {
      setDisplayNoImgFeed(true);
      return;
    }
    setDisplayNoImgFeed(false);
  }, [userPosts, loading]);

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

  const content = posts.map((post, i) => {
    if (posts.length === i + 1) {
      return (
        <ProfilePostCard
          key={post.id}
          post={post}
          postType={"post"}
          userLikedPosts={userLikedPosts}
          userSavedPosts={userSavedPosts}
          ref={lastPostRef}
        />
      );
    }
    return (
      <ProfilePostCard
        key={post.id}
        post={post}
        postType={"post"}
        userLikedPosts={userLikedPosts}
        userSavedPosts={userSavedPosts}
      />
    );
  });

  const handleAddPostModal = () => {
    setDisplayPostModal(true);
  };

  return (
    <div className='user-posts-container'>
      <>
        {content}
        {loading && <LoadingSpinner />}
        {!loading && displayNoImgFeed && (
          <NoUserImgProfileFeed handleAddPostModal={handleAddPostModal} />
        )}
        {error && errorInfo.message}
        {displayPostModal && (
          <CreatePostModal setDisplayPostModal={setDisplayPostModal} />
        )}
      </>
    </div>
  );
};

export default PostFeed;
