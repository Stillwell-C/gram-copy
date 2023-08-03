import { useDispatch, useSelector } from "react-redux";
import usePersistentLogin from "../../hooks/usePersistentLogin";
import { selectCurrentToken, setCredentialsLoading } from "./authSlice";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import LoadingFullPage from "../../components/LoadingFullPage";
import { Outlet } from "react-router-dom";

const PersistentLogin = () => {
  const [persistentLogin, setPersistentLogin] = usePersistentLogin();
  const accessToken = useSelector(selectCurrentToken);
  const runEffect = useRef(false);

  const dispatch = useDispatch();

  const [loginSuccess, setLoginSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError }] =
    useRefreshMutation();

  useEffect(() => {
    if (runEffect.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        try {
          dispatch(setCredentialsLoading(true));
          await refresh();
          setLoginSuccess(true);
          dispatch(setCredentialsLoading(false));
        } catch (err) {
          dispatch(setCredentialsLoading(false));
        }
      };
      if (!accessToken && persistentLogin) verifyRefreshToken();
    }

    return () => (runEffect.current = true);
  }, []);

  let pageContent;

  if (persistentLogin && isLoading) {
    pageContent = <LoadingFullPage />;
  } else if (
    !persistentLogin ||
    (isSuccess && loginSuccess) ||
    (accessToken && isUninitialized)
  ) {
    pageContent = <Outlet />;
  } else if (isError) {
    setPersistentLogin(false);
    //Make an error div or page
    console.log("An error occurred. Please login again.");
  }

  return pageContent;
};

export default PersistentLogin;
