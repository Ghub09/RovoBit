// controllers/userController.js
import mongoose from "mongoose";
import User from "../../models/User.js";
import DeletedUser from "../../models/Users/DeletedUser.js";
  
export const deleteUserAndArchive = async (req, res) => {
  const userId = req.params._id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    await DeletedUser.create({
      originalUserId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      isVerified: user.isVerified,
      verificationCode: user.verificationCode,
      role: user.role,
      balanceUSDT: user.balanceUSDT,
      depositHistory: user.depositHistory,
      withdrawalHistory: user.withdrawalHistory,
      kycDocuments: user.kycDocuments,
      createdAt: user.createdAt,
    });
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: "User deleted and archived" });
  } catch (err) {
    console.error("❌ Delete Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// REACTIVATE USER
export const reactivateUser = async (req, res) => {
  const { deletedUserId } = req.params;

  try {
    const archivedUser = await DeletedUser.findById(deletedUserId);
    if (!archivedUser) return res.status(404).json({ message: "Archived user not found" });

    // Restore user
    const restoredUser = await User.create({
      firstName: archivedUser.firstName,
      lastName: archivedUser.lastName,
      email: archivedUser.email,
      password: archivedUser.password,
      isVerified: archivedUser.isVerified,
      verificationCode: archivedUser.verificationCode,
      role: archivedUser.role,
      balanceUSDT: archivedUser.balanceUSDT,
      depositHistory: archivedUser.depositHistory,
      withdrawalHistory: archivedUser.withdrawalHistory,
      kycDocuments: archivedUser.kycDocuments,
      createdAt: archivedUser.createdAt,
    });

    // Remove from archive
    await archivedUser.deleteOne();

    return res.status(200).json({ message: "User reactivated successfully", user: restoredUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
