import gramCopyApi from "../../app/api/gramCopyApi";

export const getNotifications = async ({ pageParam, limit }) => {
  const response = await gramCopyApi.get("/notifications", {
    params: { page: pageParam, limit },
  });
  return response.data;
};
