import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EditProfileInformation from "../editProfileInformation/EditProfileInformation";
import { EditProfilePassword } from "../editProfilePassword/EditProfilePassword";
import Footer from "../footer/Footer";
import "./editProfileMain.scss";

const EditProfileMain = () => {
  const { accountsPath } = useParams();

  const [sidebarActive, setSidebarActive] = useState("");

  useEffect(() => {
    if (accountsPath === "edit") setSidebarActive("edit");
    if (accountsPath === "password") setSidebarActive("password");
  }, []);

  return (
    <div className='edit-profile-container'>
      <div className='edit-profile-div'>
        <div className='edit-profile-sidebar'>
          <Link to='/accounts/edit'>
            <div className={sidebarActive === "edit" ? "active" : ""}>
              Edit Profile
            </div>
          </Link>
          <Link to='/accounts/password'>
            <div className={sidebarActive === "password" ? "active" : ""}>
              Change Password
            </div>
          </Link>
        </div>
        <div className='edit-profile-body'>
          {accountsPath === "edit" && <EditProfileInformation />}
          {accountsPath === "password" && <EditProfilePassword />}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditProfileMain;
