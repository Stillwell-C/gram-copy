import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoginForm from "../../components/loginForm/LoginForm";
import SignupForm from "../../components/signupForm/SignupForm";
import { AuthContext } from "../../context/authContext";
import EditProfile from "../editProfile/EditProfile";
import "./login.scss";

//TODO: Possibly rename component to accounts
const Login = () => {
  const { accountsPath } = useParams();

  const { currentUser } = useContext(AuthContext);

  return (
    <div className='login-container'>
      {accountsPath === "login" && <LoginForm />}
      {accountsPath === "emailsignup" && <SignupForm />}
      {accountsPath === "edit" && <EditProfile />}
      {accountsPath === "password" && <EditProfile />}
    </div>
  );
};

export default Login;
