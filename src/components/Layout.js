import { Outlet } from "react-router-dom";
import styles from "../scss/layout.module.scss";
import "../scss/global.scss";
import { useSelector } from "react-redux";
import { selectLoadingState } from "../features/display/displaySlice";
import LoadingFullPage from "./LoadingFullPage";
import { selectError } from "../features/error/errorSlice";
import ErrorModal from "./ErrorModal";

const Layout = () => {
  const loadingState = useSelector(selectLoadingState);
  const error = useSelector(selectError);

  return (
    <>
      <LoadingFullPage loadingState={loadingState} />
      <div className={styles.layout}>
        <Outlet />
        {error && <ErrorModal />}
      </div>
    </>
  );
};

export default Layout;
