import gramCopyApi from "../../app/api/gramCopyApi";

export const getMultiplePosts = async ({ pageParam, ...args }) => {
  console.log(pageParam);
  console.log("args", args);

  const response = await gramCopyApi.get(`/posts`, {
    params: { page: pageParam, ...args },
  });
  console.log(response);
  const postDataWithPage = response.data.posts.map((post) => ({
    ...post,
    pageNo: pageParam - 1,
  }));
  console.log(postDataWithPage);
  console.log(response.data);
  return {
    posts: postDataWithPage,
    totalPosts: response.data.totalPosts,
    page: pageParam,
  };
};
