import gramCopyApi from "../../app/api/gramCopyApi";

export const addNewLike = async ({ parentPostID, userID }) => {
  const response = await gramCopyApi.request({
    url: `/postlike/${parentPostID}`,
    method: "POST",
    data: { userID },
  });
  return response.data;
};

export const deleteLike = async ({ parentPostID, userID }) => {
  const response = await gramCopyApi.request({
    url: `/postlike/${parentPostID}`,
    method: "DELETE",
    data: { userID },
  });
  return response.data;
};
