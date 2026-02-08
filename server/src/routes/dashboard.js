import express from "express";
import Lead from "../models/Lead.js";
import Company from "../models/Company.js";
import Source from "../models/Source.js";
import Activity from "../models/Activity.js";

const router = express.Router();

// GET /api/dashboard — aggregated stats
router.get("/", async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const activeLeads = await Lead.countDocuments({
      status: { $nin: ["won", "lost"] },
    });
    const qualifiedLeads = await Lead.countDocuments({ status: "qualified" });
    const convertedLeads = await Lead.countDocuments({
      "feedback.status": "converted",
    });
    const totalCompanies = await Company.countDocuments();
    const activeSources = await Source.countDocuments({ status: "active" });

    // Conversion rate
    const feedbackGiven = await Lead.countDocuments({
      "feedback.status": { $ne: "pending" },
    });
    const conversionRate =
      feedbackGiven > 0
        ? Math.round((convertedLeads / feedbackGiven) * 100)
        : 0;

    // Average score
    const scoreAgg = await Lead.aggregate([
      { $group: { _id: null, avg: { $avg: "$score" } } },
    ]);
    const avgScore = scoreAgg.length > 0 ? Math.round(scoreAgg[0].avg) : 0;

    // Leads by status
    const leadsByStatus = await Lead.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Leads by priority
    const leadsByPriority = await Lead.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    // Leads by source type
    const leadsBySource = await Lead.aggregate([
      { $group: { _id: "$source.type", count: { $sum: 1 } } },
    ]);

    // Leads by product
    const leadsByProduct = await Lead.aggregate([
      { $unwind: "$inferredProducts" },
      { $group: { _id: "$inferredProducts.productCode", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Territory heatmap data
    const leadsByTerritory = await Lead.aggregate([
      { $match: { "location.state": { $ne: "" } } },
      {
        $group: {
          _id: "$location.state",
          count: { $sum: 1 },
          avgScore: { $avg: "$score" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Lead trend (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const leadTrend = await Lead.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Recent activities
    const recentActivities = await Activity.find()
      .populate("user", "name avatar")
      .sort("-createdAt")
      .limit(15);

    // Top leads
    const topLeads = await Lead.find()
      .populate("company", "name industry logo")
      .sort("-score")
      .limit(5);

    res.json({
      stats: {
        totalLeads,
        activeLeads,
        qualifiedLeads,
        convertedLeads,
        totalCompanies,
        activeSources,
        conversionRate,
        avgScore,
      },
      leadsByStatus,
      leadsByPriority,
      leadsBySource,
      leadsByProduct,
      leadsByTerritory,
      leadTrend,
      recentActivities,
      topLeads,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
