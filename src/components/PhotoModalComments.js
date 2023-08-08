import { useEffect, useState } from "react";
import addCommentIcon from "../assets/add-circle-svgrepo-com.svg";

import { useGetPostCommentsQuery } from "../features/comments/commentsApiSlice";
import Comment from "./comment/Comment";
import LoadingSpinner from "./loadingSpinner/LoadingSpinner";

const PhotoModalComments = ({ post, setShowPhotoModal }) => {
  const [pageNum, setPageNum] = useState(1);
  const [commentDataArr, setCommentDataArr] = useState([]);
  const [hasMoreComments, setHasMoreComments] = useState(false);

  useEffect(() => {
    if (post.caption.length) {
      const caption = {
        commentBody: post.caption,
        updatedAt: post.updatedAt,
        author: {
          username: post.user.username,
          userImgKey: post.user.userImgKey,
        },
        _id: `${post._id}postCaption`,
      };
      setCommentDataArr([caption]);
    }
  }, []);

  const commentLoadLimit = 10;

  const {
    data: commentData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetPostCommentsQuery({
    postID: post._id,
    page: pageNum,
    limit: commentLoadLimit,
  });

  useEffect(() => {
    if (isError) console.log(error);
  }, [isError]);

  useEffect(() => {
    if (isLoading || isFetching || !commentData) return;
    setHasMoreComments(
      (Math.ceil(commentData?.totalComments / commentLoadLimit) || 1) > pageNum
    );
    if (
      commentDataArr.length &&
      commentDataArr.filter(({ _id }) => _id === commentData?.comments[0]?._id)
        .length > 0
    ) {
      const filteredCommentData = commentData?.comments?.filter(
        (commentData) =>
          !commentDataArr.some(
            (commentDataArr) => commentData._id === commentDataArr._id
          )
      );
      setCommentDataArr((prev) => [...prev, ...filteredCommentData]);
      return;
    }
    setCommentDataArr((prev) => [...prev, ...commentData?.comments]);
  }, [commentData]);

  const comments = commentDataArr?.map((comment) => (
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
      {hasMoreComments && (
        <div className='add-comments-button-div'>
          <button
            type='button'
            aria-label='click to show more comments'
            title='click to show more comments'
            onClick={() => setPageNum((prev) => prev + 1)}
          >
            <img src={addCommentIcon} alt='' aria-hidden='true' />
          </button>
        </div>
      )}
    </>
  );
};

export default PhotoModalComments;
