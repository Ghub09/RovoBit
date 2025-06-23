import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import { dbConnection } from "./config/dbConnection.js";
import { dirname } from "node:path";
import { join } from "path";
import { fileURLToPath } from "url";
import fileUpload from "express-fileupload";
import userRouter from "./routers/userRoutes.js";
import tradeRouter from "./routers/tradeRoutes.js";
import adminRouter from "./routers/adminRoutes.js";
import depositWithdrawRouter from "./routers/depositWithdrawRoutes.js";
import futuresTradeRouter from "./routers/futuresTradeRoutes.js";
import perpetualTradeRouter from "./routers/perpetualRoutes.js";
import walletRouter from "./routers/walletRoutes.js";
import kycRouter from "./routers/kycRoutes.js";
import newsRouter from "./routers/newsRoutes.js";
import userManagement from "./routers/users/userManagement.js";
 
import { safariCompatibilityMiddleware } from "./middlewares/safariCompatibility.js";
import path from "node:path";
 
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, "/config/config.env");

config({ path: envPath });

// Enhanced CORS configuration for Socket.IO compatibility
app.use(
  cors({
    origin: function(origin, callback) {
      // Define allowed origins
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000", 
        "https://ufxbit.com",
        ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
        ...(process.env.ADDITIONAL_ORIGINS ? process.env.ADDITIONAL_ORIGINS.split(',') : [])
      ];
      
      // If no origin (like from a direct HTTP request) or the origin is in allowedOrigins
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("Blocked origin:", origin);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Cache-Control",
      "Pragma",
      "Expires",
      "apikey",
      "X-Client-Info",
      "accept-profile",
      "Device-Key",
      "Api-Key",
    ],
    exposedHeaders: ["Date", "Content-Length", "ETag", "X-Auth", "Set-Cookie"],
    optionsSuccessStatus: 200, // Use 200 instead of 204 for Safari compatibility
    preflightContinue: false,
    maxAge: 86400, // 24 hours
  })
);

// Special handling for socket.io preflight requests
app.options('/socket.io/*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.sendStatus(200);
});

// Debug CORS issues - add this right after the special handling for socket.io preflight requests
app.get('/socket.io/debug-cors', (req, res) => {
  res.json({
    message: "CORS check for Socket.IO",
    origin: req.headers.origin || 'No origin header',
    headers: {
      'Access-Control-Allow-Origin': req.headers.origin || '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Credentials': 'true',
    }
  });
});

app.get("/", (req, res) => {
  res.send("Welcome to  UFXbit Trading API");
})
// Handle OPTIONS requests explicitly for Safari
// app.get('*', (req, res) => {
//   // console.log('Checking path:', path.join(__dirname, '../client/dist/index.html'));
//   res.sendFile(path.join(__dirname, ".././client/dist/index.html"));
// });

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// app.use(fileUpload({ useTempFiles: true, tempFileDir: "/temp/" }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(process.cwd(), "tmp"), // or __dirname + '/tmp'
  })
);

// Apply Safari compatibility middleware before routes
app.use(safariCompatibilityMiddleware);
app.use("/api/user", userRouter);
app.use("/api/account", userManagement)
app.use("/api/trade", tradeRouter);
app.use("/api/admin", adminRouter);
app.use("/api/funds", depositWithdrawRouter);
app.use("/api/futures", futuresTradeRouter);
app.use("/api/perpetual", perpetualTradeRouter);
app.use("/api/kyc", kycRouter);
app.use("/api/news", newsRouter);

// Wallet routes
app.use("/api/wallet", walletRouter);

dbConnection();

export default app;
