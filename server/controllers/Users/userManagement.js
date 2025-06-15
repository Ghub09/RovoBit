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
    const wallet = await Wallet.findOne( {userId} );
    const user = await User.findById(userId);
    if (!user || !wallet) return res.status(404).json({ error: "User not found" });

    await User.findByIdAndDelete(userId);
    await Wallet.findOneAndDelete({ userId });
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

 
// export const updateUserWallets = async (req, res) => {
//   const { userId } = req.params;
//   const { spotWallet, futuresWallet, perpetualsWallet, holdings } = req.body;

//   try {
//     // Validate existence of wallet
//     const wallet = await Wallet.findOne({ userId });
//     if (!wallet) {
//       return res.status(404).json({ message: "Wallets not found for user" });
//     }
//     // Update wallet fields if provided
//     if (typeof spotWallet === "number") wallet.spotWallet = spotWallet;
//     if (typeof futuresWallet === "number") wallet.futuresWallet = futuresWallet;
//     if (typeof perpetualsWallet === "number") wallet.perpetualsWallet = perpetualsWallet;
//     if (Array.isArray(holdings)) wallet.holdings = holdings;

//     await wallet.save();

//     return res.status(200).json({
//       message: "Wallets updated successfully",
//       spotWallet: wallet.spotWallet,
//       futuresWallet: wallet.futuresWallet,
//       perpetualsWallet: wallet.perpetualsWallet,
//       holdings: wallet.holdings,
//     });
//   } catch (error) {
//     console.error("Wallet update error:", error);
//     return res.status(500).json({ message: "Error updating wallet" });
//   }
// };

// export const updateUserWallets = async (req, res) => {
//   const { userId } = req.params;
//   const { spotWallet, futuresWallet, perpetualsWallet, holdings } = req.body;
//    console.log(spotWallet)
//   try {
//   //    if (!adminId) {
//   //   return res.status(400).json({ message: "Admin ID is required" });
//   // }
//     const wallet = await Wallet.findOne({ userId });
//     if (!wallet) {
//       return res.status(404).json({ message: "Wallets not found for user" });
//     }

//     const changes = {
//       spotWallet: [],
//       futuresWallet: [],
//       perpetualsWallet: [],
//     };

//     let isModified = false;

//     // Spot wallet
//     if (wallet.spotWallet !== spotWallet) {
//       changes.spotWallet.push({
//         asset: "USDT",
//         oldValue: wallet.spotWallet,
//         newValue: spotWallet,
//       });
//       wallet.spotWallet = spotWallet;
//       isModified = true;
//     }

//     // Futures wallet
//     if (wallet.futuresWallet !== futuresWallet) {
//       changes.futuresWallet.push({
//         asset: "USDT",
//         oldValue: wallet.futuresWallet,
//         newValue: futuresWallet,
//       });
//       wallet.futuresWallet = futuresWallet;
//       isModified = true;
//     }

//     // Perpetuals wallet
//     if (wallet.perpetualsWallet !== perpetualsWallet) {
//       changes.perpetualsWallet.push({
//         asset: "USDT",
//         oldValue: wallet.perpetualsWallet,
//         newValue: perpetualsWallet,
//       });
//       wallet.perpetualsWallet = perpetualsWallet;
//       isModified = true;
//     }

//     // Holdings — still updates without history logging
//     if (Array.isArray(holdings)) {
//       wallet.holdings = holdings;
//       isModified = true;
//     }

//     if (isModified) {
//       wallet.walletChangeHistory.push({
//         changes,
//          timestamp: new Date(),
//       });

//       await wallet.save();

//       return res.status(200).json({
//         message: "Wallets updated successfully",
//         spotWallet: wallet.spotWallet,
//         futuresWallet: wallet.futuresWallet,
//         perpetualsWallet: wallet.perpetualsWallet,
//         holdings: wallet.holdings,
//         walletChangeHistory: wallet.walletChangeHistory.slice(-1)[0],
//       });
//     } else {
//       return res.status(200).json({ message: "No changes detected" });
//     }

//   } catch (error) {
//     console.error("Wallet update error:", error);
//     return res.status(500).json({ message: "Error updating wallet" });
//   }
// };

export const updateUserWallets = async (req, res) => {
  const { userId } = req.params;
  const { spotWallet, futuresWallet, perpetualsWallet, holdings } = req.body;

  try {
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallets not found for user" });
    }

    const changes = {
      spotWallet: [],
      futuresWallet: [],
      perpetualsWallet: [],
    };

    let isModified = false;

    // 1. Spot Wallet (USDT)
    if (wallet.spotWallet != spotWallet) {
      changes.spotWallet.push({
        asset: "USDT",
        oldValue: wallet.spotWallet,
        newValue: spotWallet,
      });
      wallet.spotWallet = spotWallet;
      isModified = true;
    }

    // 2. Futures Wallet (USDT)
    if (wallet.futuresWallet != futuresWallet) {
      changes.futuresWallet.push({
        asset: "USDT",
        oldValue: wallet.futuresWallet,
        newValue: futuresWallet,
      });
      wallet.futuresWallet = futuresWallet;
      isModified = true;
    }

    // 3. Perpetuals Wallet (USDT)
    if (wallet.perpetualsWallet != perpetualsWallet) {
      changes.perpetualsWallet.push({
        asset: "USDT",
        oldValue: wallet.perpetualsWallet,
        newValue: perpetualsWallet,
      });
      wallet.perpetualsWallet = perpetualsWallet;
      isModified = true;
    }

    // 4. Holdings (coins tracked in spotWallet change history)
    if (Array.isArray(holdings)) {
      const oldHoldingsMap = new Map();
      wallet.holdings.forEach(({ asset, quantity }) => {
        oldHoldingsMap.set(asset, quantity);
      });

      holdings.forEach(({ asset, quantity }) => {
        const oldQty = oldHoldingsMap.get(asset) ?? 0;
        if (oldQty != quantity) {
          changes.spotWallet.push({
            asset,
            oldValue: oldQty,
            newValue: quantity,
          });
          isModified = true;
        }
      });

      wallet.holdings = holdings;
    }

    if (isModified) {
      wallet.walletChangeHistory.push({
        changes,
        timestamp: new Date(),
      });

      await wallet.save();

      return res.status(200).json({
        message: "Wallets updated successfully",
        spotWallet: wallet.spotWallet,
        futuresWallet: wallet.futuresWallet,
        perpetualsWallet: wallet.perpetualsWallet,
        holdings: wallet.holdings,
        walletChangeHistory: wallet.walletChangeHistory.slice(-1)[0],
      });
    } else {
      return res.status(200).json({ message: "No changes detected" });
    }

  } catch (error) {
    console.error("Wallet update error:", error);
    return res.status(500).json({ message: "Error updating wallet" });
  }
};


