import React, { useCallback, useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "react-query";
import { useDispatch } from "react-redux";
import { FadeLoader } from "react-spinners";

import { getUserSearch } from "../users/usersApiRoutes";
import TaggedUserSearchResult from "./TaggedUserSearchResult";
import { setError, setErrorRefreshPage } from "../error/errorSlice";

const TagUsersSearch = ({
  setShowTagUsersModal,
  setShowTaggedUsersDisplay,
  post,
}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();
  const searchBarRef = useRef();

  const {
    data: searchData,
    isLoading: searchIsLoading,
    isError: searchIsError,
    error: searchError,
    isFetching: searchIsFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["tagUserSearch", post._id, searchQuery],
    queryFn: ({ pageParam = 1 }) =>
      getUserSearch({ pageParam, limit: 10, searchQuery }),
    refetchOnWindowFocus: false,
    enabled: searchQuery.length > 0,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.page < lastPage.totalPages) return lastPage.page + 1;
      return false;
    },
  });

  useEffect(() => {
    if (searchIsError) {
      if (searchError?.response?.status === 400) return;
      dispatch(setError(true));
      dispatch(setErrorRefreshPage(false));
    }
  }, [searchIsError]);

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
    if (!page?.users.length) return acc;

    return [...acc, ...page?.users];
  }, []);

  let filteredSearchData;
  if (post?.taggedUsers) {
    filteredSearchData = flattenedSearchData?.filter(
      (user) => !post?.taggedUsers?.includes(user?._id)
    );
  } else {
    filteredSearchData = flattenedSearchData;
  }

  const searchResults = filteredSearchData?.map((user, i) => {
    if (filteredSearchData.length === i + 1) {
      return (
        <TaggedUserSearchResult
          ref={lastResultRef}
          key={user._id}
          user={user}
          post={post}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      );
    }
    return (
      <TaggedUserSearchResult
        key={user._id}
        user={user}
        post={post}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
    );
  });

  useEffect(() => searchBarRef.current.focus(), []);

  return (
    <div
      className='tag-users-modal-body'
      role='dialog'
      aria-labelledby='dialog-header'
    >
      <div className='modal-header'>
        <div
          style={{ display: selectedUser ? "none" : "flex" }}
          className='header-btn-div left'
        >
          <button
            aria-label={`click to see currently tagged users`}
            onClick={() => setShowTaggedUsersDisplay(true)}
            type='button'
          >
            Tagged users
          </button>
        </div>
        <div
          style={{ display: selectedUser ? "flex" : "none" }}
          className='header-btn-div left'
        >
          <button
            aria-label={`click to close and not tag the user ${selectedUser?.username} in this image`}
            onClick={() => setSelectedUser(null)}
          >
            Cancel
          </button>
        </div>
        <div className='header-text-div'>
          <h2 id='dialog-header'>Tag User</h2>
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
      <div className='user-search width-100'>
        <label
          aria-label='search for users to tag in this image'
          htmlFor='username-search'
        >
          <input
            type='text'
            autoComplete='off'
            name='username-search'
            id='username-search'
            placeholder='Username Search'
            className='width-100'
            spellCheck='false'
            maxLength='30'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            ref={searchBarRef}
          />
        </label>
      </div>
      <div className='search-results flex-container flex-column width-100'>
        {searchResults}
        {(searchIsLoading || searchIsFetching) && (
          <div className='loading-div'>
            <FadeLoader color='#333' cssOverride={{ scale: "0.5" }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TagUsersSearch;
