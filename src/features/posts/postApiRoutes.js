import gramCopyApi from "../../app/api/gramCopyApi";

export const getMultiplePosts = async ({ pageParam, ...args }) => {
  const response = await gramCopyApi.get(`/posts`, {
    params: { page: pageParam, ...args },
  });
  const postDataWithPage = response.data.posts.map((post) => ({
    ...post,
    pageNo: pageParam - 1,
  }));
  console.log({
    posts: postDataWithPage,
    totalPosts: response.data.totalPosts,
    page: pageParam,
  });
  return {
    posts: postDataWithPage,
    totalPosts: response.data.totalPosts,
    page: pageParam,
  };
};
