import { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { FadeLoader } from "react-spinners";
import { useDispatch } from "react-redux";

import { getPostComments } from "./commentsApiRoutes";
import { setError, setErrorRefreshPage } from "../error/errorSlice";
import Comment from "../../components/Comment";

import addCommentIcon from "../../assets/add-circle-svgrepo-com.svg";

const PhotoModalComments = ({ post, setShowPhotoModal }) => {
  const dispatch = useDispatch();

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
    queryKey: ["comments", post?._id],
    queryFn: ({ pageParam = 1 }) =>
      getPostComments({
        pageParam,
        limit: commentLoadLimit,
        postID: post?._id,
      }),
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.page < lastPage.totalPages)
        return parseInt(lastPage.page) + 1;
      return false;
    },
  });

  useEffect(() => {
    if (isError) {
      if (error?.response?.status === 400) return;
      dispatch(setError(true));
      dispatch(setErrorRefreshPage(false));
    }
  }, [isError]);

  const flattenedFeedData = commentData?.pages?.length
    ? commentData?.pages?.reduce((acc, page) => {
        if (!page?.comments?.length) return acc;

        return [...acc, ...page?.comments];
      }, [])
    : [];

  const captionComment = {
    commentBody: post?.caption,
    updatedAt: post?.updatedAt,
    author: {
      username: post?.user?.username,
      userImgKey: post?.user?.userImgKey,
    },
    _id: `${post?._id}postCaption`,
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
      {(isLoading || isFetching) && (
        <FadeLoader
          cssOverride={{ alignSelf: "center", scale: "0.5" }}
          color='#333'
        />
      )}
      {hasNextPage && !isLoading && !isFetching && (
        <div className='add-comments-button-div'>
          <button
            type='button'
            aria-label='click to show more comments'
            title='click to show more comments'
            onClick={fetchNextPage}
          >
            <img
              src={addCommentIcon}
              className='themeable-icon'
              alt=''
              aria-hidden='true'
            />
          </button>
        </div>
      )}
    </>
  );
};

export default PhotoModalComments;
