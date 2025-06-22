import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  getWallet,
  requestDeposit,
  requestWithdraw,
  getTransactions,
  logoutUser,
  swapCrypto,
} from "../controllers/userController.js";
import {  isUserAuthenticated } from "../middlewares/auth.js";
 const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", isUserAuthenticated, logoutUser);
router.get("/profile", isUserAuthenticated, getProfile);
router.put("/profile", isUserAuthenticated, updateProfile);
router.get("/getwallet", isUserAuthenticated, getWallet);
router.post("/deposit", isUserAuthenticated, requestDeposit);
router.post("/withdraw", isUserAuthenticated, requestWithdraw);
router.get("/transactions", isUserAuthenticated, getTransactions);
router.post("/swap", isUserAuthenticated, swapCrypto);

// Test endpoint to check cookie functionality
router.get("/test-cookie", (req, res) => {
  // Set a test cookie
  res.cookie("test-cookie", "working", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 60000, // 1 minute
  });
  
  // Return info about cookies
  res.json({
    cookieSet: true,
    message: "Test cookie set successfully",
    existingCookies: req.cookies ? Object.keys(req.cookies) : [],
    environment: process.env.NODE_ENV || 'development',
  });
});

export default router;
