import { useEffect } from "react";
import addCommentIcon from "../assets/add-circle-svgrepo-com.svg";
import Comment from "./comment/Comment";
import LoadingSpinner from "./loadingSpinner/LoadingSpinner";
import { useInfiniteQuery } from "react-query";
import { getPostComments } from "../features/comments/commentsApiRoutes";

const PhotoModalComments = ({ post, setShowPhotoModal }) => {
  const commentLoadLimit = 10;

  const {
    data: commentData,
    isLoading,
    isError,
    error,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["comments", post._id],
    queryFn: ({ pageParam = 1 }) =>
      getPostComments({
        pageParam,
        limit: commentLoadLimit,
        postID: post._id,
      }),
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, pages) => {
      const pageLimit = Math.ceil(lastPage.totalComments / commentLoadLimit);
      if (lastPage.page < pageLimit) return lastPage.page + 1;
      return false;
    },
  });

  useEffect(() => {
    if (isError) console.log(error);
  }, [isError]);

  const flattenedFeedData = commentData?.pages?.reduce((acc, page) => {
    return [...acc, ...page.comments];
  }, []);

  const captionComment = {
    commentBody: post.caption,
    updatedAt: post.updatedAt,
    author: {
      username: post.user.username,
      userImgKey: post.user.userImgKey,
    },
    _id: `${post._id}postCaption`,
  };

  const commentsArr = post?.caption?.length
    ? flattenedFeedData?.length
      ? [captionComment, ...flattenedFeedData]
      : [captionComment]
    : flattenedFeedData?.length
    ? [...flattenedFeedData]
    : [];

  const comments = commentsArr?.map((comment) => (
    <Comment
      comment={comment}
      abbreviate={false}
      showTime={true}
      showImage={true}
      setShowPhotoModal={setShowPhotoModal}
      key={comment._id}
    />
  ));

  return (
    <>
      {comments}
      {(isLoading || isFetching) && <LoadingSpinner />}
      {hasNextPage && (
        <div className='add-comments-button-div'>
          <button
            type='button'
            aria-label='click to show more comments'
            title='click to show more comments'
            onClick={fetchNextPage}
          >
            <img src={addCommentIcon} alt='' aria-hidden='true' />
          </button>
        </div>
      )}
    </>
  );
};

export default PhotoModalComments;
