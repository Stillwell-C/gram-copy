import React from "react";
import gramImg from "../assets/instagram-svgrepo-com.svg";
import Styles from "../scss/globalStyles.module.scss";
import LayoutStyles from "../scss/layout.module.scss";
import "../scss/loadingFullPage.scss";

const LoadingFullPage = ({ loadingState }) => {
  return (
    <main
      className={`loadingFullPage`}
      style={{ display: loadingState ? "block" : "none" }}
    >
      <div
        className={`${LayoutStyles.layout} flex-justify-center flex-align-center`}
      >
        <img src={gramImg} alt='Gram Copy Logo' />
      </div>
    </main>
  );
};

export default LoadingFullPage;
