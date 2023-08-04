import { createSlice } from "@reduxjs/toolkit";

const displaySlice = createSlice({
  name: "display",
  initialState: { loading: false },
  reducers: {
    setLoading: (state, action) => {
      return (state.loading = action.loading);
    },
  },
});

export default displaySlice.reducer;

export const { setLoading } = displaySlice.actions;

export const selectLoadingState = (state) => state.display.loading;
