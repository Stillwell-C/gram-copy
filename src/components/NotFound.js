import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className='flex-container flex-column fg-1 margin-top-3 flex-align-center gap-2'>
      <h2>Sorry, this page isn't available</h2>
      <p>
        The link you followed may be broken, or the page may have been removed.{" "}
        <Link to='/'>Go back to Instagram</Link>
      </p>
    </div>
  );
};

export default NotFound;
