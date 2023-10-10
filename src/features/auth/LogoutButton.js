import React from "react";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";

import { setError, setErrorRefreshPage } from "../error/errorSlice";
import { logout } from "./authApiRoutes";
import useAuth from "../../hooks/useAuth";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const { authenticatedUser } = useAuth();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onError: () => {
      dispatch(setError(true));
      dispatch(setErrorRefreshPage(true));
    },
  });

  const handleLogout = async () => {
    if (authenticatedUser) {
      logoutMutation.mutate();
    }
  };

  return <button onClick={handleLogout}>Log out</button>;
};

export default LogoutButton;
