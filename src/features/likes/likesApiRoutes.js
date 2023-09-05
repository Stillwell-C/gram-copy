import gramCopyApi from "../../app/api/gramCopyApi";

export const addNewLike = async ({ parentPostID, userID }) => {
  const response = await gramCopyApi.request({
    url: `/postlike/${parentPostID}`,
    method: "POST",
  });
  return response.data;
};

export const deleteLike = async ({ parentPostID, userID }) => {
  const response = await gramCopyApi.request({
    url: `/postlike/${parentPostID}`,
    method: "DELETE",
  });
  return response.data;
};
