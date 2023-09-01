import React from "react";
import { Link } from "react-router-dom";

const AccountError = () => {
  return (
    <div className='flex-container flex-align-center flex-justify-center fg-1 gap-2 flex-column'>
      <h2>An Error Occurred</h2>
      <p>
        Please <Link to='/accounts/login'>log in</Link> again.
      </p>
    </div>
  );
};

export default AccountError;
