import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Activity from "../models/Activity.js";
import config from "../config/config.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, territory, phone, whatsappNumber } =
      req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with that email" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "sales_officer",
      territory: territory || "",
      phone: phone || "",
      whatsappNumber: whatsappNumber || "",
    });

    await Activity.create({
      user: user._id,
      type: "user_login",
      title: "New user registered",
      description: `${user.name} registered as ${user.role}`,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      territory: user.territory,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    await Activity.create({
      user: user._id,
      type: "user_login",
      title: "User logged in",
      description: `${user.name} logged in`,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      territory: user.territory,
      avatar: user.avatar,
      notificationPreferences: user.notificationPreferences,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/me
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

// PUT /api/auth/profile
router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const {
      name,
      email,
      phone,
      whatsappNumber,
      territory,
      notificationPreferences,
    } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (whatsappNumber) user.whatsappNumber = whatsappNumber;
    if (territory) user.territory = territory;
    if (notificationPreferences)
      user.notificationPreferences = notificationPreferences;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/auth/password
router.put("/password", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { currentPassword, newPassword } = req.body;

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
