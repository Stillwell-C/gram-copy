import { useDispatch, useSelector } from "react-redux";
import usePersistentLogin from "../../hooks/usePersistentLogin";
import { selectCurrentToken } from "./authSlice";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import LoadingFullPage from "../../components/LoadingFullPage";
import { Outlet, useNavigate } from "react-router-dom";
import { setLoading } from "../display/displaySlice";
import { logout, refresh } from "./authApiRoutes";

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

  // const [refresh, { isUninitialized, isLoading, isSuccess, isError }] =
  //   useRefreshMutation();

  const handleLogout = async () => {
    await logout();
    navigate("/accounts/login", {
      replace: true,
      state: {
        errorMessage: "Please log in again.",
      },
    });
  };

  useEffect(() => {
    if (runEffect.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        try {
          dispatch(setLoading(true));
          setLoginUninitialized(false);
          await refresh();
          dispatch(setLoading(false));
          setLoginSuccess(true);
        } catch (err) {
          console.log(err);
          await handleLogout();
        }
      };
      if (!accessToken && loggedInCookie) verifyRefreshToken();
      else setLoginUninitialized(true);
    }

    return () => (runEffect.current = true);
  }, [accessToken]);

  let pageContent;

  if (!loggedInCookie || loginSuccess || (accessToken && loginUninitalized)) {
    pageContent = <Outlet />;
  } else if (loginError) {
    handleLogout();
    pageContent = <Outlet />;
    console.log(loginError);
  }

  return pageContent;
};

export default PersistentLogin;
