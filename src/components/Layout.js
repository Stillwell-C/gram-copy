import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  selectLoadingState,
  selectThemeState,
} from "../features/display/displaySlice";
import { selectError } from "../features/error/errorSlice";

import LoadingFullPage from "./LoadingFullPage";
import ErrorModal from "./ErrorModal";

import "../scss/layout.scss";
import "../scss/global.scss";

const Layout = () => {
  const loadingState = useSelector(selectLoadingState);
  const error = useSelector(selectError);
  const themeState = useSelector(selectThemeState);

  const [theme, setTheme] = useState("theme-light");

  useEffect(() => {
    const localTheme = localStorage.getItem("theme-setting");
    if (
      (!localTheme ||
        localTheme !== "theme-light" ||
        localTheme !== "theme-dark") &&
      themeState
    ) {
      localStorage.setItem("theme-setting", themeState);
    }
  }, []);

  useEffect(() => {
    if (!themeState) return;
    setTheme(themeState);
  }, [themeState]);

  return (
    <div className={theme}>
      <LoadingFullPage loadingState={loadingState} />
      <div className='layout-styles'>
        <Outlet />
        {error && <ErrorModal />}
      </div>
    </div>
  );
};

export default Layout;
