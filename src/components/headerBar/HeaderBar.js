import React from "react";
import "./headerBar.scss";
import logo from "../../assets/Instagram_logo.png";
import squareLogo from "../../assets/instagram-svgrepo-com.svg";
import { Link } from "react-router-dom";

const HeaderBar = ({ navbarSearch, notificationsLink }) => {
  return (
    <div className='header-bar-container'>
      <div className='header-bar-left'>
        <Link to='/'>
          <picture>
            <source srcSet={logo} media='(min-width:648px)' />
            <source srcSet={squareLogo} media='(max-width:647px)' />
            <img
              src={logo}
              alt=''
              aria-hidden='true'
              aria-label='move to home screen'
            />
          </picture>
        </Link>
      </div>
      <div className='header-bar-right'>
        {navbarSearch}
        <div className='navbar-row'>{notificationsLink}</div>
      </div>
    </div>
  );
};

export default HeaderBar;
