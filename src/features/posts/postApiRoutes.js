import gramCopyApi from "../../app/api/gramCopyApi";

export const getPost = async (postID) => {
  const response = await gramCopyApi.get(`/posts/${postID}`);
  return response.data;
};

export const getMultiplePosts = async ({ pageParam, ...args }) => {
  try {
    const response = await gramCopyApi.get(`/posts`, {
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
  } catch (err) {
    return {
      posts: [],
      totalPosts: 0,
      page: 0,
    };
  }
};

export const getTaggedPosts = async ({ pageParam, userID, ...args }) => {
  try {
    const response = await gramCopyApi.get(`/posts/tagged/${userID}`, {
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
  } catch (err) {
    return {
      posts: [],
      totalPosts: 0,
      page: 0,
    };
  }
};

export const addNewPost = async (postData) => {
  const response = await gramCopyApi.request({
    url: `/posts/`,
    method: "POST",
    data: { ...postData },
  });
  return response.data;
};

export const updatePost = async (postData) => {
  const response = await gramCopyApi.request({
    url: `/posts/`,
    method: "PATCH",
    data: { ...postData },
  });
  return response.data;
};

export const updatePostTaggedUsers = async ({
  postID,
  userID,
  updateAction,
}) => {
  const response = await gramCopyApi.request({
    url: `/posts/tagged`,
    method: "PATCH",
    data: { postID, userID, updateAction },
  });
  return response.data;
};

export const deletePost = async ({ id, imgKey }) => {
  const response = await gramCopyApi.request({
    url: `/posts/`,
    method: "DELETE",
    data: { id, imgKey },
  });
  return response.data;
};
