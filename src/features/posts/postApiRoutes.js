import gramCopyApi from "../../app/api/gramCopyApi";

export const getMultiplePosts = async ({ pageParam = 1, ...args }) => {
  console.log("args", args);
  const queryArr = [];
  for (const [key, value] of Object.entries(args)) {
    queryArr.push(`${key}=${value}`);
  }
  const queryString = queryArr.join("&");
  if (queryString.length) {
    const response = await gramCopyApi.get(`/posts?${queryString}`);
    console.log(response);
    return { ...response.data, page: pageParam };
  }
  const response = await gramCopyApi.get("/posts");
  return { ...response.data, page: pageParam };
};
