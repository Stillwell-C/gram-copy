// import { apiSlice } from "../../app/api/apiSlice";
// import { setLoading } from "../display/displaySlice";
// import { logOut, setCredentials } from "./authSlice";

// export const authApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     login: builder.mutation({
//       query: (credentials) => ({
//         url: "/auth",
//         method: "POST",
//         body: { ...credentials },
//       }),
//     }),
//     //Is it better to keep as a mutation or chagne to query & handle logic in persist login?
//     refresh: builder.mutation({
//       query: () => ({
//         url: "auth/refresh",
//         method: "GET",
//       }),
//       async onQueryStarted(arg, { dispatch, queryFulfilled }) {
//         const response = await queryFulfilled;
//         //Get access token from response
//         const { accessToken } = response.data;
//         dispatch(setCredentials({ accessToken }));
//       },
//     }),
//     sendLogout: builder.mutation({
//       query: () => ({
//         url: "/auth/logout",
//         method: "POST",
//       }),
//       async onQueryStarted(arg, { dispatch, queryFulfilled }) {
//         try {
//           dispatch(setLoading(true));
//           await queryFulfilled;
//           dispatch(logOut());
//           dispatch(apiSlice.util.resetApiState());
//           // localStorage.setItem("persistLogin", JSON.stringify(false));
//           dispatch(setLoading(false));
//         } catch (err) {
//           console.log(err);
//           dispatch(setLoading(false));
//         }
//       },
//     }),
//   }),
// });

// export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } =
//   authApiSlice;
