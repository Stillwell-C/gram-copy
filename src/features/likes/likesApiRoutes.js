import gramCopyApi from "../../app/api/gramCopyApi";

export const getLike = async ({ parentPostID }) => {
  const response = await gramCopyApi.request({
    url: `/postlike/post/${parentPostID}`,
    method: "GET",
  });
  return response.data;
};

export const addNewLike = async ({ parentPostID }) => {
  const response = await gramCopyApi.request({
    url: `/postlike/${parentPostID}`,
    method: "POST",
  });
  return response.data;
};

export const deleteLike = async ({ parentPostID }) => {
  const response = await gramCopyApi.request({
    url: `/postlike/${parentPostID}`,
    method: "DELETE",
  });
  return response.data;
};
