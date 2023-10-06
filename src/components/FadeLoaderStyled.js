import React from "react";
import { FadeLoader } from "react-spinners";
import "../scss/global.scss";

const FadeLoaderStyled = () => {
  return (
    <div className='loading-div'>
      <FadeLoader cssOverride={{ scale: "0.5" }} color='var(--loading-color)' />
    </div>
  );
};

export default FadeLoaderStyled;
