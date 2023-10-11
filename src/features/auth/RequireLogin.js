import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { selectLoadingState } from "../display/displaySlice";

const RequireLogin = () => {
  const { authenticatedUser } = useAuth();
  const location = useLocation();
  const loading = useSelector(selectLoadingState);

  console.log("require loading ", loading);
  console.log("require auth ", authenticatedUser);
  let content;
  if (!loading) {
    content = authenticatedUser ? (
      <Outlet />
    ) : (
      //This will replace inaccessible page from history
      <Navigate to='/accounts/login' state={{ from: location }} replace />
    );
  } else {
    content = <Outlet />;
  }

  return content;
};

export default RequireLogin;
