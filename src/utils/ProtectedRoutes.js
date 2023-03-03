import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const PrivateRoutes = ({ children, ...rest }) => {
  const { currentUser } = useContext(AuthContext);

  return currentUser ? <Outlet /> : <Navigate to='/accounts/login' />;
};

export default PrivateRoutes;
