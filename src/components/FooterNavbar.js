import React from "react";
import useAuth from "../hooks/useAuth";

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
    },
    { moreLinkRefBtm, menuRefBtm }
  ) => {
    const { authenticatedUser } = useAuth();

    const menuPosition = authenticatedUser ? "-5.3rem" : "-7.8rem";

    return (
      <nav
        className='navbar-container-bottom'
        aria-label='bottom navigation bar'
      >
        <div className='navbar-row bottom-home-link'>{homeLink}</div>
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
          <div
            style={{ top: menuPosition }}
            className={displayMenu ? "navbar-menu active" : "navbar-menu"}
          >
            {menuContent}
          </div>
        </div>
      </nav>
    );
  }
);

export default FooterNavbar;
