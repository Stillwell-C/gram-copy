// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// // import { setCredentials } from "../../features/auth/authSlice";

// const baseQuery = fetchBaseQuery({
//   baseUrl: "http://localhost:3500",
//   credentials: "include",
//   prepareHeaders: (headers, { getState }) => {
//     //If need to send any other info, maybe using this technique
//     const token = getState().auth?.token;

//     if (token) {
//       headers.set("authorization", `Bearer ${token}`);
//     }

//     return headers;
//   },
// });

// const baseQueryWithReauth = async (args, api, extraOptions) => {
//   //Args - should give request url including any queries
//   //Api - api methods such as dispatch, getState etc
//   //extra - any custom options

//   let result = await baseQuery(args, api, extraOptions);

//   //JWT middleware has detected expired token
//   //Additional error codes can also be handled potentially
//   if (result?.error?.status === 403) {
//     const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

//     if (refreshResult?.data) {
//       //Set credentials with new token, just like in login
//       // api.dispatch(setCredentials({ ...refreshResult.data }));

//       //Attempt original query with new token
//       result = await baseQuery(args, api, extraOptions);
//     } else {
//       //Refresh token has been found to be expired by refresh endpoint
//       if (refreshResult?.error?.status === 403) {
//         refreshResult.error.data.message =
//           "Login expired. Please log in again.";
//       }
//       return refreshResult;
//     }
//   }

//   return result;
// };

// export const apiSlice = createApi({
//   baseQuery: baseQueryWithReauth,
//   tagTypes: ["User", "Post", "Comment", "Follow", "PostLike", "PostSave"],
//   endpoints: (builder) => ({}),
// });
