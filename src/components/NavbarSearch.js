import React, { useCallback, useRef, useState } from "react";
import { useInfiniteQuery } from "react-query";
import { getUserSearch } from "../features/users/usersApiRoutes";
import SearchResult from "./SearchResult";
import { FadeLoader } from "react-spinners";

import closeCircle from "../assets/close-circle-svgrepo-com.svg";

const NavbarSearch = ({
  searchActive,
  setSearchActive,
  searchQuery,
  setSearchQuery,
}) => {
  // const [searchQuery, setSearchQuery] = useState("");

  const {
    data: searchData,
    isLoading: searchIsLoading,
    isError: searchIsError,
    error: searchError,
    isFetching: searchIsFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["searchData", searchQuery],
    queryFn: ({ pageParam = 1 }) =>
      getUserSearch({ pageParam, limit: 10, searchQuery }),
    refetchOnWindowFocus: false,
    enabled: searchQuery.length > 0,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.page < lastPage.totalPages) return lastPage.page + 1;
      return false;
    },
  });

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const observer = useRef();
  const lastResultRef = useCallback(
    (post) => {
      if (searchIsFetching || searchIsLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (post) observer.current.observe(post);
    },
    [searchIsFetching, searchIsLoading, hasNextPage]
  );

  const flattenedSearchData = searchData?.pages?.reduce((acc, page) => {
    if (!page?.users?.length) return acc;

    return [...acc, ...page?.users];
  }, []);

  const searchResults = flattenedSearchData?.map((user, i) => {
    if (flattenedSearchData.length === i + 1) {
      return (
        <SearchResult
          ref={lastResultRef}
          key={user._id}
          user={user}
          setSearchActive={setSearchActive}
        />
      );
    }
    return (
      <SearchResult
        key={user._id}
        user={user}
        setSearchActive={setSearchActive}
      />
    );
  });

  return (
    <div className='navbar-search-container'>
      <div className='search-container-top'>
        <div className='search-input'>
          <label
            aria-label='input username to search users'
            htmlFor='username-search-input-header'
          >
            <input
              type='text'
              autoComplete='off'
              name='username-search-input-header'
              id='username-search-input-header'
              placeholder='User Search'
              spellCheck='false'
              maxLength='30'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={() => setSearchActive(true)}
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
        </div>
      </div>
      <div className={`search-results-container ${searchActive && "active"}`}>
        {searchQuery.length > 0 && !searchIsLoading && searchResults}
        {searchIsLoading && searchIsFetching && (
          <div className='loading-div'>
            <FadeLoader color='#333' cssOverride={{ scale: "0.5" }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default NavbarSearch;
