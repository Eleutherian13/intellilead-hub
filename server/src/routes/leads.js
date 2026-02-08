import express from "express";
import Lead from "../models/Lead.js";
import Company from "../models/Company.js";
import Activity from "../models/Activity.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// GET /api/leads — list all leads with filtering, sorting, pagination
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      source,
      territory,
      assignedTo,
      search,
      sortBy = "score",
      sortOrder = "desc",
      minScore,
      maxScore,
      feedbackStatus,
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (source) query["source.type"] = source;
    if (territory) query.territory = territory;
    if (assignedTo) query.assignedTo = assignedTo;
    if (feedbackStatus) query["feedback.status"] = feedbackStatus;
    if (minScore || maxScore) {
      query.score = {};
      if (minScore) query.score.$gte = Number(minScore);
      if (maxScore) query.score.$lte = Number(maxScore);
    }
    if (search) {
      query.$text = { $search: search };
    }

    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const totalCount = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .populate("company", "name industry headquarters logo")
      .populate("assignedTo", "name email avatar")
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      leads,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(totalCount / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/leads/:id — single lead (dossier)
router.get("/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate("company")
      .populate("assignedTo", "name email avatar territory")
      .populate("timeline.performedBy", "name")
      .populate("feedback.feedbackBy", "name");

    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/leads — create
router.post("/", async (req, res) => {
  try {
    const lead = await Lead.create({
      ...req.body,
      timeline: [
        {
          action: "created",
          description: "Lead created",
          timestamp: new Date(),
        },
      ],
    });

    await Activity.create({
      type: "lead_created",
      title: `New lead: ${lead.title}`,
      description: `Lead created for ${lead.companyName}`,
      lead: lead._id,
      company: lead.company,
    });

    const populated = await lead.populate(
      "company",
      "name industry headquarters logo",
    );
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/leads/:id — update
router.put("/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    // Track changes in timeline
    const changes = [];
    for (const [key, value] of Object.entries(req.body)) {
      if (JSON.stringify(lead[key]) !== JSON.stringify(value)) {
        changes.push(`${key} updated`);
      }
    }

    Object.assign(lead, req.body);
    if (changes.length > 0) {
      lead.timeline.push({
        action: "updated",
        description: changes.join(", "),
        timestamp: new Date(),
      });
    }

    const updated = await lead.save();
    await updated.populate("company", "name industry headquarters logo");

    await Activity.create({
      type: "lead_updated",
      title: `Lead updated: ${lead.title}`,
      description: changes.join(", "),
      lead: lead._id,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/leads/:id/assign — assign to user
router.put("/:id/assign", async (req, res) => {
  try {
    const { userId, territory } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    lead.assignedTo = userId;
    if (territory) lead.territory = territory;
    lead.timeline.push({
      action: "assigned",
      description: `Lead assigned to user`,
      timestamp: new Date(),
      metadata: { assignedTo: userId },
    });

    const updated = await lead.save();

    // Create notification for assigned user
    await Notification.create({
      user: userId,
      lead: lead._id,
      type: "assignment",
      title: "New Lead Assigned",
      message: `You have been assigned a new lead: ${lead.title}`,
      priority: lead.priority,
      actionUrl: `/leads/${lead._id}`,
      actionLabel: "View Lead",
    });

    await Activity.create({
      type: "lead_assigned",
      title: `Lead assigned: ${lead.title}`,
      lead: lead._id,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/leads/:id/feedback — sales officer feedback
router.put("/:id/feedback", async (req, res) => {
  try {
    const { status, reason, notes, conversionValue } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    lead.feedback = {
      status,
      reason: reason || "",
      notes: notes || "",
      conversionValue: conversionValue || 0,
      feedbackAt: new Date(),
    };

    // Update lead status based on feedback
    if (status === "converted") lead.status = "won";
    else if (status === "rejected") lead.status = "lost";
    else if (status === "accepted") lead.status = "qualified";

    lead.timeline.push({
      action: "feedback",
      description: `Feedback: ${status} — ${reason || "No reason"}`,
      timestamp: new Date(),
      metadata: { feedbackStatus: status, reason, conversionValue },
    });

    const updated = await lead.save();

    await Activity.create({
      type: "feedback_given",
      title: `Feedback on ${lead.title}: ${status}`,
      description: reason || "",
      lead: lead._id,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/leads/:id
router.delete("/:id", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json({ message: "Lead deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
