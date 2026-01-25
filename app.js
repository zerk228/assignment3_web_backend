import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";

import blogRoutes from "./routes/blogRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// твой фронт оставляем как было
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRoutes);
app.use("/blogs", blogRoutes);
app.use("/comments", commentRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
