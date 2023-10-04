import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import displayReducer from "../features/display/displaySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    display: displayReducer,
  },
  devTools: true,
});
