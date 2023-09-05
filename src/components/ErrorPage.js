import React from "react";
import { Link, useLocation } from "react-router-dom";

const ErrorPage = () => {
  const location = useLocation();
  let errorTitle = "Error";
  let errorMessage = "";

  if (location?.state?.errorCode === 500) {
    errorTitle = "Something went wrong.";
    errorMessage = "Sorry, a network error occurred. Please try again.";
  }

  if (location?.state?.errorCode === 404) {
    errorTitle = "Sorry, this page isn't available.";
    errorMessage =
      "The link you followed may be broken, or the page may have been removed";
  }

  if (location?.state?.errorMessage) {
    errorMessage = location.state.errorMessage;
  }

  if (location?.state?.errorTitle) {
    errorTitle = location.state.errorTitle;
  }

  return (
    <main className='flex-container fg-1 flex-column flex-align-center margin-top-3 gap-1'>
      <h2>{errorTitle}</h2>
      {errorMessage.length && <p>{errorMessage}</p>}
      {!errorMessage.length && <p>An error occurred. Please try again.</p>}
      <Link to='/'>Go back to Instagram.</Link>
    </main>
  );
};

export default ErrorPage;
