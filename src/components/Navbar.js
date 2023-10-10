import { useEffect, useRef, useState } from "react";
import { useNavigate, Outlet, useLocation, Link } from "react-router-dom";

import "../scss/navbar.scss";
import styles from "../scss/layout.module.scss";

import home from "../assets/home-2-svgrepo-com.svg";
import search from "../assets/search-svgrepo-com.svg";
import compass from "../assets/compass-svgrepo-com.svg";
import message from "../assets/plane-svgrepo-com.svg";
import heart from "../assets/heart-rounded-svgrepo-com.svg";
import add from "../assets/add-box-svgrepo-com.svg";
import profile from "../assets/Default_pfp.svg";
import menu from "../assets/menu-svgrepo-com.svg";
import moon from "../assets/moon-svgrepo-com.svg";
import sun from "../assets/sun-svgrepo-com.svg";

import CreatePostModal from "./CreatePostModal";
import HeaderBar from "./HeaderBar";
import useAuth from "../hooks/useAuth";
import SideNavbar from "./SideNavbar";
import SideNavbarSearch from "./SideNavbarSearch";
import NavbarSearch from "../features/users/NavbarSearch";
import FooterNavbar from "./FooterNavbar";
import { logout } from "../features/auth/authApiRoutes";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { setError, setErrorRefreshPage } from "../features/error/errorSlice";
import { selectThemeState, setTheme } from "../features/display/displaySlice";
import LogoutButton from "../features/auth/LogoutButton";

const Navbar = () => {
  const [displayPostModal, setDisplayPostModal] = useState(false);
  const [displayMenu, setDisplayMenu] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentTheme = useSelector(selectThemeState);

  const { pathname } = useLocation();

  const { authenticatedUser, username, img } = useAuth();

  let displayNav = true;
  if (
    pathname.match(/\/accounts\/login/i) ||
    pathname.match(/\/accounts\/emailsignup/i)
  ) {
    displayNav = false;
  }

  const handleAddPostModal = () => {
    if (!authenticatedUser) {
      navigate("/accounts/login");
      return;
    }
    setDisplayPostModal(true);
  };

  const userImgURL = `https://res.cloudinary.com/danscxcd2/image/upload/w_90,c_fill/${img}`;

  const scrollUpOnHomeScreen = () => {
    setSearchActive(false);
    if (pathname.match(/^\/$/)) {
      document
        .getElementById("content-outlet")
        .scroll({ top: 0, behavior: "smooth" });
    }
  };

  const homeLink = (
    <Link to='/'>
      <div className='navbar-line' onClick={scrollUpOnHomeScreen}>
        <img src={home} alt='' className='themeable-icon' aria-hidden='true' />
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
        <img
          src={search}
          alt=''
          className='themeable-icon'
          aria-hidden='true'
        />
        <span>Search</span>
      </div>
    </Link>
  );

  const scrollUpOnExploreScreen = () => {
    setSearchActive(false);
    if (pathname.match(/^\/explore$/i)) {
      document
        .getElementById("content-outlet")
        .scroll({ top: 0, behavior: "smooth" });
    }
  };

  const exploreLink = (
    <Link to='/explore'>
      <div className='navbar-line' onClick={scrollUpOnExploreScreen}>
        <img
          src={compass}
          className='themeable-icon'
          alt=''
          aria-hidden='true'
        />
        <span>Explore</span>
      </div>
    </Link>
  );

  const messagesLink = (
    <Link to='/direct/inbox'>
      <div className='navbar-line' onClick={() => setSearchActive(false)}>
        <img
          src={message}
          className='themeable-icon'
          alt=''
          aria-hidden='true'
        />
        <span>Messages</span>
      </div>
    </Link>
  );

  const notificationsLink = (
    <Link to='/notifications'>
      <div className='navbar-line' onClick={() => setSearchActive(false)}>
        <img src={heart} className='themeable-icon' alt='' aria-hidden='true' />
        <span>Notifications</span>
      </div>
    </Link>
  );

  const createLink = (
    <Link to='#'>
      <div className='navbar-line' onClick={() => setSearchActive(false)}>
        <img src={add} className='themeable-icon' alt='' aria-hidden='true' />
        <span>Create</span>
      </div>
    </Link>
  );

  const profileLink = (
    <Link to={authenticatedUser ? `/${username}` : "/accounts/login"}>
      <div className='navbar-line' onClick={() => setSearchActive(false)}>
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
      <div
        className='navbar-line'
        onClick={() => setDisplayMenu((prev) => !prev)}
      >
        <img className='themeable-icon' src={menu} alt='menu icon' />
        <span>More</span>
      </div>
    </Link>
  );

  const menuRef = useRef(null);
  const moreLinkRef = useRef(null);
  const menuRefBtm = useRef(null);
  const moreLinkRefBtm = useRef(null);

  useEffect(() => {
    const closeNavbarMenu = (e) => {
      if (
        !menuRef?.current?.contains(e.target) &&
        !menuRefBtm?.current?.contains(e.target) &&
        !moreLinkRef?.current?.contains(e.target) &&
        !moreLinkRefBtm?.current?.contains(e.target)
      ) {
        setDisplayMenu((prev) => (prev === true ? false : prev));
      }
    };

    document.addEventListener("mousedown", closeNavbarMenu);

    return () => document.removeEventListener("mousedown", closeNavbarMenu);
  }, []);

  const handleChangeTheme = () => {
    if (currentTheme === "theme-light") {
      dispatch(setTheme("theme-dark"));
      localStorage.setItem("theme-setting", "theme-dark");
    } else {
      dispatch(setTheme("theme-light"));
      localStorage.setItem("theme-setting", "theme-light");
    }
  };

  const themeIcon = currentTheme === "theme-light" ? moon : sun;

  const menuContent = (
    <div>
      <div className='menu-line'>
        <button
          aria-label='click to change to dark mode'
          onClick={handleChangeTheme}
        >
          <span>Change appearance</span>
          <img
            src={themeIcon}
            alt=''
            className='themeable-icon'
            aria-hidden='true'
          />
        </button>
      </div>
      <div className='menu-line'>
        {authenticatedUser ? (
          <LogoutButton />
        ) : (
          <Link to='/accounts/login'>Log in</Link>
        )}
      </div>
    </div>
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
      {displayNav && (
        <HeaderBar
          navbarSearch={navbarSearch}
          notificationsLink={notificationsLink}
          setSearchActive={setSearchActive}
        />
      )}
      {displayNav && (
        <nav
          className={`navbar-container-side ${
            searchActive ? "searchActive" : ""
          }`}
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
            ref={{ menuRef, moreLinkRef }}
            displayMenu={displayMenu}
            handleAddPostModal={handleAddPostModal}
            setDisplayMenu={setDisplayMenu}
          />
          <SideNavbarSearch navbarSearch={navbarSearch} />
        </nav>
      )}
      <div className={styles.outlet} id='content-outlet'>
        <Outlet />
      </div>
      {displayNav && (
        <FooterNavbar
          homeLink={homeLink}
          searchLink={searchLink}
          exploreLink={exploreLink}
          messagesLink={messagesLink}
          createLink={createLink}
          profileLink={profileLink}
          moreLink={moreLink}
          menuContent={menuContent}
          ref={{ menuRefBtm, moreLinkRefBtm }}
          displayMenu={displayMenu}
          handleAddPostModal={handleAddPostModal}
          setDisplayMenu={setDisplayMenu}
        />
      )}
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
