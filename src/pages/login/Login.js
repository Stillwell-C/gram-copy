import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoginForm from "../../components/loginForm/LoginForm";
import SignupForm from "../../components/signupForm/SignupForm";
import { AuthContext } from "../../context/authContext";
import "./login.scss";

const Login = () => {
  const { loginPath } = useParams();

  const { currentUser } = useContext(AuthContext);

  useEffect(() => console.log(currentUser), [currentUser]);

  return (
    <div className='login-container'>
      {loginPath === "login" && <LoginForm />}
      {loginPath === "emailsignup" && <SignupForm />}
    </div>
  );
};

export default Login;
