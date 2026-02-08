import express from "express";
import Company from "../models/Company.js";
import Lead from "../models/Lead.js";
import Activity from "../models/Activity.js";

const router = express.Router();

// GET /api/companies
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      industry,
      size,
      state,
      sort = "-createdAt",
    } = req.query;
    const query = {};
    if (industry) query.industry = industry;
    if (size) query.size = size;
    if (state) query["headquarters.state"] = state;
    if (search) query.$text = { $search: search };

    const total = await Company.countDocuments(query);
    const companies = await Company.find(query)
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    // Attach lead count for each company
    const companiesWithCounts = await Promise.all(
      companies.map(async (c) => {
        const leadCount = await Lead.countDocuments({ company: c._id });
        return { ...c.toObject(), leadCount };
      }),
    );

    res.json({
      companies: companiesWithCounts,
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

// GET /api/companies/:id
router.get("/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    const leads = await Lead.find({ company: company._id })
      .sort("-score")
      .limit(50)
      .populate("assignedTo", "name email");

    res.json({ ...company.toObject(), leads });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/companies
router.post("/", async (req, res) => {
  try {
    const company = await Company.create(req.body);
    await Activity.create({
      type: "company_created",
      title: `Company added: ${company.name}`,
      company: company._id,
    });
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/companies/:id
router.put("/:id", async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!company) return res.status(404).json({ message: "Company not found" });

    await Activity.create({
      type: "company_updated",
      title: `Company updated: ${company.name}`,
      company: company._id,
    });

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/companies/:id
router.delete("/:id", async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json({ message: "Company deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
