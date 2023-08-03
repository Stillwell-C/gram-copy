import React from "react";
import gramImg from "../assets/instagram-svgrepo-com.svg";
import Styles from "../scss/globalStyles.module.scss";
import LayoutStyles from "../scss/layout.module.scss";
import "../scss/loadingFullPage.scss";

const LoadingFullPage = () => {
  return (
    <div
      className={`${LayoutStyles.layout} ${Styles.flexAlignCenter} ${Styles.flexJustifyCenter} loadingFullPage`}
    >
      <img src={gramImg} alt='Gram Copy Logo' />
    </div>
  );
};

export default LoadingFullPage;
