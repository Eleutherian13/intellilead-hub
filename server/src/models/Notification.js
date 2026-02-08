import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },

    type: {
      type: String,
      enum: [
        "new_lead",
        "lead_update",
        "score_change",
        "assignment",
        "feedback_request",
        "system",
        "crawl_complete",
      ],
      required: true,
    },

    title: { type: String, required: true },
    message: { type: String, required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    // Delivery channels
    channels: {
      inApp: {
        sent: { type: Boolean, default: true },
        read: { type: Boolean, default: false },
        readAt: Date,
      },
      email: {
        sent: { type: Boolean, default: false },
        sentAt: Date,
        status: String,
      },
      whatsapp: {
        sent: { type: Boolean, default: false },
        sentAt: Date,
        status: String,
        messageId: String,
      },
      push: {
        sent: { type: Boolean, default: false },
        sentAt: Date,
        status: String,
      },
    },

    // Action
    actionUrl: { type: String, default: "" },
    actionLabel: { type: String, default: "" },

    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ "channels.inApp.read": 1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
