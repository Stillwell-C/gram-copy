import FeedRightInfo from "../../components/feedRightInfo/FeedRightInfo";
import HeaderBar from "../../components/headerBar/HeaderBar";
import Navbar from "../../components/navbar/Navbar";
import ImageFeed from "../imageFeed/ImageFeed";
import "./userfeed.scss";

const UserFeed = () => {
  return (
    <div className='userfeed-container'>
      <div>
        <Navbar />
      </div>
      <section className='userfeed-main'>
        <ImageFeed />
        <FeedRightInfo />
      </section>
    </div>
  );
};

export default UserFeed;
