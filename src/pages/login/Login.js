import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoginForm from "../../components/loginForm/LoginForm";
import SignupForm from "../../components/signupForm/SignupForm";
import { AuthContext } from "../../context/authContext";
import "./login.scss";

const Login = () => {
  const { accountsPath } = useParams();

  const { currentUser } = useContext(AuthContext);

  useEffect(() => console.log(currentUser), [currentUser]);

  return (
    <div className='login-container'>
      {accountsPath === "login" && <LoginForm />}
      {accountsPath === "emailsignup" && <SignupForm />}
    </div>
  );
};

export default Login;
