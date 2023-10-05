import { createSlice } from "@reduxjs/toolkit";

const displaySlice = createSlice({
  name: "display",
  initialState: { loading: false },
  reducers: {
    setLoading: (state, action) => {
      return { ...state, loading: action.payload };
    },
    setTheme: (state, action) => {
      return { ...state, theme: action.payload };
    },
  },
});

export default displaySlice.reducer;

export const { setLoading, setTheme } = displaySlice.actions;

export const selectLoadingState = (state) => state.display.loading;

export const selectThemeState = (state) => state.display.theme;
