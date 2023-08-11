import gramCopyApi from "../../app/api/gramCopyApi";

export const getSavedPosts = async ({ userID, pageParam, ...args }) => {
  const response = await gramCopyApi.get(`/postsave/user/${userID}`, {
    params: { page: pageParam, ...args },
  });
  const postDataWithPage = response.data.posts.map((post) => ({
    ...post,
    pageNo: pageParam - 1,
  }));
  return {
    ...response.data,
    posts: postDataWithPage,
    page: pageParam,
  };
};

export const addNewSave = async ({ parentPostID, userID }) => {
  const response = await gramCopyApi.request({
    url: `/postsave/${parentPostID}`,
    method: "POST",
    data: { userID },
  });
  return response.data;
};

export const deleteSave = async ({ parentPostID, userID }) => {
  const response = await gramCopyApi.request({
    url: `/postsave/${parentPostID}`,
    method: "DELETE",
    data: { userID },
  });
  return response.data;
};
