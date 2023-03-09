import React from "react";
import HeaderBar from "../../components/headerBar/HeaderBar";
import Navbar from "../../components/navbar/Navbar";
import ProfileMain from "../../components/profileMain/ProfileMain";
import "./profile.scss";

const Profile = () => {
  return (
    <div className='profile-page-container'>
      <div className='navbar'>
        <Navbar />
        <HeaderBar />
      </div>
      <div className='profile-main'>
        <ProfileMain />
      </div>
    </div>
  );
};

export default Profile;
