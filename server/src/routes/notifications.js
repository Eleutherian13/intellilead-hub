import express from "express";
import Notification from "../models/Notification.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET /api/notifications
router.get("/", protect, async (req, res) => {
  try {
    const { page = 1, limit = 30, unreadOnly } = req.query;
    const query = { user: req.user._id };
    if (unreadOnly === "true") query["channels.inApp.read"] = false;

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      "channels.inApp.read": false,
    });

    const notifications = await Notification.find(query)
      .populate("lead", "title companyName score")
      .sort("-createdAt")
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      notifications,
      unreadCount,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/notifications/:id/read
router.put("/:id/read", protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { "channels.inApp.read": true, "channels.inApp.readAt": new Date() },
      { new: true },
    );
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/notifications/read-all
router.put("/read-all", protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, "channels.inApp.read": false },
      { "channels.inApp.read": true, "channels.inApp.readAt": new Date() },
    );
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/notifications/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
