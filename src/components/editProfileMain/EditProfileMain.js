import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EditProfileInformation from "../editProfileInformation/EditProfileInformation";
import { EditProfilePassword } from "../editProfilePassword/EditProfilePassword";
import Footer from "../footer/Footer";
import "./editProfileMain.scss";

const EditProfileMain = () => {
  const [pageDisplay, setPageDisplay] = useState("edit");

  const handleSetEdit = () => {
    if (pageDisplay === "edit") return;
    setPageDisplay("edit");
  };

  const handleSetPassword = () => {
    if (pageDisplay === "password") return;
    setPageDisplay("password");
  };

  return (
    <div className='edit-profile-container'>
      <div className='edit-profile-div'>
        <div className='edit-profile-sidebar'>
          <div
            aria-label='click to switch to edit profile page'
            className={pageDisplay === "edit" ? "active" : ""}
            onClick={handleSetEdit}
          >
            <span>Edit Profile</span>
          </div>

          <div
            aria-label='click to switch to change password page'
            className={pageDisplay === "password" ? "active" : ""}
            onClick={handleSetPassword}
          >
            <span>Change Password</span>
          </div>
        </div>
        <div className='edit-profile-body'>
          {pageDisplay === "edit" && <EditProfileInformation />}
          {pageDisplay === "password" && <EditProfilePassword />}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditProfileMain;
