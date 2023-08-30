import React from "react";

const FooterNavbar = ({
  homeLink,
  exploreLink,
  messagesLink,
  createLink,
  profileLink,
  moreLink,
  menuContent,
  displayMenu,
  handleAddPostModal,
  setDisplayMenu,
}) => {
  return (
    <nav className='navbar-container-bottom' aria-label='bottom navigation bar'>
      <div className='navbar-row'>{homeLink}</div>
      <div className='navbar-row'>{exploreLink}</div>
      <div className='navbar-row' onClick={handleAddPostModal}>
        {createLink}
      </div>
      <div className='navbar-row'>{messagesLink}</div>
      <div className='navbar-row'>{profileLink}</div>
      <div className='navbar-row'>{moreLink}</div>
      <div
        className='navbar-menu-container'
        id='small-navbar-menu-content'
        aria-hidden={!displayMenu ? "true" : "false"}
      >
        <div className={displayMenu ? "navbar-menu active" : "navbar-menu"}>
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
    </nav>
  );
};

export default FooterNavbar;
