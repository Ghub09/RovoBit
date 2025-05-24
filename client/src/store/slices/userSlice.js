import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api.js";
import { toast } from "react-toastify";
import { setLoading } from "./globalSlice.js";

// Async thunk for logging in
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      const response = await API.post("/user/login", { email, password });
      console.log(response);

      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success(response.data.message);

      return response.data;
    } catch (error) {
      toast.error(JSON.stringify(error.response.data.message));
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  }
);


// Async thunk for registering
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, password, firstName, lastName },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(setLoading(true));

      const response = await API.post("/user/register", {
        email,
        password,
        firstName,
        lastName,
      });
      toast.success(response.data.message);
      // Store user data in local storage
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      toast.error(JSON.stringify(error.response.data.message));
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false)); // Stop loading after request
    }
  }
);

// Async thunk for logging out
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      await API.post("/user/logout", {});
      // Remove user data from local storage
      localStorage.removeItem("user");
      toast.success("User logged out successfully");
      return {};
    } catch (error) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false)); // Stop loading after request
    }
  }
);
export const logoutAdmin = createAsyncThunk(
  "user/logoutUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      await API.post("/admin/logout", {});
      // Remove user data from local storage
      localStorage.removeItem("user");
      toast.success("Admin logged out successfully");
      return {};
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false)); // Stop loading after request
    }
  }
);

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
};

// User slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { setUser, clearUser } = userSlice.actions;

// Simple logout action creator that dispatches the logoutUser thunk
export const logout = () => (dispatch) => {
  return dispatch(logoutUser());
};

export default userSlice.reducer;
