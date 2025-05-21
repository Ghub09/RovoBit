import express from "express";

import {
  getUserRequests,
  getAllRequests,
  rejectRequest,
  getAllUsers,
  addTokens,
  approveWithDrawRequest,
  changeWithdrawRequeststatus,
} from "../controllers/depositWithdrawController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";
import { logoutAdmin } from "../controllers/userController.js";
import { approveOrder, fetchOpenTrades, liquidateTrade, rejectOrder } from "../controllers/adminController.js";

const router = express.Router();

router.post('/logout', isAdminAuthenticated, logoutAdmin);
router.get("/user-requests", getUserRequests);
router.get("/all-requests", getAllRequests);
router.get('/all-users', isAdminAuthenticated, getAllUsers);
router.post("/user/add-tokens", isAdminAuthenticated, addTokens);
router.put("/approve-withdraw/:requestId", isAdminAuthenticated, approveWithDrawRequest);
router.put("/change-status/:requestId", isAdminAuthenticated, changeWithdrawRequeststatus);
router.put("/reject/:requestId", isAdminAuthenticated, rejectRequest);
router.put("/approve-order/:orderId", isAdminAuthenticated, approveOrder);
router.put("/reject-order/:orderId", isAdminAuthenticated, rejectOrder);
router.get("/open-trades", isAdminAuthenticated, fetchOpenTrades);
router.post("/liquidate-trade/:tradeId", isAdminAuthenticated, liquidateTrade);

export default router;
 