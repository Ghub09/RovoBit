// models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: String,       // e.g., 'admin' or user ID
  receiverId: String,     // e.g., user ID or 'admin'
  text: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Messages', messageSchema);