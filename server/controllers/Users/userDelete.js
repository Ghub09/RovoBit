// controllers/userController.js
import mongoose from "mongoose";
import User from "../../models/User.js";
import Trade from "../../models/Trade.js";
import PerpetualTrade from "../../models/PerpetualTrade.js";
import TradeHistory from "../../models/TradeHistory.js";
import DepositWithdrawRequest from "../../models/RequestMessage.js";
 

const tableModelMap = {
  DW: Trade, // Spot Trades
  TP: PerpetualTrade,
  TS: TradeHistory,
  DM: DepositWithdrawRequest,
};

export const deleteUserHistoryByUserId = async (userId) => {
  try {
    await Promise.all([
      tableModelMap.DW.deleteMany({ userId }),
      tableModelMap.TP.deleteMany({ userId }),
      tableModelMap.TS.deleteMany({ userId }),
      tableModelMap.DM.deleteMany({ userId }),
    ]);
    return { success: true, message: "User trade and request history deleted" };
  } catch (error) {
    console.error("❌ Failed to delete user history:", error);
    return { success: false, message: "Failed to delete user history", error };
  }
};
export const deleteUserAndArchive = async (req, res) => {
  const userId = req.params._id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  deleteUserHistoryByUserId(userId)
  .then((result) => {
    console.log("User history deletion result:", result);
  })
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: "User deleted and archived" });
  } catch (err) {
    console.error("❌ Delete Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};