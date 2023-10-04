import { createSlice } from "@reduxjs/toolkit";

const errorSlice = createSlice({
  name: "error",
  initialState: { error: false, errorMessage: "", errorRefreshPage: false },
  reducers: {
    setError: (state, action) => {
      return { ...state, error: action.payload };
    },
    setErrorMessage: (state, action) => {
      return { ...state, errorMessage: action.payload };
    },
    setErrorRefreshPage: (state, action) => {
      return { ...state, errorRefreshPage: action.payload };
    },
  },
});

export default errorSlice.reducer;

export const { setError, setErrorMessage, setErrorRefreshPage } =
  errorSlice.actions;

export const selectError = (state) => state.error.error;

export const selectErrorMessage = (state) => state.error.errorMessage;

export const selectErrorRefreshPage = (state) => state.error.errorRefreshPage;
