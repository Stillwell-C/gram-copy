import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const RequireLogin = () => {
  const { authenticatedUser } = useAuth();
  const location = useLocation();

  const content = authenticatedUser ? (
    <Outlet />
  ) : (
    //This will replace inaccessible page from history
    <Navigate to='/accounts/login' state={{ from: location }} replace />
  );

  return content;
};

export default RequireLogin;
