import { createSlice } from "@reduxjs/toolkit";

const displaySlice = createSlice({
  name: "display",
  initialState: { loading: false },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export default displaySlice.reducer;

export const { setLoading } = displaySlice.actions;

export const selectLoadingState = (state) => state.display.loading;
