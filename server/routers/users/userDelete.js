// routes/userRoutes.js
import express from "express";
import { deleteUserAndArchive, getArchivedUsers, reactivateUser } from "../../controllers/Users/userDelete.js";
import { toggleUserStatus } from "./userProfit.js";
 

const router = express.Router();
router.delete("/delete/:_id", deleteUserAndArchive);
router.put("/:id/toggle", toggleUserStatus);
router.get('/users/archived', getArchivedUsers);
router.post('/users/reactivate/:deletedUserId', reactivateUser);

export default router;
