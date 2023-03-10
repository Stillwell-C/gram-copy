import React from "react";
import EditProfileMain from "../../components/editProfileMain/EditProfileMain";
import HeaderBar from "../../components/headerBar/HeaderBar";
import Navbar from "../../components/navbar/Navbar";
import "./editProfile.scss";

//TODO: maybe combine with profile page into a 1/3 2/3 split page
const EditProfile = () => {
  return (
    <div className='edit-profile-page-container'>
      <div className='navbar'>
        <Navbar />
      </div>
      <div className='edit-main'>
        <EditProfileMain />
      </div>
    </div>
  );
};

export default EditProfile;
