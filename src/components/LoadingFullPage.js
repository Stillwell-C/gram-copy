import React from "react";
import gramImg from "../assets/instagram-svgrepo-com.svg";
import Styles from "../scss/globalStyles.module.scss";
import "../scss/loadingFullPage.scss";

const LoadingFullPage = () => {
  return (
    <div
      className={`${Styles.flexGrow1} ${Styles.flexContainer} ${Styles.flexAlignCenter} ${Styles.flexJustifyCenter}`}
    >
      <img src={gramImg} alt='Gram Copy Logo' />
    </div>
  );
};

export default LoadingFullPage;
