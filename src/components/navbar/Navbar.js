import { useContext, useState } from "react";
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

const Navbar = () => {
  const [displayPostModal, setDisplayPostModal] = useState(false);
  const [displayMenu, setDisplayMenu] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const { currentUser } = useContext(AuthContext);

  const handleAddPostModal = () => {
    if (!currentUser) {
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
    console.log(searchInput);
    if (searchInput > 1) {
      setSearchResults([]);
      return;
    }
    try {
      const usernameQuery = await getDocs(
        query(collection(db, "userInfo"), where("username", "==", searchInput))
      );
      const fullnameQuery = await getDocs(
        query(collection(db, "userInfo"), where("fullname", "==", searchInput))
      );
      const usernameArr = usernameQuery.docs;
      const fullnameArr = fullnameQuery.docs;
      const combinedArr = [];
      for (let result of usernameArr) {
        combinedArr.push(result.data());
      }
      for (let result of fullnameArr) {
        combinedArr.push(result.data());
      }
      const uniqueArrFilter = (combinedArr, track = new Set()) =>
        combinedArr.filter(({ uid }) =>
          track.has(uid) ? false : track.add(uid)
        );
      setSearchResults(uniqueArrFilter(combinedArr));
      console.log(uniqueArrFilter(combinedArr));
    } catch (err) {
      console.log(err.code);
    }
  };

  return (
    <>
      <nav className={`navbar-container ${searchActive && "searchActive"}`}>
        <div className='navbar-body'>
          <div className='navbar-top'>
            <div className='navbar-header'>
              <Link to='/'>
                <img
                  src={searchActive ? squareLogo : logo}
                  alt='Instagram logo'
                />
              </Link>
            </div>
            <div className='navbar-row'>
              <Link to='/'>
                <div className='navbar-line'>
                  <img src={home} alt='home icon' />
                  <span>Home</span>
                </div>
              </Link>
            </div>
            <div className='navbar-row'>
              <div
                className='navbar-line'
                onClick={() => {
                  setSearchActive(!searchActive);
                }}
              >
                <img src={search} alt='search icon' />
                <span>Search</span>
              </div>
            </div>
            <div className='navbar-row'>
              <div className='navbar-line'>
                <img src={compass} alt='explore icon' />
                <span>Explore</span>
              </div>
            </div>
            <div className='navbar-row'>
              <Link to='/direct/inbox'>
                <div className='navbar-line'>
                  <img src={message} alt='message icon' />
                  <span>Messages</span>
                </div>
              </Link>
            </div>
            <div className='navbar-row'>
              <div className='navbar-line'>
                <img src={heart} alt='notifications icon' />
                <span>Notifications</span>
              </div>
            </div>
            <div className='navbar-row' onClick={handleAddPostModal}>
              <div className='navbar-line'>
                <img src={add} alt='add post icon' />
                <span>Create</span>
              </div>
            </div>
            <div className='navbar-row'>
              <Link
                to={
                  currentUser
                    ? `/${currentUser.displayName}`
                    : "/accounts/login"
                }
              >
                <div className='navbar-line'>
                  <img src={profile} alt='profile icon' />
                  <span>Profile</span>
                </div>
              </Link>
            </div>
          </div>
          <div className='navbar-bottom'>
            <div className={displayMenu ? "navbar-menu active" : "navbar-menu"}>
              <div className='menu-line'>
                <span>Change appearance</span>
                <img src={moon} alt='moon icon' />
              </div>
              {currentUser ? (
                <div className='menu-line' onClick={handleLogout}>
                  <span>Log out</span>
                </div>
              ) : (
                <div className='menu-line'>
                  <Link to='/accounts/login'>
                    <span>Log in</span>
                  </Link>
                </div>
              )}
            </div>
            <div
              className={
                displayMenu
                  ? "navbar-menu-close-field active"
                  : "navbar-menu-close-field"
              }
              onClick={() => setDisplayMenu(false)}
            ></div>
            <div className='navbar-row'>
              <div
                className='navbar-line'
                onClick={() => setDisplayMenu(!displayMenu)}
              >
                <img src={menu} alt='menu icon' />
                <span>Menu</span>
              </div>
            </div>
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
                  onClick={() => setSearchQuery("")}
                >
                  <img src={closeCircle} alt='X icon' />
                </button>
              </div>
            </div>
          </div>
          <div className='search-bottom'>
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
      </nav>
      {displayPostModal && (
        <CreatePostModal setDisplayPostModal={setDisplayPostModal} />
      )}
    </>
  );
};

export default Navbar;
