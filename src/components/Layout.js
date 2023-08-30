import { Outlet } from "react-router-dom";
import styles from "../scss/layout.module.scss";
import "../scss/global.scss";
import { useSelector } from "react-redux";
import { selectLoadingState } from "../features/display/displaySlice";
import LoadingFullPage from "./LoadingFullPage";

const Layout = () => {
  const loadingState = useSelector(selectLoadingState);

  return (
    <>
      <LoadingFullPage loadingState={loadingState} />
      <div className={styles.layout}>
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
