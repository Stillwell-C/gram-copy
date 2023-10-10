import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const RequireLogout = () => {
  const { authenticatedUser } = useAuth();

  const content = !authenticatedUser ? <Outlet /> : <Navigate to='/' replace />;

  return content;
};

export default RequireLogout;
