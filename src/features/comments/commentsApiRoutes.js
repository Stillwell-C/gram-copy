import gramCopyApi from "../../app/api/gramCopyApi";

export const getComment = async (commentID) => {
  const response = await gramCopyApi.get(`/comments/${commentID}`);
  return response.data;
};

export const getPostComments = async ({ pageParam, postID, ...args }) => {
  try {
    const response = await gramCopyApi.get(`/comments/post/${postID}`, {
      params: { page: pageParam, ...args },
    });
    return {
      page: pageParam,
      ...response.data,
    };
  } catch (err) {
    return {
      page: 1,
      comments: [],
      totalComments: 0,
      limit: "10",
      totalPages: 1,
    };
  }
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

export const getCommentsCount = async ({ id }) => {
  try {
    const response = await gramCopyApi.request({
      url: `/comments/count/post/${id}`,
      method: "GET",
    });

    return response.data;
  } catch (err) {
    return { comments: 0 };
  }
};
