import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { getLikeCount } from "./likesApiRoutes";

const LikesCounter = ({
  postLikes,
  postID,
  queryKey,
  postPage,
  verbose = true,
}) => {
  const [likes, setLikes] = useState(0);

  const queryClient = useQueryClient();

  const { data: queriedLikes, isLoading } = useQuery({
    queryKey: ["postlike", postID],
    queryFn: () => getLikeCount({ parentPostID: postID }),
    refetchOnWindowFocus: false,
    onSuccess: () => {
      queryClient.setQueryData(queryKey, (oldData) => {
        const data = oldData;
        if (data?.pages && postPage) {
          // Increment like count
          data.pages[postPage].posts.find(
            (post) => post._id === postID
          ).likes += queriedLikes.likes;
        } else if (data?.imgKey) {
          data.likes += queriedLikes.likes;
        }
        return data;
      });
    },
  });

  useEffect(() => {
    setLikes(postLikes);
  }, [postLikes]);

  useEffect(() => {
    if (isLoading) return;
    console.log(queriedLikes.likes);
    setLikes(queriedLikes.likes);
  }, [queriedLikes]);

  return (
    <>
      {likes}
      {verbose && (likes === 1 ? " Like" : " Likes")}
    </>
  );
};

export default LikesCounter;
