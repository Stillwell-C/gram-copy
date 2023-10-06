import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { getUsersFromArr } from "./usersApiRoutes";
import { FadeLoader } from "react-spinners";
import RemoveTaggedUserButton from "../posts/RemoveTaggedUserButton";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setError, setErrorRefreshPage } from "../error/errorSlice";

const TaggedUsersDisplay = ({
  post,
  setShowTagUsersModal,
  setShowTaggedUsersDisplay,
}) => {
  const userImgURL = (imgKey) =>
    `https://res.cloudinary.com/danscxcd2/image/upload/w_150,c_fill/${imgKey}`;

  const dispatch = useDispatch();

  const {
    data: taggedUsers,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["taggedUsers", post._id],
    queryFn: () => getUsersFromArr(post?.taggedUsers),
    enabled: post?.taggedUsers?.length > 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isError) {
      if (error?.response?.status === 400) return;
      dispatch(setError(true));
      dispatch(setErrorRefreshPage(false));
    }
  }, [isError]);

  return (
    <div
      className='check-tagged-users-body'
      role='dialog'
      aria-labelledby='dialog-header'
    >
      <div className='modal-header'>
        <div className='header-btn-div left'>
          <button
            aria-label={`click to return to previous screen`}
            onClick={() => setShowTaggedUsersDisplay(false)}
          >
            Back
          </button>
        </div>
        <div className='header-text-div'>
          <h2 id='dialog-header'>Tagged Users</h2>
        </div>
        <div className='header-btn-div close-div'>
          <button
            onClick={() => setShowTagUsersModal(false)}
            aria-label='click to close'
          >
            &times;
          </button>
        </div>
      </div>
      <div className='user-list width-100 flex-container flex-column'>
        {isLoading && (
          <div className='loading-div'>
            <FadeLoader color='#333' cssOverride={{ scale: "0.5" }} />
          </div>
        )}
        {!isLoading &&
          taggedUsers?.map((user) => (
            <div
              className='individual-user width-100 flex-container flex-align-center'
              key={user._id}
            >
              <div className='individual-user-left flex-container flex-align-center'>
                <Link
                  to={`/${user.username}`}
                  aria-label={`click to move to ${user.username}'s profile`}
                >
                  <div className='profile-picture flex-container flex-align-center'>
                    <img
                      src={userImgURL(user.userImgKey)}
                      alt='user profile'
                      className='circular-image'
                    />
                  </div>
                </Link>
                <div className='userinfo-div height-100 flex-container fg-1 flex-column flex-justify-center'>
                  <Link
                    to={`/${user.username}`}
                    aria-label={`click to move to ${user.username}'s profile`}
                  >
                    <div className='username'>{user.username}</div>
                  </Link>
                  <div className='fullname'>{user.fullname}</div>
                </div>
              </div>
              <div className='button-div'>
                <RemoveTaggedUserButton user={user} post={post} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TaggedUsersDisplay;
