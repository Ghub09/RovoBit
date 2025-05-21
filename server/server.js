import http from "http";
import { Server } from "socket.io";
import WebSocket from "ws";
import axios from "axios";
import dotenv from "dotenv";
import app from "./app.js";
import {
  checkLiquidations,
  checkExpiredTrades,
} from "./controllers/futuresTradeController.js";

dotenv.config();

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server for real-time updates
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL, "https://cryptonexus.live"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });

  socket.on("placeOrder", (data) => {
    io.emit("tradeUpdate", data);
  });
});

export { io };

export const emitTradeUpdate = (trade) => {
  io.emit("tradeUpdate", trade);
};

// Market prices storage
const marketPrices = {};

// 🔥 WebSocket: Connect to CryptoCompare (Avoid Binance Rate Limits)
let ws;
const connectWebSocket = () => {
  try {
    const tradingPairs = [
      "BTC-USD",
      "ETH-USD",
      "BNB-USD",
      "SOL-USD",
      "XRP-USD",
      "ADA-USD",
      "DOGE-USD",
      "MATIC-USD",
      "DOT-USD",
      "LTC-USD",
    ];
    const subs = tradingPairs.map(
      (pair) => `5~CCCAGG~${pair.replace("-", "~")}~USD`
    );

    ws = new WebSocket("wss://streamer.cryptocompare.com/v2");

    ws.onopen = () => {
      console.log("🔗 Connected to CryptoCompare WebSocket");

      ws.send(
        JSON.stringify({
          action: "SubAdd",
          subs,
          api_key: process.env.CRYPTOCOMPARE_API_KEY,
        })
      );
    };

    ws.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.TYPE === "5" && data.PRICE) {
          const pair = `${data.FROMSYMBOL}USDT`;
          const price = parseFloat(data.PRICE);

          console.log(`📈 Market price update for ${pair}: ${price}`);

          marketPrices[pair] = price;
          io.emit("marketPriceUpdate", { pair, price });

          await checkLiquidations(marketPrices);
        }
      } catch (error) {
        console.error("⚠️ Error processing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ CryptoCompare WebSocket Error:", error.message);
    };

    ws.onclose = () => {
      console.warn("⚠️ WebSocket disconnected. Reconnecting in 5 seconds...");
      setTimeout(connectWebSocket, 5000);
    };
  } catch (error) {
    console.error("❌ Failed to connect WebSocket:", error.message);
  }
};
// Start WebSocket connection
connectWebSocket();

// 🛠️ Fallback: REST API Fetch Every 30 Seconds (In Case WebSocket Fails)
const fetchMarketPrices = async () => {
  try {
    const response = await axios.get(
      "https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,BNB,SOL,XRP,ADA,DOGE,MATIC,DOT,LTC&tsyms=USDT"
    );

    if (response.data) {
      Object.keys(response.data).forEach((symbol) => {
        marketPrices[`${symbol}USDT`] = parseFloat(response.data[symbol].USDT);
      });

      await checkLiquidations(marketPrices);
    }
  } catch (error) {
    console.error("⚠️ Error fetching market prices:", error.message);
  }
};
setInterval(fetchMarketPrices, 30000);

// Run liquidation checks every 30 seconds
setInterval(async () => {
  console.log("🔄 Running periodic liquidation check...");
  await checkLiquidations(marketPrices);
}, 30000);

// Run expired trades check every minute
setInterval(async () => {
  console.log("⏱️ Checking for expired trades...");
  await checkExpiredTrades();
}, 60000);

console.log("process.env.PORT----", process.env.PORT);
// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}, frontend: ${process.env.FRONTEND_URL}`
  );
});
