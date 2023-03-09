import React, { useEffect, useRef, useState } from "react";
import "./headerBar.scss";
import logo from "../../assets/Instagram_logo.png";
import { Link } from "react-router-dom";
import useSearchForUser from "../../hooks/useSearchForUser";
import closeCircle from "../../assets/close-circle-svgrepo-com.svg";

const HeaderBar = () => {
  const userSearch = useSearchForUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchActive, setSearchActive] = useState(false);

  const headerbarSearchRef = useRef();
  const headerbarResultsRef = useRef();

  const handleCloseAndClear = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchActive(false);
  };

  const handleSearch = async (searchInput) => {
    setSearchQuery(searchInput);
    if (searchInput > 1) {
      setSearchResults([]);
      return;
    }
    const searchResults = await userSearch(searchInput);
    setSearchResults(searchResults);
  };

  useEffect(() => {
    let handler = (e) => {
      if (
        headerbarSearchRef.current.contains(e.target) ||
        headerbarResultsRef.current.contains(e.target)
      ) {
        return;
      }
      setSearchActive(false);
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <div className='header-bar-container'>
      <div className='header-bar-left'>
        <Link to='/'>
          <img src={logo} alt='Instagram logo' />
        </Link>
      </div>
      <div className='header-bar-right'>
        <div className='search-input-div' ref={headerbarSearchRef}>
          <label
            aria-label='input username to search users'
            htmlFor='username-search-input'
          >
            <input
              type='text'
              autoComplete='off'
              name='username-search-input'
              id='username-search-input'
              placeholder='User Search'
              spellCheck='false'
              maxLength='30'
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onClick={() => setSearchActive(true)}
            />
          </label>
          <div className='input-btn-div'>
            <button
              aria-label='clear the search box'
              onClick={handleCloseAndClear}
            >
              <img src={closeCircle} alt='X icon' />
            </button>
          </div>
          <div
            className={`search-results-container ${searchActive && "active"}`}
            ref={headerbarResultsRef}
          >
            {searchResults.length > 0 &&
              searchResults.map((doc) => (
                <Link key={doc.uid} to={`/${doc.username}`}>
                  <div className='search-result'>
                    <div className='profile-picture'>
                      <img src={doc.userImgURL} alt='user profile' />
                    </div>
                    <div className='userinfo-div'>
                      <div className='username'>{doc.username}</div>
                      <div className='fullname'>{doc.fullname}</div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;
