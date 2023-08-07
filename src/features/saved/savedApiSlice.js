import { apiSlice } from "../../app/api/apiSlice";

export const savedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSavedUsers: builder.query({
      query: ({ page, limit, postID }) => {
        return {
          url: `/postsave/${postID}?page=${page}&limit=${limit}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result.isError;
          },
        };
      },
      providesTags: (result, error, arg) => {
        if (result) return [{ type: "PostSave", id: result._id }];
        else return ["PostSave"];
      },
    }),
    getSavedPosts: builder.query({
      query: ({ page, limit, userID }) => {
        return {
          url: `/postsave/user/${userID}?page=${page}&limit=${limit}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result.isError;
          },
        };
      },
      providesTags: (result, error, arg) => {
        if (result) return [{ type: "PostSave", id: result._id }];
        else return ["PostSave"];
      },
    }),
    //May not be updating correctly. Perhaps invalidate entire post
    addNewSave: builder.mutation({
      query: ({ parentPostID, userID }) => ({
        url: `/postsave/${parentPostID}`,
        method: "POST",
        body: { userID },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "PostSave", id: arg._id },
      ],
    }),
    deleteSave: builder.mutation({
      query: ({ parentPostID, userID }) => ({
        url: `/postsave/${parentPostID}`,
        method: "DELETE",
        body: { userID },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "PostSave", id: arg._id },
      ],
    }),
  }),
});

export const {
  useGetSavedPostsQuery,
  useGetSavedUsersQuery,
  useAddNewSaveMutation,
  useDeleteSaveMutation,
} = savedApiSlice;
