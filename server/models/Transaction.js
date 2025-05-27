import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["deposit", "withdrawal", "transfer", "swap"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    amount: { type: Number },
    currency: { type: String, enum: ["USDC", "BTC", "ETH", "USDT"] }, 

    // Swap-specific fields
    fromAsset: { type: String, enum: ["USDC", "BTC", "ETH", "USDT"] },
    toAsset: { type: String, enum: ["USDC", "BTC", "ETH", "USDT"] },
    fromAmount: { type: Number },
    toAmount: { type: Number },
    exchangeRate: { type: Number },

    transactionId: { type: String, unique: true },
    adminApproval: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", TransactionSchema);