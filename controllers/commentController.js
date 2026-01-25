import mongoose from "mongoose";
import Comment from "../models/Comment.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export async function createComment(req, res) {
  const { blogId, text, author } = req.body || {};
  if (!blogId || !text) return res.status(400).json({ error: "blogId and text are required" });
  if (!isValidObjectId(blogId)) return res.status(400).json({ error: "invalid blogId" });

  const comment = await Comment.create({ blogId, text, author });
  res.status(201).json(comment);
}

export async function getComments(req, res) {
  const { blogId } = req.query;
  const filter = blogId ? { blogId } : {};
  const comments = await Comment.find(filter).sort({ createdAt: -1 });
  res.json(comments);
}

export async function getCommentById(req, res) {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ error: "invalid id" });

  const comment = await Comment.findById(id);
  if (!comment) return res.status(404).json({ error: "not found" });

  res.json(comment);
}

export async function updateComment(req, res) {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ error: "invalid id" });

  const { text, author } = req.body || {};
  const comment = await Comment.findByIdAndUpdate(
    id,
    { ...(text !== undefined ? { text } : {}), ...(author !== undefined ? { author } : {}) },
    { new: true, runValidators: true }
  );

  if (!comment) return res.status(404).json({ error: "not found" });
  res.json(comment);
}

export async function deleteComment(req, res) {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ error: "invalid id" });

  const comment = await Comment.findByIdAndDelete(id);
  if (!comment) return res.status(404).json({ error: "not found" });

  res.status(204).send();
}
