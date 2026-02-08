import express from "express";
import Lead from "../models/Lead.js";
import Company from "../models/Company.js";
import Source from "../models/Source.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET /api/analytics — detailed analytics
router.get("/", protect, async (req, res) => {
  try {
    const { period = "30d" } = req.query;
    let daysBack = 30;
    if (period === "7d") daysBack = 7;
    else if (period === "90d") daysBack = 90;
    else if (period === "1y") daysBack = 365;

    const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

    // Lead funnel
    const funnel = await Lead.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Score distribution
    const scoreDistribution = await Lead.aggregate([
      {
        $bucket: {
          groupBy: "$score",
          boundaries: [0, 20, 40, 60, 80, 100, 101],
          default: "Other",
          output: { count: { $sum: 1 } },
        },
      },
    ]);

    // Source performance
    const sourcePerformance = await Lead.aggregate([
      {
        $group: {
          _id: "$source.type",
          count: { $sum: 1 },
          avgScore: { $avg: "$score" },
          converted: {
            $sum: { $cond: [{ $eq: ["$feedback.status", "converted"] }, 1, 0] },
          },
        },
      },
    ]);

    // Product demand
    const productDemand = await Lead.aggregate([
      { $unwind: "$inferredProducts" },
      {
        $group: {
          _id: "$inferredProducts.productCode",
          name: { $first: "$inferredProducts.productName" },
          totalLeads: { $sum: 1 },
          avgConfidence: { $avg: "$inferredProducts.confidence" },
        },
      },
      { $sort: { totalLeads: -1 } },
    ]);

    // Territory analysis
    const territoryAnalysis = await Lead.aggregate([
      { $match: { "location.state": { $ne: "" } } },
      {
        $group: {
          _id: "$location.state",
          totalLeads: { $sum: 1 },
          avgScore: { $avg: "$score" },
          converted: {
            $sum: { $cond: [{ $eq: ["$feedback.status", "converted"] }, 1, 0] },
          },
        },
      },
      { $sort: { totalLeads: -1 } },
    ]);

    // Trend data
    const dailyTrend = await Lead.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          newLeads: { $sum: 1 },
          avgScore: { $avg: "$score" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Feedback analysis
    const feedbackAnalysis = await Lead.aggregate([
      { $match: { "feedback.status": { $ne: "pending" } } },
      {
        $group: {
          _id: "$feedback.status",
          count: { $sum: 1 },
          avgScore: { $avg: "$score" },
        },
      },
    ]);

    // Industry distribution
    const industryDistribution = await Company.aggregate([
      { $group: { _id: "$industry", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 },
    ]);

    // Source health
    const sources = await Source.find().select(
      "name type status reliability lastCrawled crawlCount errorCount leadsGenerated",
    );

    res.json({
      funnel,
      scoreDistribution,
      sourcePerformance,
      productDemand,
      territoryAnalysis,
      dailyTrend,
      feedbackAnalysis,
      industryDistribution,
      sourceHealth: sources,
      period,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
