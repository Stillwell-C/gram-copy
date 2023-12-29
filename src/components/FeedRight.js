import React from "react";
import FeedRightInfo from "./FeedRightInfo";
import Footer from "./Footer";
import PopularUsers from "../features/users/PopularUsers";

const FeedRight = () => {
  return (
    <section className='right-info-container'>
      <FeedRightInfo />
      <Footer />
      <div>
        <PopularUsers />
      </div>
    </section>
  );
};

export default FeedRight;
