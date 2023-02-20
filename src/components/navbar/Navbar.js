import { useContext, useState } from "react";
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
import logo from "../../assets/Instagram_logo.png";
import moon from "../../assets/moon-02-svgrepo-com.svg";

import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

const Navbar = () => {
  const [displayPostModal, setDisplayPostModal] = useState(false);
  const [displayMenu, setDisplayMenu] = useState(false);
  const navigate = useNavigate();

  const { currentUser, dispatch } = useContext(AuthContext);

  const handleAddPostModal = () => {
    setDisplayPostModal(true);
  };

  const handleLogout = () => {
    navigate("/");
    dispatch({
      type: "LOGOUT",
    });
  };

  return (
    <>
      <nav className='navbar-container'>
        <div className='navbar-top'>
          <div className='navbar-header'>
            <Link to='/'>
              <img src={logo} alt='Instagram logo' />
            </Link>
          </div>
          <div className='navbar-row'>
            <Link to='/'>
              <div className='navbar-line'>
                <img src={home} alt='home icon' />
                <span>Home</span>
              </div>
            </Link>
          </div>
          <div className='navbar-row'>
            <div className='navbar-line'>
              <img src={search} alt='search icon' />
              <span>Search</span>
            </div>
          </div>
          <div className='navbar-row'>
            <div className='navbar-line'>
              <img src={compass} alt='explore icon' />
              <span>Explore</span>
            </div>
          </div>
          <div className='navbar-row'>
            <div className='navbar-line'>
              <img src={message} alt='message icon' />
              <span>Messages</span>
            </div>
          </div>
          <div className='navbar-row'>
            <div className='navbar-line'>
              <img src={heart} alt='notifications icon' />
              <span>Notifications</span>
            </div>
          </div>
          <div className='navbar-row' onClick={handleAddPostModal}>
            <div className='navbar-line'>
              <img src={add} alt='add post icon' />
              <span>Create</span>
            </div>
          </div>
          <div className='navbar-row'>
            <Link
              to={
                currentUser ? `/${currentUser.displayName}` : "/accounts/login"
              }
            >
              <div className='navbar-line'>
                <img src={profile} alt='profile icon' />
                <span>Profile</span>
              </div>
            </Link>
          </div>
        </div>
        <div className='navbar-bottom'>
          <div className={displayMenu ? "navbar-menu active" : "navbar-menu"}>
            <div className='menu-line'>
              <span>Change appearance</span>
              <img src={moon} alt='moon icon' />
            </div>
            {currentUser ? (
              <div className='menu-line' onClick={handleLogout}>
                <span>Log out</span>
              </div>
            ) : (
              <div className='menu-line'>
                <Link to='/accounts/login'>
                  <span>Log in</span>
                </Link>
              </div>
            )}
          </div>
          <div
            className={
              displayMenu
                ? "navbar-menu-close-field active"
                : "navbar-menu-close-field"
            }
            onClick={() => setDisplayMenu(false)}
          ></div>
          <div className='navbar-row'>
            <div
              className='navbar-line'
              onClick={() => setDisplayMenu(!displayMenu)}
            >
              <img src={menu} alt='menu icon' />
              <span>Menu</span>
            </div>
          </div>
        </div>
      </nav>
      {displayPostModal && (
        <CreatePostModal setDisplayPostModal={setDisplayPostModal} />
      )}
    </>
  );
};

export default Navbar;
