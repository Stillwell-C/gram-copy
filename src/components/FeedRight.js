import React from "react";
import FeedRightInfo from "./FeedRightInfo";
import Footer from "./Footer";
import PopularUsers from "../features/users/PopularUsers";
import useAuth from "../hooks/useAuth";
import FeedRightLogin from "./FeedRightLogin";

const FeedRight = () => {
  const { authenticatedUser } = useAuth();

  return (
    <section className='right-info-container'>
      {authenticatedUser ? <FeedRightInfo /> : <FeedRightLogin />}
      <Footer />
      <div>
        <PopularUsers />
      </div>
    </section>
  );
};

export default FeedRight;
