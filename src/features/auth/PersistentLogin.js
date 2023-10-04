import { useDispatch, useSelector } from "react-redux";
import usePersistentLogin from "../../hooks/usePersistentLogin";
import { selectCurrentToken } from "./authSlice";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import { useSendLogoutMutation } from "./authApiSlice";
import LoadingFullPage from "../../components/LoadingFullPage";
import { Outlet, useNavigate } from "react-router-dom";
import { setLoading } from "../display/displaySlice";
import { refresh } from "./authApiRoutes";

const PersistentLogin = () => {
  // const [persistentLogin, setPersistentLogin] = usePersistentLogin();
  const accessToken = useSelector(selectCurrentToken);
  const runEffect = useRef(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loginUninitalized, setLoginUninitialized] = useState(true);

  const loggedInCookie = document.cookie.match(/^loggedIn=true$/i);

  // const [refresh, { isUninitialized, isLoading, isSuccess, isError }] =
  //   useRefreshMutation();

  const [
    sendLogout,
    {
      isLoading: logoutLoading,
      isSuccess: logoutSuccess,
      isError: logoutIsError,
      error: logoutError,
    },
  ] = useSendLogoutMutation();

  useEffect(() => {
    if (runEffect.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        try {
          dispatch(setLoading(true));
          setLoginLoading(true);
          setLoginUninitialized(false);
          await refresh();
          dispatch(setLoading(false));
          setLoginSuccess(true);
          setLoginLoading(false);
        } catch (err) {
          // setPersistentLogin(false);
          console.log(err);
          //logout ?
          await sendLogout();
          document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
          navigate("/accounts/login", {
            replace: true,
            state: {
              errorMessage: "Please log in again.",
            },
          });
          dispatch(setLoading(false));
        }
      };
      if (!accessToken && loggedInCookie) verifyRefreshToken();
    }

    return () => (runEffect.current = true);
  }, [accessToken]);

  let pageContent;

  if (!loggedInCookie || loginSuccess || (accessToken && loginUninitalized)) {
    pageContent = <Outlet />;
  } else if (loginError) {
    sendLogout();
    document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    navigate("/accounts/login", {
      replace: true,
      state: {
        errorMessage: "Please log in again.",
      },
    });
    pageContent = <Outlet />;
    console.log(loginError);
  }

  return pageContent;
};

export default PersistentLogin;
