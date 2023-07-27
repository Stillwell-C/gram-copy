import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import styles from "../scss/layout.module.scss";
import "../scss/global.scss";

const Layout = () => {
  //Use this to not display navbar on pages
  const { pathname } = useLocation();

  return (
    <div className={styles.layout}>
      <Navbar />
      <div className={styles.outlet}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
