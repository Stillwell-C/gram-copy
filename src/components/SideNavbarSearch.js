import React from "react";
import { FadeLoader } from "react-spinners";
import closeCircle from "../assets/close-circle-svgrepo-com.svg";
import NavbarSearch from "./NavbarSearch";

const SideNavbarSearch = ({ navbarSearch }) => {
  return (
    <div className='search-body'>
      <div className='search-top'>
        <div className='search-header-div'>
          <h2>Search</h2>
        </div>
        {/* <div className='search-input-div'>
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
            />
          </label>
          <div className='input-btn-div'>
            <button
              aria-label='clear the search box'
              onClick={handleClearSearch}
            >
              <img src={closeCircle} alt='' aria-hidden='true' />
            </button>
          </div>
        </div> */}
      </div>
      {navbarSearch}
      {/* <div className='search-bottom'>
        {searchQuery.length > 0 && !searchIsLoading && searchResults}
        {searchIsLoading && searchIsFetching && (
          <div className='loading-div'>
            <FadeLoader color='#333' cssOverride={{ scale: "0.5" }} />
          </div>
        )}
      </div> */}
    </div>
  );
};

export default SideNavbarSearch;
