import gramCopyApi from "../../app/api/gramCopyApi";

export const getUserSearch = async (searchQuery, pageParam, args) => {
  const response = await gramCopyApi.get(`/users/search/${searchQuery}`, {
    params: { page: pageParam, ...args },
  });
  //   const postDataWithPage = response.data.posts.map((post) => ({
  //     ...post,
  //     pageNo: pageParam - 1,
  //   }));
  return response.data;
};

export const getUser = async (userID) => {
  const response = await gramCopyApi.get(`/users/${userID}`);
  return response.data;
};

export const updateUser = async ({ userID, ...args }) => {
  const response = await gramCopyApi.request({
    url: "/users",
    method: "PATCH",
    data: { id: userID, ...args },
  });
  return response.data;
};
