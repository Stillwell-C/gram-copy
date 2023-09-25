import { useDispatch, useSelector } from "react-redux";
import usePersistentLogin from "../../hooks/usePersistentLogin";
import { selectCurrentToken, setCredentialsLoading } from "./authSlice";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
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

  useEffect(() => {
    if (runEffect.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        try {
          // dispatch(setCredentialsLoading(true));
          dispatch(setLoading(true));
          setLoginLoading(true);
          setLoginUninitialized(false);
          await refresh();
          dispatch(setLoading(false));
          setLoginSuccess(true);
          setLoginLoading(false);
          // dispatch(setCredentialsLoading(false));
        } catch (err) {
          // dispatch(setCredentialsLoading(false));
          // setPersistentLogin(false);

          //logout ?
          dispatch(setLoading(false));
          navigate("/accounts/login", { replace: true });
        }
      };
      if (!accessToken && loggedInCookie) verifyRefreshToken();
    }

    return () => (runEffect.current = true);
  }, [accessToken]);

  let pageContent;

  // if (persistentLogin && isLoading) {
  //   pageContent = "";
  // } else

  if (!loggedInCookie || loginSuccess || (accessToken && loginUninitalized)) {
    pageContent = <Outlet />;
  } else if (loginError) {
    //Make an error div or page
    console.log(loginError);
  }

  return pageContent;
};

export default PersistentLogin;
