import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api";
import { toast } from "react-toastify";
import { setLoading } from "./globalSlice";

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await API.get("/admin/all-users");

      return response.data.users;
    } catch (error) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false)); // Stop loading after request
    }
  }
);

// Async thunk for fetching transactions
export const fetchRequests = createAsyncThunk(
  "admin/fetchRequests",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      const response = await API.get("/admin/all-requests");

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false)); // Stop loading after request
    }
  }
);

// Async thunk for approving a transaction
export const addTokens = createAsyncThunk(
  "admin/addTokens",
  async ({ amount, currency, userId }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      const response = await API.post(`/admin/user/add-tokens`, {
        amount,
        currency,
        userId,
      });
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.response.data);
      
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false)); // Stop loading after request
    }
  }
);

// Async thunk for rejecting a transaction
export const approveWithDrawRequest = createAsyncThunk(
  "admin/approve-withdraw",
  async (requestId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      const response = await API.put(
        `/admin/approve-withdraw/${requestId}`,
        null
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false)); // Stop loading after request
    }
  }
);

// Async thunk for rejecting a transaction
export const rejectTransaction = createAsyncThunk(
  "admin/rejectTransaction",
  async (requestId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      const response = await API.put(`/admin/reject/${requestId}`, null);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false)); // Stop loading after request
    }
  }
);

// Async thunk for changing the status of a withdrawal request
export const changeWithdrawRequestStatus = createAsyncThunk(
  "admin/changeWithdrawRequestStatus",
  async (requestId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      const response = await API.put(`/admin/change-status/${requestId}`, null);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false)); // Stop loading after request
    }
  }
);
export const fetchOpenTrades = createAsyncThunk(
  "admin/fetchOpenTrades",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await API.get("/admin/open-trades");
      
      return response.data.trades;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(
        error.response?.data || "Failed to fetch open trades"
      );
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Liquidate a trade
export const liquidateTrade = createAsyncThunk(
  "admin/liquidateTrade",
  async ({tradeId, marketPrice,amount, type}, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await API.post(`/admin/liquidate-trade/${tradeId}`,{marketPrice,type,amount});
      toast.success(response.data.message);
      return { tradeId };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to liquidate trade");
      return rejectWithValue(error.response?.data);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    transactions: [],
    openTrades: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTokens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTokens.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = state.transactions.filter(
          (tx) => tx._id !== action.meta.arg
        );
      })
      .addCase(addTokens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(rejectTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = state.transactions.filter(
          (tx) => tx._id !== action.meta.arg
        );
      })
      .addCase(rejectTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(changeWithdrawRequestStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeWithdrawRequestStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = state.transactions.map((tx) =>
          tx._id === action.meta.arg ? { ...tx, status: "approved" } : tx
        );
      })
      .addCase(changeWithdrawRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOpenTrades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpenTrades.fulfilled, (state, action) => {
        state.loading = false;
        state.openTrades = action.payload;
      })
      .addCase(fetchOpenTrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(liquidateTrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(liquidateTrade.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the liquidated trade from state
        state.openTrades = state.openTrades.filter(
          (trade) => trade._id !== action.payload.tradeId
        );
      })
      .addCase(liquidateTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
