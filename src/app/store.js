import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import displayReducer from "../features/display/displaySlice";
import errorReducer from "../features/error/errorSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    display: displayReducer,
    error: errorReducer,
  },
  devTools: true,
});

store.subscribe(() => {
  const { display } = store.getState();
  localStorage.setItem("theme-setting", display.theme);
});
