import React from "react";
import { Link } from "react-router-dom";
import LoginTestUserButton from "../features/auth/LoginTestUserButton";

const FeedRightLogin = () => {
  return (
    <div className='login-div'>
      <Link to='/accounts/login'>
        <button className='grey-button'>Log In</button>
      </Link>
      <Link to='/accounts/emailsignup'>
        <button className='grey-button'>Sign Up</button>
      </Link>
      <LoginTestUserButton classname={"grey-button"} />
    </div>
  );
};

export default FeedRightLogin;
