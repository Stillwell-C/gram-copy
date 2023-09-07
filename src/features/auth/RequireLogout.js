import React from "react";
import useAuth from "../../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
const RequireLogout = () => {
  const { authenticatedUser } = useAuth();

  const content = !authenticatedUser ? <Outlet /> : <Navigate to='/' replace />;

  return content;
};

export default RequireLogout;
