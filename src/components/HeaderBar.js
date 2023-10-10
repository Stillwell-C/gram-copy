import React from "react";
import { Link } from "react-router-dom";

import logo from "../assets/Instagram_logo.png";
import squareLogo from "../assets/instagram-svgrepo-com.svg";

const HeaderBar = ({ navbarSearch, notificationsLink, setSearchActive }) => {
  return (
    <header className='header-bar-container fg-1'>
      <div
        className='header-bar-left height-100 flex-container flex-align-center'
        onClick={() => setSearchActive(false)}
      >
        <Link to='/' aria-label='move to home screen'>
          <picture>
            <source srcSet={logo} media='(min-width:648px)' />
            <source srcSet={squareLogo} media='(max-width:647px)' />
            <img
              src={logo}
              alt=''
              aria-hidden='true'
              className='themeable-icon'
            />
          </picture>
        </Link>
      </div>
      <div className='header-bar-right height-100 flex-container flex-align-center'>
        {navbarSearch}
        <div className='navbar-row flex-container flex-align-center flex-justify-start'>
          {notificationsLink}
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
