import jwt from "jsonwebtoken";
import User from "../models/User.js";

function signToken(userId) {
  return jwt.sign(
    { sub: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

export async function register(req, res) {
  const { email, password, role } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email and password are required" });
  console.log('111111111111111111111')
  // Разрешаем роль только если явно указано admin (для тестов). На защите объяснишь, что в реальном проекте это запрещают.
  const user = await User.create({ email, password, role: role === "admin" ? "admin" : "user" });
  
  res.status(201).json({ id: user._id, email: user.email, role: user.role });
}

export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email and password are required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken(user._id.toString());
  res.json({ token, role: user.role });
}
