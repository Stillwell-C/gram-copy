import gramCopyApi from "../../app/api/gramCopyApi";

export const getFollowers = async ({ userID, ...args }) => {
  try {
    const response = await gramCopyApi.get(`/follow/${userID}/followers`, {
      params: { ...args },
    });
    return response.data;
  } catch (err) {
    return { pages: [{ followers: [], totalFollowers: 0, totalPages: 0 }] };
  }
};

export const getFollowing = async ({ userID, ...args }) => {
  try {
    const response = await gramCopyApi.get(`/follow/${userID}/following`, {
      params: { ...args },
    });
    return response.data;
  } catch (err) {
    return { pages: [{ following: [], totalFollowing: 0, totalPages: 0 }] };
  }
};

export const addFollow = async ({ followedID }) => {
  try {
    const response = await gramCopyApi.request({
      url: "/follow",
      method: "POST",
      data: {
        followedID,
      },
    });
    return response.data;
  } catch (err) {
    return { message: err.message, isError: true };
  }
};

export const deleteFollow = async ({ followedID }) => {
  try {
    const response = await gramCopyApi.request({
      url: "/follow",
      method: "DELETE",
      data: {
        followedID,
      },
    });
    return response.data;
  } catch (err) {
    return { message: err.message, isError: true };
  }
};
