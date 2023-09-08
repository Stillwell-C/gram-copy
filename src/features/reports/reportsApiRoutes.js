import gramCopyApi from "../../app/api/gramCopyApi";

export const addReport = async ({ ...args }) => {
  const response = await gramCopyApi.request({
    url: "/reports",
    method: "POST",
    data: { ...args },
  });
  return response.data;
};
