import { useEffect, useRef, useState } from "react";
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
import moon from "../../assets/moon-02-svgrepo-com.svg";

import { Link } from "react-router-dom";

import HeaderBar from "./../headerBar/HeaderBar";
import useAuth from "../../hooks/useAuth";
import { useSendLogoutMutation } from "../../features/auth/authApiSlice";
import SideNavbar from "../SideNavbar";
import SideNavbarSearch from "../SideNavbarSearch";
import NavbarSearch from "../NavbarSearch";
import FooterNavbar from "../FooterNavbar";

const Navbar = () => {
  const [displayPostModal, setDisplayPostModal] = useState(false);
  const [displayMenu, setDisplayMenu] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const { authenticatedUser, username, img } = useAuth();
  const navbarRef = useRef();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) window.location.reload();
  }, [isSuccess]);

  useEffect(() => {
    if (isError) window.location.reload();
  }, [isError]);

  const handleAddPostModal = () => {
    if (!authenticatedUser) {
      navigate("/accounts/login");
      return;
    }
    setDisplayPostModal(true);
  };

  const handleLogout = async () => {
    if (authenticatedUser) {
      sendLogout();
    }
  };

  const userImgURL = `https://res.cloudinary.com/danscxcd2/image/upload/w_150,c_fill/${img}`;

  const homeLink = (
    <Link to='/'>
      <div className='navbar-line'>
        <img src={home} alt='' aria-hidden='true' />
        <span>Home</span>
      </div>
    </Link>
  );

  const searchLink = (
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
  );

  const exploreLink = (
    <Link to='#'>
      <div className='navbar-line'>
        <img src={compass} alt='' aria-hidden='true' />
        <span>Explore</span>
      </div>
    </Link>
  );

  const messagesLink = (
    <Link to='/direct/inbox'>
      <div className='navbar-line'>
        <img src={message} alt='' aria-hidden='true' />
        <span>Messages</span>
      </div>
    </Link>
  );

  const notificationsLink = (
    <Link to='#'>
      <div className='navbar-line'>
        <img src={heart} alt='' aria-hidden='true' />
        <span>Notifications</span>
      </div>
    </Link>
  );

  const createLink = (
    <Link to='#'>
      <div className='navbar-line'>
        <img src={add} alt='' aria-hidden='true' />
        <span>Create</span>
      </div>
    </Link>
  );

  const profileLink = (
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
  );

  const moreLink = (
    <Link
      to='#'
      aria-label='click to see more options'
      aria-expanded={displayMenu ? "true" : "false"}
      aria-controls='large-navbar-menu-content'
    >
      <div className='navbar-line' onClick={() => setDisplayMenu(!displayMenu)}>
        <img src={menu} alt='menu icon' />
        <span>More</span>
      </div>
    </Link>
  );

  const menuContent = (
    <>
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
    </>
  );

  const navbarSearch = (
    <NavbarSearch
      searchActive={searchActive}
      setSearchActive={setSearchActive}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    />
  );

  return (
    <>
      <HeaderBar navbarSearch={navbarSearch} />
      <FooterNavbar
        homeLink={homeLink}
        searchLink={searchLink}
        exploreLink={exploreLink}
        messagesLink={messagesLink}
        notificationsLink={notificationsLink}
        createLink={createLink}
        profileLink={profileLink}
        moreLink={moreLink}
        menuContent={menuContent}
        displayMenu={displayMenu}
        handleAddPostModal={handleAddPostModal}
        setDisplayMenu={setDisplayMenu}
      />
      <nav
        className={`navbar-container-side ${
          searchActive ? "searchActive" : ""
        }`}
        ref={navbarRef}
        aria-label='main navigation bar'
      >
        <SideNavbar
          homeLink={homeLink}
          searchLink={searchLink}
          exploreLink={exploreLink}
          messagesLink={messagesLink}
          notificationsLink={notificationsLink}
          createLink={createLink}
          profileLink={profileLink}
          moreLink={moreLink}
          menuContent={menuContent}
          displayMenu={displayMenu}
          handleAddPostModal={handleAddPostModal}
          setDisplayMenu={setDisplayMenu}
        />
        <SideNavbarSearch navbarSearch={navbarSearch} />
      </nav>
      {/* <div
        className={
          displayMenu
            ? "navbar-menu-close-field active"
            : "navbar-menu-close-field"
        }
        onClick={() => setDisplayMenu(false)}
      ></div> */}
      <div
        className={
          searchActive
            ? "navbar-search-close-field active"
            : "navbar-search-close-field"
        }
        onClick={() => setSearchActive(false)}
      ></div>
      {displayPostModal && (
        <CreatePostModal setDisplayPostModal={setDisplayPostModal} />
      )}
    </>
  );
};

export default Navbar;
