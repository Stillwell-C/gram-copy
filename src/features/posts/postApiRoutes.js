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
    page: pageParam,
    ...response.data,
  });
  return {
    posts: postDataWithPage,
    page: pageParam,
    ...response.data,
  };
};

export const getTaggedPosts = async ({ pageParam, userID, ...args }) => {
  const response = await gramCopyApi.get(`/posts/tagged/${userID}`, {
    params: { page: pageParam, ...args },
  });
  const postDataWithPage = response.data.posts.map((post) => ({
    ...post,
    pageNo: pageParam - 1,
  }));
  return {
    posts: postDataWithPage,
    page: pageParam,
    ...response.data,
  };
};
