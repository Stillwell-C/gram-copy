import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.scss";
import home from "../../assets/home-2-svgrepo-com.svg";
import search from "../../assets/search-svgrepo-com.svg";
import compass from "../../assets/compass-svgrepo-com.svg";
import message from "../../assets/plane-svgrepo-com.svg";
import heart from "../../assets/heart-rounded-svgrepo-com.svg";
import add from "../../assets/add-box-svgrepo-com.svg";
import profile from "../../assets/Default_pfp.svg";
import menu from "../../assets/menu-svgrepo-com.svg";
import CreatePostModal from "../createPostModal/CreatePostModal";
import logo from "../../assets/Instagram_logo.png";
import moon from "../../assets/moon-02-svgrepo-com.svg";
import squareLogo from "../../assets/instagram-svgrepo-com.svg";
import closeCircle from "../../assets/close-circle-svgrepo-com.svg";

import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import useSearchForUser from "../../hooks/useSearchForUser";

import HeaderBar from "./../headerBar/HeaderBar";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const [displayPostModal, setDisplayPostModal] = useState(false);
  const [displayMenu, setDisplayMenu] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const userSearch = useSearchForUser();
  const { authenticatedUser, username, img } = useAuth();
  const navbarRef = useRef();
  const headerbarRef = useRef();

  const userImgURL = `https://res.cloudinary.com/danscxcd2/image/upload/w_150,c_fill/${img}`;

  const handleAddPostModal = () => {
    if (!authenticatedUser) {
      navigate("/accounts/login");
      return;
    }
    setDisplayPostModal(true);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
    // dispatch({
    //   type: "LOGOUT",
    // });
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

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    console.log("called");
  };

  useEffect(() => {
    let handler = (e) => {
      if (
        navbarRef.current.contains(e.target) ||
        headerbarRef.current.contains(e.target)
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
    <>
      <HeaderBar
        handleSearch={handleSearch}
        searchActive={searchActive}
        setSearchActive={setSearchActive}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setSearchResults={setSearchResults}
        searchResults={searchResults}
        ref={headerbarRef}
        aria-label='top navigation bar'
      />
      <nav
        className='navbar-container-bottom'
        aria-label='bottom navigation bar'
      >
        <div className='navbar-row'>
          <Link to='/' aria-label='move to home screen'>
            <div className='navbar-line'>
              <img src={home} alt='' aria-hidden='true' />
            </div>
          </Link>
        </div>
        <div className='navbar-row'>
          <Link to='/direct/inbox' aria-label='move to home screen'>
            <div className='navbar-line'>
              <img src={message} alt='' aria-hidden='true' />
            </div>
          </Link>
        </div>
        <div className='navbar-row'>
          <Link to='#' aria-label='see notifications'>
            <div className='navbar-line'>
              <img src={heart} alt='' aria-hidden='true' />
            </div>
          </Link>
        </div>
        <div className='navbar-row' onClick={handleAddPostModal}>
          <Link to='#' aria-label='create new post'>
            <div className='navbar-line'>
              <img src={add} alt='' aria-hidden='true' />
            </div>
          </Link>
        </div>
        <div className='navbar-row'>
          <Link
            to={authenticatedUser ? `/${username}` : "/accounts/login"}
            aria-label={`${
              authenticatedUser ? "move to profile" : "move to login page"
            }`}
          >
            <div className='navbar-line'>
              <img
                src={authenticatedUser ? userImgURL : profile}
                className={authenticatedUser ? "userProfileImg" : ""}
                alt=''
                aria-hidden='true'
              />
            </div>
          </Link>
        </div>
        <div className='navbar-row'>
          <Link
            to='#'
            aria-label='click to see more options'
            aria-expanded={displayMenu ? "true" : "false"}
            aria-controls='small-navbar-menu-content'
          >
            <div
              className='navbar-line'
              onClick={() => setDisplayMenu(!displayMenu)}
            >
              <img src={menu} alt='' aria-hidden='true' />
            </div>
          </Link>
        </div>
        <div
          className='navbar-menu-container'
          id='small-navbar-menu-content'
          aria-hidden={!displayMenu ? "true" : "false"}
        >
          <div className={displayMenu ? "navbar-menu active" : "navbar-menu"}>
            <div className='menu-line'>
              <button aria-label='click to change to dark mode'>
                <span>Change appearance</span>
                <img src={moon} alt='' aria-hidden='true' />
              </button>
            </div>
            <div className='menu-line'>
              {authenticatedUser ? (
                <button onClick={handleLogout}>Log out</button>
              ) : (
                <Link to='/accounts/login'>Log in</Link>
              )}
            </div>
          </div>
          <div
            className={
              displayMenu
                ? "navbar-menu-close-field active"
                : "navbar-menu-close-field"
            }
            onClick={() => setDisplayMenu(false)}
          ></div>
        </div>
      </nav>
      <nav
        className={`navbar-container-side ${searchActive && "searchActive"}`}
        ref={navbarRef}
        aria-label='main navigation bar'
      >
        <div className='navbar-body'>
          <div className='navbar-top'>
            <div className='navbar-header'>
              <Link to='/'>
                <img
                  src={logo}
                  alt=''
                  aria-hidden='true'
                  className='text-logo'
                />
                <img
                  src={squareLogo}
                  alt='Instagram logo'
                  className='image-logo'
                />
              </Link>
            </div>
            <div className='navbar-row'>
              <Link to='/'>
                <div className='navbar-line'>
                  <img src={home} alt='' aria-hidden='true' />
                  <span>Home</span>
                </div>
              </Link>
            </div>
            <div className='navbar-row'>
              <Link to='#'>
                <div
                  className='navbar-line'
                  onClick={() => {
                    setSearchActive(!searchActive);
                  }}
                >
                  <img src={search} alt='' aria-hidden='true' />
                  <span>Search</span>
                </div>
              </Link>
            </div>
            <div className='navbar-row'>
              <Link to='#'>
                <div className='navbar-line'>
                  <img src={compass} alt='' aria-hidden='true' />
                  <span>Explore</span>
                </div>
              </Link>
            </div>
            <div className='navbar-row'>
              <Link to='/direct/inbox'>
                <div className='navbar-line'>
                  <img src={message} alt='' aria-hidden='true' />
                  <span>Messages</span>
                </div>
              </Link>
            </div>
            <div className='navbar-row'>
              <Link to='#'>
                <div className='navbar-line'>
                  <img src={heart} alt='' aria-hidden='true' />
                  <span>Notifications</span>
                </div>
              </Link>
            </div>
            <div className='navbar-row' onClick={handleAddPostModal}>
              <Link to='#'>
                <div className='navbar-line'>
                  <img src={add} alt='' aria-hidden='true' />
                  <span>Create</span>
                </div>
              </Link>
            </div>
            <div className='navbar-row'>
              <Link to={authenticatedUser ? `/${username}` : "/accounts/login"}>
                <div className='navbar-line'>
                  <img
                    src={authenticatedUser ? userImgURL : profile}
                    className={authenticatedUser ? "userProfileImg" : ""}
                    alt=''
                    aria-hidden='true'
                  />
                  <span>Profile</span>
                </div>
              </Link>
            </div>
          </div>
          <div className='navbar-bottom'>
            <div className='navbar-row'>
              <Link
                to='#'
                aria-label='click to see more options'
                aria-expanded={displayMenu ? "true" : "false"}
                aria-controls='large-navbar-menu-content'
              >
                <div
                  className='navbar-line'
                  onClick={() => setDisplayMenu(!displayMenu)}
                >
                  <img src={menu} alt='menu icon' />
                  <span>More</span>
                </div>
              </Link>
            </div>
            <div
              id='large-navbar-menu-content'
              className={displayMenu ? "navbar-menu active" : "navbar-menu"}
              aria-hidden={!displayMenu ? "true" : "false"}
            >
              <div className='menu-line'>
                <button aria-label='click to change to dark mode'>
                  <span>Change appearance</span>
                  <img src={moon} alt='' aria-hidden='true' />
                </button>
              </div>
              <div className='menu-line'>
                {authenticatedUser ? (
                  <button onClick={handleLogout}>Log out</button>
                ) : (
                  <Link to='/accounts/login'>Log in</Link>
                )}
              </div>
            </div>
            <div
              className={
                displayMenu
                  ? "navbar-menu-close-field active"
                  : "navbar-menu-close-field"
              }
              onClick={() => setDisplayMenu(false)}
            ></div>
          </div>
        </div>
        <div className='search-body'>
          <div className='search-top'>
            <div className='search-header-div'>
              <h2>Search</h2>
            </div>
            <div className='search-input-div'>
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
            </div>
          </div>
          <div className='search-bottom'>
            {searchResults.length > 0 &&
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
      </nav>
      {displayPostModal && (
        <CreatePostModal setDisplayPostModal={setDisplayPostModal} />
      )}
    </>
  );
};

export default Navbar;
