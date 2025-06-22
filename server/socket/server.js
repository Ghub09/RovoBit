// server.js or index.js (your main backend entry file)
import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Server } from "socket.io"; // <-- important
import app from "../app.js"; // Adjust path to your Express app
import Message from "./models/Message.js"; // Adjust path to schema

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Create server and Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
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
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true, // Allow compatibility with Socket.IO v2 clients
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("✅ 😍  User connected:", socket.id);

  socket.on("send_message", async (data) => {
    try {
      const savedMessage = await Message.create(data);
      io.emit("receive_message", savedMessage);
    } catch (error) {
      console.error("❌ Error saving message:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` 👌 Server running on port ${PORT}, frontend: ${process.env.FRONTEND_URL}`);
});
