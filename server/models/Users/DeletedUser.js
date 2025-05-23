// models/DeletedUser.js
import mongoose from "mongoose";

const DeletedUserSchema = new mongoose.Schema({
  originalUserId: { type: mongoose.Schema.Types.ObjectId, required: true },
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  isVerified: Boolean,
  verificationCode: String,
  role: String,
  balanceUSDT: Number,
  depositHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  withdrawalHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  kycDocuments: {
    idFront: String,
    idBack: String,
    uploadedAt: Date,
    verificationStatus: String,
    rejectionReason: String,
  },
  createdAt: Date,
  deletedAt: { type: Date, default: Date.now },
});

export default mongoose.model("DeletedUser", DeletedUserSchema);
    