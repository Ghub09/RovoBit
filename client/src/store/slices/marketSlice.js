import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMarketData = createAsyncThunk(
  "market/fetchMarketData",
  async (_, { rejectWithValue }) => {
    try {
      // Detect if user is on iOS/macOS
      const userAgent = navigator.userAgent.toLowerCase();
      const isApple = /(mac|iphone|ipad|ipod)/i.test(userAgent);

      // Use a different configuration for API requests on Apple devices
      const config = {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 100,
          sparkline: true,
        },
        timeout: isApple ? 30000 : 15000, // Longer timeout for Apple devices
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        config
      );

      // Validate the response data
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid market data format received");
      }

      // Process the data to ensure all required fields exist
      const processedData = response.data.map((coin) => ({
        id: coin.id || "",
        symbol: coin.symbol || "",
        name: coin.name || "",
        image: coin.image || "",
        current_price: coin.current_price || 0,
        market_cap: coin.market_cap || 0,
        market_cap_rank: coin.market_cap_rank || 0,
        total_volume: coin.total_volume || 0,
        price_change_percentage_24h: coin.price_change_percentage_24h || 0,
        sparkline_in_7d: coin.sparkline_in_7d || { price: [] },
      }));

      return processedData;
    } catch (error) {
      console.error("Error fetching market data:", error?.message, error?.response);
      return rejectWithValue(error.message || "Failed to fetch market data");
    }
  }
);

// const krakenPairs = ["XBTUSD", "ETHUSD", "DOGEUSD", "MATICUSD", "BNBUSD"];

// export const fetchMarketData = createAsyncThunk(
//   "market/fetchMarketData",
//   async (_, { rejectWithValue }) => {
//     try {
//       const pairString = krakenPairs.join(",");
//       const response = await axios.get(
//         `https://api.kraken.com/0/public/Ticker`,
//         {
//           params: {
//             pair: pairString,
//           },
//           timeout: 15000,
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const data = response.data.result;

//       if (!data || typeof data !== "object") {
//         throw new Error("Invalid response from Kraken");
//       }

//       // Map Kraken's data structure to your expected format
//       const processedData = Object.entries(data).map(([key, value]) => {
//         const symbolMap = {
//           XXBTZUSD: "BTC",
//           XETHZUSD: "ETH",
//           DOGEUSD: "DOGE",
//           MATICUSD: "MATIC",
//           BNBUSD: "BNB",
//         };

//         const symbol = symbolMap[key] || key;

//         return {
//           id: symbol.toLowerCase(),
//           symbol,
//           name: symbol, // Kraken doesn’t provide names directly
//           image: "", // Kraken doesn't provide images
//           current_price: parseFloat(value.c[0]),
//           market_cap: 0, // Kraken doesn't provide this
//           market_cap_rank: 0, // Not available
//           total_volume: parseFloat(value.v[1]), // Last 24h volume
//           price_change_percentage_24h: 0, // Kraken doesn't support this
//           sparkline_in_7d: { price: [] }, // Not available
//         };
//       });

//       return processedData;
//     } catch (error) {
//       console.error("Kraken market fetch error:", error?.message);
//       return rejectWithValue(error.message || "Failed to fetch market data from Kraken");
//     }
//   }
// );
const marketSlice = createSlice({
  name: "market",
  initialState: {
    coins: [],
    status: "idle",
    error: null,
    searchTerm: "",
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMarketData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.coins = action.payload;
      })
      .addCase(fetchMarketData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setSearchTerm } = marketSlice.actions;
export default marketSlice.reducer;
