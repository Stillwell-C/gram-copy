import gramCopyApi from "../../app/api/gramCopyApi";
import { store } from "../../app/store";
import { setCredentials } from "../auth/authSlice";

export const getUserSearch = async ({ searchQuery, pageParam, args }) => {
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

export const getUserData = async () => {
  const response = await gramCopyApi.get("/users/userData");
  return response.data;
};

export const getUsersFromArr = async (userArr) => {
  const response = await gramCopyApi.get(`/users/userArr/${userArr.join(",")}`);
  return response.data;
};

export const getUsernameAvailability = async (username) => {
  const response = await gramCopyApi.get(
    `/users/availability/username/${username}`
  );
  return response.data;
};

export const getEmailAvailability = async (email) => {
  const response = await gramCopyApi.get(`/users/availability/email/${email}`);
  return response.data;
};

export const createUser = async ({ ...args }) => {
  const response = await gramCopyApi.request({
    url: "/users",
    method: "POST",
    data: { ...args },
  });
  return response.data;
};

export const updateUser = async ({ ...args }) => {
  const response = await gramCopyApi.request({
    url: "/users",
    method: "PATCH",
    data: { ...args },
  });

  const { accessToken } = response.data;
  store.dispatch(setCredentials({ accessToken }));

  return response.data;
};

export const deleteUser = async ({ ...args }) => {
  const response = await gramCopyApi.request({
    url: "/users",
    method: "DELETE",
    data: { ...args },
  });
  return response.data;
};
