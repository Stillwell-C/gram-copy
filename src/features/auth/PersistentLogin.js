import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";

import { selectCurrentToken } from "./authSlice";
import { setLoading } from "../display/displaySlice";
import { logout, refresh } from "./authApiRoutes";
import LoadingFullPage from "../../components/LoadingFullPage";

const PersistentLogin = () => {
  const accessToken = useSelector(selectCurrentToken);
  const runEffect = useRef(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginUninitalized, setLoginUninitialized] = useState(true);

  const loggedInCookie = document.cookie.match(/^loggedIn=true$/i);
  const loggedInLocal = JSON.parse(localStorage.getItem("loggedIn"));
  const persistLoginCheck = loggedInCookie || loggedInLocal;

  const logoutMutation = useMutation({
    mutationFn: logout,
  });

  const refreshMutation = useMutation({
    mutationFn: refresh,
    onSuccess: () => {
      dispatch(setLoading(false));
    },
    onError: () => {
      // logoutMutation.mutate();
    },
  });

  useEffect(() => {
    if (runEffect.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        dispatch(setLoading(true));
        setLoginUninitialized(false);
        refreshMutation.mutate();
      };
      if (!accessToken && persistLoginCheck) verifyRefreshToken();
      else setLoginUninitialized(true);
    }

    return () => (runEffect.current = true);
  }, []);

  let pageContent;

  if (persistLoginCheck && refreshMutation.isLoading) {
    pageContent = <LoadingFullPage />;
  } else if (
    !persistLoginCheck ||
    refreshMutation.isSuccess ||
    (accessToken && loginUninitalized)
  ) {
    pageContent = <Outlet />;
  } else if (refreshMutation.isError) {
    console.log(refreshMutation.error);
    console.log(Boolean(persistLoginCheck));
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
