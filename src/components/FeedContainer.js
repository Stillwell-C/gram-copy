import FeedRightInfo from "./feedRightInfo/FeedRightInfo";
import ImageFeed from "./imageFeed/ImageFeed";

const FeedContainer = () => {
  return (
    <main className='flex-container flex-justify-center fg-1'>
      <ImageFeed />
      <FeedRightInfo />
    </main>
  );
};

export default FeedContainer;
