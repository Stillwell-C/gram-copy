import FeedRightInfo from "../../components/feedRightInfo/FeedRightInfo";
import ImageFeed from "../imageFeed/ImageFeed";
import "./userfeed.scss";

const UserFeed = () => {
  return (
    <main className='userfeed-main'>
      <ImageFeed />
      <FeedRightInfo />
    </main>
  );
};

export default UserFeed;
