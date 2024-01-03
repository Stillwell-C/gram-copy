import ImageFeed from "./ImageFeed";

import "../scss/feedContainer.scss";
import FeedRight from "./FeedRight";

const FeedContainer = ({
  postData,
  homeFeed,
  isLoading,
  isFetching,
  hasNextPage,
  fetchNextPage,
  isError,
  error,
  queryKey,
}) => {
  return (
    <main className='flex-container flex-justify-center fg-1'>
      <ImageFeed
        postData={postData}
        homeFeed={homeFeed}
        isLoading={isLoading}
        isFetching={isFetching}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isError={isError}
        error={error}
        queryKey={queryKey}
      />
      <FeedRight />
    </main>
  );
};

export default FeedContainer;
