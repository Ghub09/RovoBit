// routes/userRoutes.js
import express from "express";
import { deleteUserAndArchive, getArchivedUsers, reactivateUser } from "../../controllers/Users/userDelete.js";
 

const router = express.Router();

// Admin Delete User and Save History
router.delete("/delete/:_id", deleteUserAndArchive);

router.get('/users/archived', getArchivedUsers);
router.post('/users/reactivate/:deletedUserId', reactivateUser);
export default router;
