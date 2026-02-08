import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: {
      type: String,
      enum: [
        "lead_created",
        "lead_updated",
        "lead_assigned",
        "lead_scored",
        "feedback_given",
        "source_added",
        "source_crawled",
        "company_created",
        "company_updated",
        "notification_sent",
        "user_login",
        "system_event",
      ],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: "" },

    // References
    lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    source: { type: mongoose.Schema.Types.ObjectId, ref: "Source" },

    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

activitySchema.index({ createdAt: -1 });
activitySchema.index({ type: 1, createdAt: -1 });

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;
