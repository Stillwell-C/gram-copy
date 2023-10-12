import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { selectLoadingState } from "../display/displaySlice";

const RequireLogin = () => {
  const { authenticatedUser } = useAuth();
  const location = useLocation();
  const loading = useSelector(selectLoadingState);

  let content;
  if (!loading) {
    content = authenticatedUser ? (
      <Outlet />
    ) : (
      //This will replace inaccessible page from history
      <Navigate to='/accounts/login' state={{ from: location }} replace />
    );
  } else {
    //This is necessary to accurately toggle off loading splash page for some pages
    //Page will still not be visible due to splash page
    //Sensitive operations & supplying of personal data are also protected on server side
    content = <Outlet />;
  }

  return content;
};

export default RequireLogin;
