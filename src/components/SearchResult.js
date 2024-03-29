import React from "react";
import { Link, useNavigate } from "react-router-dom";

const SearchResult = React.forwardRef(({ user, setSearchActive }, ref) => {
  const navigate = useNavigate();

  const userImgURL = (imgKey) =>
    `https://res.cloudinary.com/danscxcd2/image/upload/w_150,c_fill/${imgKey}`;

  const handleClick = () => {
    setSearchActive(false);
    navigate(`/${user.username}`);
  };

  const resultBody = (
    <div className='search-result'>
      <div className='profile-picture'>
        <img src={userImgURL(user.userImgKey)} alt='user profile' />
      </div>
      <div className='userinfo-div'>
        <div className='username'>{user.username}</div>
        <div className='fullname'>{user.fullname}</div>
      </div>
    </div>
  );

  return ref ? (
    <Link
      to={`/${user.username}`}
      aria-label={`move to ${user.username}'s profile`}
      ref={ref}
      onClick={handleClick}
    >
      {resultBody}
    </Link>
  ) : (
    <Link
      key={user._id}
      to={`/${user.username}`}
      aria-label={`move to ${user.username}'s profile`}
      onClick={handleClick}
    >
      {resultBody}
    </Link>
  );
});

export default SearchResult;
