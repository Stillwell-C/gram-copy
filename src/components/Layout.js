import { Outlet } from "react-router-dom";
import styles from "../scss/layout.module.scss";
import "../scss/global.scss";
import { useSelector } from "react-redux";
import {
  selectLoadingState,
  selectThemeState,
} from "../features/display/displaySlice";
import LoadingFullPage from "./LoadingFullPage";
import { selectError } from "../features/error/errorSlice";
import ErrorModal from "./ErrorModal";
import { useEffect, useState } from "react";

const Layout = () => {
  const loadingState = useSelector(selectLoadingState);
  const error = useSelector(selectError);
  const themeState = useSelector(selectThemeState);

  const [theme, setTheme] = useState("theme-light");

  const setLocalStorageTheme = (theme) => {
    localStorage.setItem("theme-setting", theme);
  };

  useEffect(() => {
    const localTheme = localStorage.getItem("theme-setting");
    if (
      localTheme &&
      (localTheme === "theme-light" || localTheme === "theme-dark")
    ) {
      setTheme(localTheme);
    } else {
      const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "theme-dark"
        : "theme-light";

      setLocalStorageTheme(preferredTheme);
      setTheme(preferredTheme);
    }
  }, []);

  useEffect(() => {
    if (!themeState) return;
    setTheme(themeState);
  }, [themeState]);

  return (
    <div className={theme}>
      <LoadingFullPage loadingState={loadingState} />
      <div className={styles.layout}>
        <Outlet />
        {error && <ErrorModal />}
      </div>
    </div>
  );
};

export default Layout;
