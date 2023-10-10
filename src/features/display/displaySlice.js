import { createSlice } from "@reduxjs/toolkit";

const determineInitialTheme = () => {
  const localTheme = localStorage.getItem("theme-setting");
  if (
    localTheme &&
    (localTheme === "theme-light" || localTheme === "theme-dark")
  ) {
    return localTheme;
  } else {
    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "theme-dark"
      : "theme-light";

    return preferredTheme;
  }
};

const initialState = {
  loading: false,
  theme: determineInitialTheme(),
};

const displaySlice = createSlice({
  name: "display",
  initialState,
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
