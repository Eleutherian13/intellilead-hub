import mongoose from "mongoose";

const sourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: [
        "tender_portal",
        "news_site",
        "industry_directory",
        "government",
        "social_media",
        "rss_feed",
        "custom",
      ],
      required: true,
    },
    url: { type: String, required: true },
    description: { type: String, default: "" },

    // Scraping configuration
    config: {
      selectors: {
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        date: { type: String, default: "" },
        company: { type: String, default: "" },
        link: { type: String, default: "" },
        container: { type: String, default: "" },
      },
      headers: { type: mongoose.Schema.Types.Mixed, default: {} },
      method: { type: String, enum: ["GET", "POST"], default: "GET" },
      pagination: {
        enabled: { type: Boolean, default: false },
        paramName: { type: String, default: "page" },
        maxPages: { type: Number, default: 5 },
      },
      isRSS: { type: Boolean, default: false },
    },

    // Governance
    status: {
      type: String,
      enum: ["active", "paused", "error", "retired"],
      default: "active",
    },
    reliability: { type: Number, min: 0, max: 100, default: 50 },
    lastCrawled: { type: Date },
    lastSuccess: { type: Date },
    lastError: { type: String, default: "" },
    crawlCount: { type: Number, default: 0 },
    errorCount: { type: Number, default: 0 },
    leadsGenerated: { type: Number, default: 0 },

    // Schedule
    schedule: {
      enabled: { type: Boolean, default: true },
      intervalMinutes: { type: Number, default: 60 },
      cronExpression: { type: String, default: "0 * * * *" },
    },

    // Metadata
    category: { type: String, default: "" },
    region: { type: String, default: "" },
    tags: [{ type: String }],
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const Source = mongoose.model("Source", sourceSchema);
export default Source;
