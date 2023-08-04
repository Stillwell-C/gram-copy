import { apiSlice } from "../../app/api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (userID) => {
        return {
          url: `/users/${userID}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result.isError;
          },
        };
      },
      providesTags: (result, error, arg) => {
        if (result) return [{ type: "User", id: result._id }];
        else return ["User"];
      },
    }),
    addNewUser: builder.mutation({
      query: (userData) => ({
        url: "/users",
        method: "POST",
        body: {
          ...userData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg._id }],
    }),
    updateUser: builder.mutation({
      query: (userData) => ({
        url: "/users",
        method: "PATCH",
        body: {
          ...userData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg._id }],
    }),
    deleteUser: builder.mutation({
      query: ({ id, adminPassword }) => ({
        url: "/users",
        method: "DELETE",
        body: { id, adminPassword },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg._id }],
    }),
  }),
});

export const {
  useGetUserQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;
