// routes/userRoutes.js
import express from "express";
import { deleteUserAndArchive } from "../../controllers/Users/userDelete.js";
import { toggleUserStatus } from "./userProfit.js";
 

const router = express.Router();
router.delete("/delete/:_id", deleteUserAndArchive);
router.put("/:id/toggle", toggleUserStatus);

export default router;
