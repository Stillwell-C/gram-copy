import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import styles from "../scss/layout.module.scss";
import "../scss/global.scss";
import { useSelector } from "react-redux";
import { selectLoadingState } from "../features/display/displaySlice";
import LoadingFullPage from "./LoadingFullPage";

const Layout = () => {
  //Use this to not display navbar on pages
  const { pathname } = useLocation();
  const loadingState = useSelector(selectLoadingState);

  let displayNav = true;
  if (
    pathname.match(/\/accounts\/login/i) ||
    pathname.match(/\/accounts\/emailsignup/i)
  ) {
    displayNav = false;
  }

  return (
    <>
      <LoadingFullPage loadingState={loadingState} />
      <div className={styles.layout}>
        {displayNav && <Navbar />}
        <div className={styles.outlet}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
