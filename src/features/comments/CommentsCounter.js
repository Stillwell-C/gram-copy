import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getCommentsCount } from "./commentsApiRoutes";

const CommentsCounter = ({ postComments, postID }) => {
  const [comments, setComments] = useState(0);

  const { data: queriedComments, isLoading } = useQuery({
    queryKey: ["postcomment", postID],
    queryFn: () => getCommentsCount({ id: postID }),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setComments(postComments);
  }, [postComments]);

  useEffect(() => {
    if (isLoading) return;
    setComments(queriedComments.comments);
  }, [queriedComments]);

  return <>{comments}</>;
};

export default CommentsCounter;
