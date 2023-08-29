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
}) => {
  return (
    <div className='navbar-body'>
      <div className='navbar-top'>
        <div className='navbar-header'>
          <Link to='/'>
            <img src={logo} alt='' aria-hidden='true' className='text-logo' />
            <img src={squareLogo} alt='Instagram logo' className='image-logo' />
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
        <div className='navbar-row'>{moreLink}</div>
        <div
          id='large-navbar-menu-content'
          className={displayMenu ? "navbar-menu active" : "navbar-menu"}
          aria-hidden={!displayMenu ? "true" : "false"}
        >
          {menuContent}
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;
