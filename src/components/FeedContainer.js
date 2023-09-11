import FeedRightInfo from "./FeedRightInfo";
import ImageFeed from "./ImageFeed";
import "../scss/feedContainer.scss";

const FeedContainer = () => {
  return (
    <main className='flex-container flex-justify-center fg-1'>
      <ImageFeed />
      <FeedRightInfo />
    </main>
  );
};

export default FeedContainer;
