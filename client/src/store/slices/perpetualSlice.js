import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api";
import { toast } from "react-toastify";
import { setLoading } from "./globalSlice";

// Open Perpetual Trade
export const openPerpetualTrade = createAsyncThunk(
  "perpetual/openTrade",
  async (tradeData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      const response = await API.post("/perpetual/open", tradeData, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      return response.data.trade;
    } catch (error) {
      // console.log(error.response.data);
      
      toast.error(error.response?.data?.message || "Failed to open trade");
      return rejectWithValue(error.response?.data);
    } finally {
      dispatch(setLoading(false)); // Stop loading after request
    }
  }
);

// Close Perpetual Trade
export const closePerpetualTrade = createAsyncThunk(
  "perpetual/closeTrade",
  async ({ tradeId, closePrice }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      console.log("closeTradeId,marketPrice",tradeId,closePrice)
      const response = await API.post(
        "/perpetual/close",
        { tradeId, closePrice },
        { withCredentials: true }
      );
      toast.success("Perpetual trade closed successfully!"); 
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to close trade");
      return rejectWithValue(error.response?.data);
    } finally {
      dispatch(setLoading(false)); // Stop loading after request
    }
  }
);

// Get Open Positions
export const fetchOpenPerpetualTrades = createAsyncThunk(
  "perpetual/fetchOpenTrades",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      const response = await API.get("/perpetual/open-positions", {
        withCredentials: true,
      });

      return response.data.trades;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    } finally {
      dispatch(setLoading(false)); // Stop loading after request
    }
  }
);

// Fetch History Trades
export const fetchPerpetualTradesHistory = createAsyncThunk(
  "perpetual/fetchHistoryTrades",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      const response = await API.get("/perpetual/history", {
        withCredentials: true,
      });

      return response.data.trades;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    } finally {
      dispatch(setLoading(false)); // Stop loading after request
    }
  }
);

const perpetualSlice = createSlice({
  name: "perpetual",
  initialState: {
    openTrades: [],
    perpetualsHistoryTrades: [], // Add historyTrades to the initial state
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(openPerpetualTrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(openPerpetualTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.openTrades.push(action.payload);
      })
      .addCase(openPerpetualTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to open trade";
      })
      .addCase(closePerpetualTrade.pending, (state) => {
        state.loading = true;
      })
      .addCase(closePerpetualTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.openTrades = state.openTrades.filter(
          (trade) => trade._id !== action.payload.tradeId
        );
      })
      .addCase(closePerpetualTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to close trade";
      })
      .addCase(fetchOpenPerpetualTrades.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOpenPerpetualTrades.fulfilled, (state, action) => {
        state.loading = false;
        state.openTrades = action.payload;
      })
      .addCase(fetchOpenPerpetualTrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch trades";
      })
      .addCase(fetchPerpetualTradesHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPerpetualTradesHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.perpetualsHistoryTrades = action.payload;
      })
      .addCase(fetchPerpetualTradesHistory.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch history trades";
      });
  },
});

export default perpetualSlice.reducer;
