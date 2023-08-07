import { apiSlice } from "../../app/api/apiSlice";

export const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPost: builder.query({
      query: ({ postID, userID }) => {
        if (userID) {
          return {
            url: `/posts/${postID}?userID=${userID}`,
            validateStatus: (response, result) => {
              return response.status === 200 && !result.isError;
            },
          };
        }
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
      query: ({ page, limit, feedID = "", userID = "", reqID = "" }) => {
        return {
          url: `/posts?page=${page}&limit=${limit}&feedID=${feedID}&userID=${userID}&reqID=${reqID}`,
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
    getTaggedPosts: builder.query({
      query: ({ page, limit, userID }) => {
        return {
          url: `/posts/tagged/${userID}?page=${page}&limit=${limit}`,
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
      invalidatesTags: (result, error, arg) => ["Post"],
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
  useGetTaggedPostsQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApiSlice;
