import React from "react";

import gramImg from "../assets/instagram-svgrepo-com.svg";

import "../scss/layout.scss";
import "../scss/loadingFullPage.scss";

const LoadingFullPage = ({ loadingState }) => {
  return (
    <main
      className={`loadingFullPage`}
      style={{ display: loadingState ? "block" : "none" }}
    >
      <div className={"layout-styles flex-justify-center flex-align-center"}>
        <img src={gramImg} alt='Gram Copy Logo' />
      </div>
    </main>
  );
};

export default LoadingFullPage;
