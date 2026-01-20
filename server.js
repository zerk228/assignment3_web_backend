import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import Blog from "./models/Blog.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

app.post("/blogs", async (req, res) => {
  try {
    const { title, body, author } = req.body || {};
    if (!title || !body)
      return res.status(400).json({ error: "title and body are required" });

    const blog = await Blog.create({ title, body, author });
    return res.status(201).json(blog);
  } catch (e) {
    return res.status(500).json({ error: "database error" });
  }
});

app.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.json(blogs);
  } catch (e) {
    return res.status(500).json({ error: "database error" });
  }
});

app.get("/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ error: "invalid id" });

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "not found" });

    return res.json(blog);
  } catch (e) {
    return res.status(500).json({ error: "database error" });
  }
});

app.put("/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ error: "invalid id" });

    const { title, body, author } = req.body || {};
    if (!title || !body)
      return res.status(400).json({ error: "title and body are required" });

    const blog = await Blog.findByIdAndUpdate(
      id,
      { title, body, author },
      { new: true, runValidators: true }
    );

    if (!blog) return res.status(404).json({ error: "not found" });
    return res.json(blog);
  } catch (e) {
    return res.status(500).json({ error: "database error" });
  }
});

app.delete("/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ error: "invalid id" });

    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) return res.status(404).json({ error: "not found" });

    return res.status(204).send();
  } catch (e) {
    return res.status(500).json({ error: "database error" });
  }
});

app.use((req, res) => res.status(404).json({ error: "route not found" }));

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(process.env.PORT || 3000);
  } catch (e) {
    process.exit(1);
  }
};

start();
