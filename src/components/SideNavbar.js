import React from "react";
import logo from "../assets/Instagram_logo.png";
import squareLogo from "../assets/instagram-svgrepo-com.svg";
import { Link } from "react-router-dom";

const SideNavbar = ({
  homeLink,
  searchLink,
  exploreLink,
  messagesLink,
  notificationsLink,
  createLink,
  profileLink,
  moreLink,
  menuContent,
  displayMenu,
  handleAddPostModal,
  setDisplayMenu,
}) => {
  return (
    <div className='navbar-body'>
      <div className='navbar-top'>
        <div className='navbar-header'>
          <Link to='/'>
            <img
              src={logo}
              alt=''
              aria-hidden='true'
              className='text-logo themeable-icon'
            />
            <img
              src={squareLogo}
              alt=''
              aria-hidden='true'
              className='image-logo themeable-icon'
            />
          </Link>
        </div>
        <div className='navbar-row'>{homeLink}</div>
        <div className='navbar-row'>{searchLink}</div>
        <div className='navbar-row'>{exploreLink}</div>
        <div className='navbar-row'>{messagesLink}</div>
        <div className='navbar-row'>{notificationsLink}</div>
        <div className='navbar-row' onClick={handleAddPostModal}>
          {createLink}
        </div>
        <div className='navbar-row'>{profileLink}</div>
      </div>
      <div className='navbar-bottom'>
        <div
          className='navbar-row'
          onClick={() => setDisplayMenu(!displayMenu)}
        >
          {moreLink}
        </div>
        <div
          id='large-navbar-menu-content'
          className={displayMenu ? "navbar-menu active" : "navbar-menu"}
          aria-hidden={!displayMenu ? "true" : "false"}
        >
          {menuContent}
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
  );
};

export default SideNavbar;
