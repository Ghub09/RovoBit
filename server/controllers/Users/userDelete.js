import mongoose from "mongoose";
import User from "../../models/User.js";
import Trade from "../../models/Trade.js";
import PerpetualTrade from "../../models/PerpetualTrade.js";
import TradeHistory from "../../models/TradeHistory.js";
import DepositWithdrawRequest from "../../models/RequestMessage.js";

export const deleteUserHistoryByUserId = async (userId) => {
  try {
    const userIdString = userId.toString();
    const userIdObject = new mongoose.Types.ObjectId(userId);

    const result = await Promise.all([
    
      Trade.deleteMany({ userId: userIdString }),

    
      PerpetualTrade.deleteMany({ userId: userIdObject }),

    
      TradeHistory.deleteMany({ userId: userIdString }),

    
      DepositWithdrawRequest.deleteMany({ userId: userIdString }),
    ]);

    const counts = {
      trades: result[0].deletedCount,
      perpetuals: result[1].deletedCount,
      histories: result[2].deletedCount,
      requests: result[3].deletedCount,
    };

    console.log("✅ Deleted documents:", counts);
    return {
      success: true,
      message: "User trade and request history deleted",
      counts,
    };
  } catch (error) {
    console.error("❌ Failed to delete user history:", error);
    return {
      success: false,
      message: "Failed to delete user history",
      error,
    };
  }
};

export const deleteUserAndArchive = async (req, res) => {
  const userId = req.params._id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }


  const deleteHistoryResult = await deleteUserHistoryByUserId(userId);
  console.log("User history deletion result:", deleteHistoryResult);

  if (!deleteHistoryResult.success) {
    return res.status(500).json({ error: "Failed to delete user history", details: deleteHistoryResult.error });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: "User deleted and history cleaned up", history: deleteHistoryResult.counts });
  } catch (err) {
    console.error("❌ Delete Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
