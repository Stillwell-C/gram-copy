import React, { useEffect, useRef, useState } from "react";
import "./headerBar.scss";
import logo from "../../assets/Instagram_logo.png";
import { Link } from "react-router-dom";
import useSearchForUser from "../../hooks/useSearchForUser";
import closeCircle from "../../assets/close-circle-svgrepo-com.svg";
import NavbarSearch from "../NavbarSearch";

const HeaderBar = ({ navbarSearch, notificationsLink }) => {
  return (
    <div className='header-bar-container'>
      <div className='header-bar-left'>
        <Link to='/'>
          <img
            src={logo}
            alt=''
            aria-hidden='true'
            aria-label='move to home screen'
          />
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
