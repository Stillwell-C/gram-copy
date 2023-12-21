import gramCopyApi from "../../app/api/gramCopyApi";

export const getLike = async ({ parentPostID }) => {
  try {
    const response = await gramCopyApi.request({
      url: `/postlike/post/${parentPostID}`,
      method: "GET",
    });
    return response.data;
  } catch (err) {
    return { isLiked: false };
  }
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

export const getLikeCount = async ({ parentPostID }) => {
  try {
    const response = await gramCopyApi.request({
      url: `/postlike/count/post/${parentPostID}`,
      method: "GET",
    });

    return response.data;
  } catch (err) {
    return { likes: 0 };
  }
};
