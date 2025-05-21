import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,  // Centralized loading state
  showChart: false, // State for toggling chart visibility
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setShowChart: (state, action) => {
      state.showChart = action.payload;
    },
  },
});

export const { setLoading, setShowChart } = globalSlice.actions;
export default globalSlice.reducer;
