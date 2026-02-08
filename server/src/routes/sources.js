import express from "express";
import Source from "../models/Source.js";
import Activity from "../models/Activity.js";
import { crawlSource } from "../services/scraper.js";

const router = express.Router();

// GET /api/sources
router.get("/", async (req, res) => {
  try {
    const { status, type, sort = "-createdAt" } = req.query;
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const sources = await Source.find(query).sort(sort);
    res.json(sources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/sources/:id
router.get("/:id", async (req, res) => {
  try {
    const source = await Source.findById(req.params.id);
    if (!source) return res.status(404).json({ message: "Source not found" });
    res.json(source);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/sources
router.post("/", async (req, res) => {
  try {
    const source = await Source.create({ ...req.body });
    await Activity.create({
      type: "source_added",
      title: `Source added: ${source.name}`,
      source: source._id,
    });
    res.status(201).json(source);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/sources/:id
router.put("/:id", async (req, res) => {
  try {
    const source = await Source.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!source) return res.status(404).json({ message: "Source not found" });
    res.json(source);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/sources/:id/crawl — trigger manual crawl
router.post("/:id/crawl", async (req, res) => {
  try {
    const source = await Source.findById(req.params.id);
    if (!source) return res.status(404).json({ message: "Source not found" });

    const result = await crawlSource(source);

    await Activity.create({
      type: "source_crawled",
      title: `Manual crawl: ${source.name}`,
      description: `Found ${result.leadsCreated} new leads`,
      source: source._id,
    });

    res.json({
      message: "Crawl completed",
      leadsCreated: result.leadsCreated,
      itemsProcessed: result.itemsProcessed,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/sources/:id
router.delete("/:id", async (req, res) => {
  try {
    const source = await Source.findByIdAndDelete(req.params.id);
    if (!source) return res.status(404).json({ message: "Source not found" });
    res.json({ message: "Source deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
