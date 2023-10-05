import React from "react";

const FooterNavbar = React.forwardRef(
  (
    {
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
    },
    { moreLinkRefBtm, menuRefBtm }
  ) => {
    return (
      <nav
        className='navbar-container-bottom'
        aria-label='bottom navigation bar'
      >
        <div className='navbar-row'>{homeLink}</div>
        <div className='navbar-row'>{exploreLink}</div>
        <div className='navbar-row' onClick={handleAddPostModal}>
          {createLink}
        </div>
        <div className='navbar-row'>{messagesLink}</div>
        <div className='navbar-row'>{profileLink}</div>
        <div className='navbar-row' ref={moreLinkRefBtm}>
          {moreLink}
        </div>
        <div
          className='navbar-menu-container'
          id='small-navbar-menu-content'
          aria-hidden={!displayMenu ? "true" : "false"}
          ref={menuRefBtm}
        >
          <div className={displayMenu ? "navbar-menu active" : "navbar-menu"}>
            {menuContent}
          </div>
        </div>
      </nav>
    );
  }
);

export default FooterNavbar;
