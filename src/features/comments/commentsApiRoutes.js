import gramCopyApi from "../../app/api/gramCopyApi";

export const getComment = async (commentID) => {
  const response = await gramCopyApi.get(`/comments/${commentID}`);
  return response.data;
};

export const getPostComments = async ({ pageParam, postID, ...args }) => {
  const response = await gramCopyApi.get(`/comments/post/${postID}`, {
    params: { page: pageParam, ...args },
  });
  console.log(response.data);
  //This can be reincluded if removing cases errors
  //   const commentDataWithPage = response.data.comments.map((comment) => ({
  //     ...comment,
  //     pageNo: pageParam - 1,
  //   }));
  return {
    // comments: commentDataWithPage,
    page: pageParam,
    ...response.data,
  };
};

export const addNewComment = async (commentData) => {
  const response = await gramCopyApi.request({
    url: "/comments",
    method: "POST",
    data: { ...commentData },
  });
  return response.data;
};

export const deleteComment = async ({ id }) => {
  const response = await gramCopyApi.request({
    url: "/comments",
    method: "DELETE",
    data: { id },
  });
  return response.data;
};
