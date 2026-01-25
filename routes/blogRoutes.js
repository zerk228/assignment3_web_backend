import { Router } from "express";
import {
  createBlog, getBlogs, getBlogById, updateBlog, deleteBlog
} from "../controllers/blogController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

// Public read
router.get("/", getBlogs);
router.get("/:id", getBlogById);

// Admin only write
router.post("/", requireAuth, requireAdmin, createBlog);
router.put("/:id", requireAuth, requireAdmin, updateBlog);
router.delete("/:id", requireAuth, requireAdmin, deleteBlog);

export default router;
