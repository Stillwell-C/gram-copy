import gramCopyApi from "../../app/api/gramCopyApi";

export const addNewSave = async ({ parentPostID, userID }) => {
  const response = await gramCopyApi.request({
    url: `/postsave/${parentPostID}`,
    method: "POST",
    data: { userID },
  });
  return response.data;
};

export const deleteSave = async ({ parentPostID, userID }) => {
  const response = await gramCopyApi.request({
    url: `/postsave/${parentPostID}`,
    method: "DELETE",
    data: { userID },
  });
  return response.data;
};
