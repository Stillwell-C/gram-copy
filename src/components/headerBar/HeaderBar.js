import React, { useEffect, useRef, useState } from "react";
import "./headerBar.scss";
import logo from "../../assets/Instagram_logo.png";
import { Link } from "react-router-dom";
import useSearchForUser from "../../hooks/useSearchForUser";
import closeCircle from "../../assets/close-circle-svgrepo-com.svg";

const HeaderBar = React.forwardRef(
  (
    {
      handleSearch,
      searchActive,
      setSearchActive,
      searchQuery,
      setSearchQuery,
      setSearchResults,
      searchResults,
    },
    ref
  ) => {
    const handleCloseAndClear = () => {
      setSearchQuery("");
      setSearchResults([]);
      setSearchActive(false);
    };

    return (
      <div className='header-bar-container'>
        <div className='header-bar-left'>
          <Link to='/'>
            <img
              src={logo}
              alt=''
              aria-hidden='true'
              aria-label='move to home screen'
            />
          </Link>
        </div>
        <div className='header-bar-right'>
          <div className='search-input-div' ref={ref}>
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
                <img src={closeCircle} alt='' aria-hidden='true' />
              </button>
            </div>
            <div
              className={`search-results-container ${searchActive && "active"}`}
              ref={ref}
            >
              {searchResults?.length > 0 &&
                searchResults.map((doc) => (
                  <Link
                    key={doc.uid}
                    to={`/${doc.username}`}
                    aria-label={`move to ${doc.username}'s profile`}
                  >
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
  }
);

export default HeaderBar;
