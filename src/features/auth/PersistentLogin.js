import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";

import { selectCurrentToken } from "./authSlice";
import { setLoading } from "../display/displaySlice";
import { logout, refresh } from "./authApiRoutes";

const PersistentLogin = () => {
  const accessToken = useSelector(selectCurrentToken);
  const runEffect = useRef(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginUninitalized, setLoginUninitialized] = useState(true);

  const loggedInCookie = document.cookie.match(/^loggedIn=true$/i);

  const logoutMutation = useMutation({
    mutationFn: logout,
  });

  const refreshMutation = useMutation({
    mutationFn: refresh,
    onSuccess: () => {
      dispatch(setLoading(false));
    },
    onError: () => {
      logoutMutation.mutate();
    },
  });

  useEffect(() => {
    if (runEffect.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        console.log("function run");
        dispatch(setLoading(true));
        setLoginUninitialized(false);
        refreshMutation.mutate();
      };
      console.log("cookie ", Boolean(loggedInCookie));
      console.log("all cookies ", document.cookie);
      if (!accessToken && loggedInCookie) verifyRefreshToken();
      else setLoginUninitialized(true);
    }

    return () => (runEffect.current = true);
  }, []);

  let pageContent;

  if (
    !loggedInCookie ||
    refreshMutation.isSuccess ||
    (accessToken && loginUninitalized)
  ) {
    pageContent = <Outlet />;
  } else if (refreshMutation.isError) {
    pageContent = <Outlet />;
    navigate("/accounts/login", {
      replace: true,
      state: {
        errorMessage: "Please log in again.",
      },
    });
  }

  return pageContent;
};

export default PersistentLogin;
