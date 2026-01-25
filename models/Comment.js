import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true, index: true },
    text: { type: String, required: true, trim: true },
    author: { type: String, default: "Anonymous", trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
