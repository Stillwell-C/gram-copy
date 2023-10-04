import { useDispatch, useSelector } from "react-redux";
import usePersistentLogin from "../../hooks/usePersistentLogin";
import { selectCurrentToken } from "./authSlice";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import LoadingFullPage from "../../components/LoadingFullPage";
import { Outlet, useNavigate } from "react-router-dom";
import { setLoading } from "../display/displaySlice";
import { logout, refresh } from "./authApiRoutes";
import { useMutation } from "react-query";

const PersistentLogin = () => {
  // const [persistentLogin, setPersistentLogin] = usePersistentLogin();
  const accessToken = useSelector(selectCurrentToken);
  const runEffect = useRef(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loginUninitalized, setLoginUninitialized] = useState(true);

  const loggedInCookie = document.cookie.match(/^loggedIn=true$/i);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      navigate("/accounts/login", {
        replace: true,
        state: {
          errorMessage: "Please log in again.",
        },
      });
    },
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
        dispatch(setLoading(true));
        setLoginUninitialized(false);
        refreshMutation.mutate();
      };
      if (!accessToken && loggedInCookie) verifyRefreshToken();
      else setLoginUninitialized(true);
    }

    return () => (runEffect.current = true);
  }, [accessToken]);

  let pageContent;

  if (!loggedInCookie || loginSuccess || (accessToken && loginUninitalized)) {
    pageContent = <Outlet />;
  } else if (refreshMutation.isError) {
    pageContent = <Outlet />;
  }

  return pageContent;
};

export default PersistentLogin;
