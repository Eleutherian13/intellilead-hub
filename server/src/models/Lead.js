import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    // Core lead info
    title: { type: String, required: true, trim: true },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    companyName: { type: String, required: true }, // denormalized for quick access

    // Classification
    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "qualified",
        "proposal",
        "negotiation",
        "won",
        "lost",
      ],
      default: "new",
    },
    priority: {
      type: String,
      enum: ["critical", "high", "medium", "low"],
      default: "medium",
    },

    // Lead scoring
    score: { type: Number, default: 0, min: 0, max: 100 },
    scoreBreakdown: {
      companyFit: { type: Number, default: 0 },
      signalStrength: { type: Number, default: 0 },
      urgency: { type: Number, default: 0 },
      volumePotential: { type: Number, default: 0 },
      geographicFit: { type: Number, default: 0 },
    },
    scoreExplanation: { type: String, default: "" },

    // Product inference
    inferredProducts: [
      {
        productCode: { type: String },
        productName: { type: String },
        confidence: { type: Number, min: 0, max: 100 },
        reason: { type: String },
      },
    ],

    // Source signal
    source: {
      type: {
        type: String,
        enum: [
          "tender",
          "news",
          "directory",
          "social",
          "website",
          "manual",
          "referral",
        ],
      },
      name: { type: String },
      url: { type: String },
      scrapedAt: { type: Date },
      rawSnippet: { type: String },
    },

    // Lead dossier fields
    dossier: {
      companyProfile: { type: String, default: "" },
      procurementClues: [{ type: String }],
      productFit: { type: String, default: "" },
      urgencyIndicators: [{ type: String }],
      nextAction: { type: String, default: "" },
      competitorInfo: { type: String, default: "" },
      estimatedDealValue: { type: String, default: "" },
    },

    // Assignment & workflow
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    territory: { type: String, default: "" },

    // Feedback loop
    feedback: {
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "converted"],
        default: "pending",
      },
      reason: { type: String, default: "" },
      feedbackAt: { type: Date },
      feedbackBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      conversionValue: { type: Number, default: 0 },
      notes: { type: String, default: "" },
    },

    // Audit trail
    timeline: [
      {
        action: { type: String },
        description: { type: String },
        performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        timestamp: { type: Date, default: Date.now },
        metadata: { type: mongoose.Schema.Types.Mixed },
      },
    ],

    // Notifications sent
    notificationsSent: [
      {
        channel: { type: String, enum: ["email", "whatsapp", "push"] },
        sentAt: { type: Date },
        status: { type: String },
      },
    ],

    // Location
    location: {
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      region: { type: String, default: "" },
    },

    // Tags and notes
    tags: [{ type: String }],
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

leadSchema.index({ status: 1, priority: 1, score: -1 });
leadSchema.index({ company: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ "source.type": 1 });
leadSchema.index({ title: "text", companyName: "text", notes: "text" });

const Lead = mongoose.model("Lead", leadSchema);
export default Lead;
