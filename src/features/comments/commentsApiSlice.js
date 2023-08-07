import { apiSlice } from "../../app/api/apiSlice";

export const commentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getComment: builder.query({
      query: (commentID) => {
        return {
          url: `/comments/${commentID}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result.isError;
          },
        };
      },
      providesTags: (result, error, arg) => {
        if (result) return [{ type: "Comment", id: result._id }];
        else return ["Comment"];
      },
    }),
    getPostComments: builder.query({
      query: ({ postID, ...args }) => {
        const queryArr = [];
        for (const [key, value] of Object.entries(args)) {
          queryArr.push(`${key}=${value}`);
        }
        const queryString = queryArr.join("&");
        if (queryString.length) {
          return {
            url: `/comments/post/${postID}?${queryString}`,
            validateStatus: (response, result) => {
              return response.status === 200 && !result.isError;
            },
          };
        }
        return {
          url: `/comments/post/${postID}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result.isError;
          },
        };
      },
      providesTags: (result, error, arg) => {
        if (result?.comments) {
          return [
            { type: "Comment", id: "LIST" },
            ...result.comments.map(({ _id }) => ({ type: "Comment", id: _id })),
          ];
        } else {
          return [{ type: "Comment", id: "LIST" }];
        }
      },
    }),
    addNewComment: builder.mutation({
      query: (commentData) => ({
        url: "/comments",
        method: "POST",
        body: { ...commentData },
      }),
      invalidatesTags: (result, error, arg) => ["Comment"],
    }),
    deleteComment: builder.mutation({
      query: ({ id }) => ({
        url: "/comments",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Comment", id: arg._id },
      ],
    }),
  }),
});

export const {
  useGetCommentQuery,
  useGetPostCommentsQuery,
  useAddNewCommentMutation,
  useDeleteCommentMutation,
} = commentsApiSlice;
