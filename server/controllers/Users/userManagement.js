import mongoose from "mongoose";
import User from "../../models/User.js";
import Trade from "../../models/Trade.js";
import PerpetualTrade from "../../models/PerpetualTrade.js";
import TradeHistory from "../../models/TradeHistory.js";
import DepositWithdrawRequest from "../../models/RequestMessage.js";
import Wallet from "../../models/Wallet.js";

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
export const fetchUserWallets = async (req, res) => {
  const userId = req.params.userId;

  try {
    const wallet = await Wallet.findOne({ userId }); // correct lookup

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found for user" });
    }

    return res.status(200).json({
      message: "User wallet fetched successfully",
      holdings: wallet.holdings,
      spotWallet: wallet.spotWallet,
      futuresWallet: wallet.futuresWallet,
      perpetualsWallet: wallet.perpetualsWallet,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Please retry to fetch all data" });
  }
};

 
export const updateUserWallets = async (req, res) => {
  const { userId } = req.params;
  const { spotWallet, futuresWallet, perpetualsWallet, holdings } = req.body;

  try {
    // Validate existence of wallet
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallets not found for user" });
    }

    // Update wallet fields if provided
    if (typeof spotWallet === "number") wallet.spotWallet = spotWallet;
    if (typeof futuresWallet === "number") wallet.futuresWallet = futuresWallet;
    if (typeof perpetualsWallet === "number") wallet.perpetualsWallet = perpetualsWallet;
    if (Array.isArray(holdings)) wallet.holdings = holdings;

    await wallet.save();

    return res.status(200).json({
      message: "Wallets updated successfully",
      spotWallet: wallet.spotWallet,
      futuresWallet: wallet.futuresWallet,
      perpetualsWallet: wallet.perpetualsWallet,
      holdings: wallet.holdings,
    });
  } catch (error) {
    console.error("Wallet update error:", error);
    return res.status(500).json({ message: "Error updating wallet" });
  }
};



