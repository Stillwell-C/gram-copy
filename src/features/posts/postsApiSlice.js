import { apiSlice } from "../../app/api/apiSlice";

export const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPost: builder.query({
      query: ({ postID }) => {
        return {
          url: `/posts/${postID}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result.isError;
          },
        };
      },
      providesTags: (result, error, arg) => {
        if (result) return [{ type: "Post", id: result._id }];
        else return ["Post"];
      },
    }),
    getMultiplePosts: builder.query({
      query: ({ page, limit, feedID = "", userID = "" }) => {
        return {
          url: `/posts?page=${page}&limit=${limit}&feedID=${feedID}&userID=${userID}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result.isError;
          },
        };
      },
      providesTags: (result, error, arg) => {
        if (result?.posts) {
          return [
            { type: "Post", id: "LIST" },
            ...result.posts.map(({ _id }) => ({ type: "Post", id: _id })),
          ];
        } else {
          return [{ type: "Post", id: "LIST" }];
        }
      },
    }),
    addNewPost: builder.mutation({
      query: (postData) => ({
        url: "/posts",
        method: "POST",
        body: {
          ...postData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg._id }],
    }),
    updatePost: builder.mutation({
      query: (postData) => ({
        url: "/posts",
        method: "PATCH",
        body: {
          ...postData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg._id }],
    }),
    deletePost: builder.mutation({
      query: ({ id }) => ({
        url: "/posts",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg._id }],
    }),
  }),
});

export const {
  useGetPostQuery,
  useGetMultiplePostsQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApiSlice;
