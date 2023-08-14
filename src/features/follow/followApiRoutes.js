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
