import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { getUsersFromArr } from "../features/users/usersApiRoutes";
import { FadeLoader } from "react-spinners";
import RemoveTaggedUserButton from "./RemoveTaggedUserButton";

const TaggedUsersDisplay = ({
  post,
  setShowTagUsersModal,
  setShowTaggedUsersDisplay,
}) => {
  const userImgURL = (imgKey) =>
    `https://res.cloudinary.com/danscxcd2/image/upload/w_150,c_fill/${imgKey}`;

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

  return (
    <div className='check-tagged-users-body'>
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
          <h2>Tagged Users</h2>
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
      <div className='modal-content'>
        <div className='user-list'>
          {isLoading && (
            <div className='loading-div'>
              <FadeLoader color='#333' cssOverride={{ scale: "0.5" }} />
            </div>
          )}
          {!isLoading &&
            taggedUsers?.map((user) => (
              <div className='individual-user' key={user._id}>
                <div className='individual-user-left'>
                  <Link
                    to={`/${user.username}`}
                    aria-label={`click to move to ${user.username}'s profile`}
                  >
                    <div className='profile-picture'>
                      <img
                        src={userImgURL(user.userImgKey)}
                        alt='user profile'
                      />
                    </div>
                  </Link>
                  <div className='userinfo-div'>
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
    </div>
  );
};

export default TaggedUsersDisplay;
