import { apiSlice } from "../../app/api/apiSlice";

export const likesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLikedUsers: builder.query({
      query: ({ page, limit, postID }) => {
        return {
          url: `/postlike/${postID}?page=${page}&limit=${limit}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result.isError;
          },
        };
      },
      providesTags: (result, error, arg) => {
        if (result) return [{ type: "PostLike", id: result._id }];
        else return ["PostLike"];
      },
    }),
    getLikedPosts: builder.query({
      query: ({ page, limit, postID }) => {
        return {
          url: `/postlike/user/${postID}?page=${page}&limit=${limit}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result.isError;
          },
        };
      },
      providesTags: (result, error, arg) => {
        if (result) return [{ type: "PostLike", id: result._id }];
        else return ["PostLike"];
      },
    }),
    addNewLike: builder.mutation({
      query: ({ parentPostID, userID }) => ({
        url: `/postlike/${parentPostID}`,
        method: "POST",
        body: { userID },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Post", id: arg.parentPostID },
      ],
    }),
    deleteLike: builder.mutation({
      query: ({ parentPostID, userID }) => ({
        url: `/postlike/${parentPostID}`,
        method: "DELETE",
        body: { userID },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Post", id: arg.parentPostID },
      ],
    }),
  }),
});

export const {
  useGetLikedPostsQuery,
  useGetLikedUsersQuery,
  useAddNewLikeMutation,
  useDeleteLikeMutation,
} = likesApiSlice;
