import gramCopyApi from "../../app/api/gramCopyApi";

export const getSavedPosts = async ({ pageParam, ...args }) => {
  const response = await gramCopyApi.get("/postsave/user/", {
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

export const addNewSave = async ({ parentPostID }) => {
  const response = await gramCopyApi.request({
    url: `/postsave/${parentPostID}`,
    method: "POST",
  });
  return response.data;
};

export const deleteSave = async ({ parentPostID }) => {
  const response = await gramCopyApi.request({
    url: `/postsave/${parentPostID}`,
    method: "DELETE",
  });
  return response.data;
};
