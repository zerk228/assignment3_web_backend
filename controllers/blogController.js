import mongoose from "mongoose";
import Blog from "../models/Blog.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export async function createBlog(req, res) {
  const { title, body, author } = req.body || {};
  if (!title || !body) return res.status(400).json({ error: "title and body are required" });

  const blog = await Blog.create({ title, body, author });
  res.status(201).json(blog);
}

export async function getBlogs(req, res) {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
}

export async function getBlogById(req, res) {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ error: "invalid id" });

  const blog = await Blog.findById(id);
  if (!blog) return res.status(404).json({ error: "not found" });

  res.json(blog);
}

export async function updateBlog(req, res) {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ error: "invalid id" });

  const { title, body, author } = req.body || {};
  const blog = await Blog.findByIdAndUpdate(
    id,
    { ...(title !== undefined ? { title } : {}), ...(body !== undefined ? { body } : {}), ...(author !== undefined ? { author } : {}) },
    { new: true, runValidators: true }
  );

  if (!blog) return res.status(404).json({ error: "not found" });
  res.json(blog);
}

export async function deleteBlog(req, res) {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ error: "invalid id" });

  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) return res.status(404).json({ error: "not found" });

  res.status(204).send();
}
