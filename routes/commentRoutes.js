import { Router } from "express";
import {
  createComment, getComments, getCommentById, updateComment, deleteComment
} from "../controllers/commentController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

// Public read
router.get("/", getComments);
router.get("/:id", getCommentById);

// Admin only write
router.post("/", requireAuth, requireAdmin, createComment);
router.put("/:id", requireAuth, requireAdmin, updateComment);
router.delete("/:id", requireAuth, requireAdmin, deleteComment);

export default router;
