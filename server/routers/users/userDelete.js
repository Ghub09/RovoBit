// routes/userRoutes.js
import express from "express";
import { deleteUserAndArchive, reactivateUser } from "../../controllers/Users/userDelete.js";
 

const router = express.Router();

// Admin Delete User and Save History
router.delete("/delete/:_id", deleteUserAndArchive);

// Admin Reactivate Deleted User
router.post("/reactivate/:deletedUserId", reactivateUser);

export default router;
