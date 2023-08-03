import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { token: null },
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken } = action.payload;
      return { ...state, token: accessToken };
    },
    setCredentialsLoading: (state, action) => {
      const credentialsLoading = action.payload;
      return { ...state, credentialsLoading };
    },
    logOut: (state, action) => {
      return { ...state, token: null };
    },
  },
});

export const { setCredentials, setCredentialsLoading, logOut } =
  authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;

export const selectCredentialsLoading = (state) =>
  state.auth.credentialsLoading;
