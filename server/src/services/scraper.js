import axios from "axios";
import * as cheerio from "cheerio";
import RSSParser from "rss-parser";
import Source from "../models/Source.js";
import Lead from "../models/Lead.js";
import Company from "../models/Company.js";
import User from "../models/User.js";
import { inferProducts } from "./inferenceEngine.js";
import { scoreLead } from "./leadScoring.js";
import { resolveEntity } from "./entityResolution.js";

const rssParser = new RSSParser();

// Cache robots.txt results to avoid repeated fetches
const robotsTxtCache = new Map();

/**
 * Check robots.txt compliance for a given URL
 * Returns true if crawling is allowed, false otherwise
 */
async function checkRobotsTxt(url) {
  try {
    const parsedUrl = new URL(url);
    const robotsUrl = `${parsedUrl.protocol}//${parsedUrl.host}/robots.txt`;

    if (robotsTxtCache.has(parsedUrl.host)) {
      return robotsTxtCache.get(parsedUrl.host);
    }

    const { data } = await axios.get(robotsUrl, { timeout: 5000 }).catch(() => ({ data: "" }));
    const lines = (data || "").split("\n");
    let applies = false;
    let allowed = true;

    for (const line of lines) {
      const trimmed = line.trim().toLowerCase();
      if (trimmed.startsWith("user-agent:")) {
        const agent = trimmed.replace("user-agent:", "").trim();
        applies = agent === "*" || agent.includes("leadintelbot");
      }
      if (applies && trimmed.startsWith("disallow:")) {
        const path = trimmed.replace("disallow:", "").trim();
        if (path === "/" || parsedUrl.pathname.startsWith(path)) {
          allowed = false;
        }
      }
      if (applies && trimmed.startsWith("allow:")) {
        const path = trimmed.replace("allow:", "").trim();
        if (parsedUrl.pathname.startsWith(path)) {
          allowed = true;
        }
      }
    }

    robotsTxtCache.set(parsedUrl.host, allowed);
    // Clear cache entry after 1 hour
    setTimeout(() => robotsTxtCache.delete(parsedUrl.host), 3600000);
    return allowed;
  } catch {
    // If we can't fetch robots.txt, assume allowed but log it
    console.warn(`[Scraper] Could not fetch robots.txt for ${url}, proceeding with caution`);
    return true;
  }
}

/**
 * Auto-assign a lead to the best-fit sales officer based on territory matching
 */
async function autoAssignLead(lead) {
  try {
    const state = (lead.location?.state || "").toLowerCase();
    if (!state) return null;

    // Find active sales officers whose territory matches the lead's state
    const matchingUsers = await User.find({
      isActive: true,
      role: { $in: ["sales_officer", "manager"] },
      territory: { $regex: new RegExp(state, "i") },
    }).sort({ createdAt: 1 });

    if (matchingUsers.length === 0) return null;

    // Round-robin: count existing assignments and pick least loaded
    const userCounts = await Promise.all(
      matchingUsers.map(async (user) => {
        const count = await Lead.countDocuments({
          assignedTo: user._id,
          status: { $nin: ["won", "lost"] },
        });
        return { user, count };
      })
    );

    userCounts.sort((a, b) => a.count - b.count);
    return userCounts[0].user;
  } catch (err) {
    console.error("[AutoAssign] Error:", err.message);
    return null;
  }
}

/**
 * Crawl a single source and create leads from discovered items
 */
export async function crawlSource(source) {
  const result = { itemsProcessed: 0, leadsCreated: 0, errors: [] };

  try {
    // robots.txt compliance check
    const robotsAllowed = await checkRobotsTxt(source.url);
    if (!robotsAllowed) {
      console.log(`[Scraper] Blocked by robots.txt: ${source.url}`);
      result.errors.push(`Blocked by robots.txt: ${source.url}`);
      source.lastCrawled = new Date();
      source.lastError = "Blocked by robots.txt";
      await source.save();
      return result;
    }

    let items = [];

    if (source.config.isRSS) {
      items = await crawlRSS(source);
    } else {
      items = await crawlHTML(source);
    }

    result.itemsProcessed = items.length;

    for (const item of items) {
      try {
        // Entity resolution — find or create company
        const company = await resolveEntity(item.company || item.title);

        // Product inference
        const inferredProducts = inferProducts(
          `${item.title} ${item.description} ${item.company || ""}`,
        );

        if (inferredProducts.length === 0) continue; // Skip if no HPCL product relevance

        // Check for duplicate leads
        const existingLead = await Lead.findOne({
          companyName: company.name,
          "source.url": item.url || source.url,
        });
        if (existingLead) continue;

        // Create lead with provenance/lineage tracking
        const crawlTimestamp = new Date();
        const lead = await Lead.create({
          title: item.title || `Opportunity: ${company.name}`,
          company: company._id,
          companyName: company.name,
          status: "new",
          source: {
            type: source.type
              .replace("_portal", "")
              .replace("_site", "")
              .replace("_directory", "directory"),
            name: source.name,
            url: item.url || source.url,
            scrapedAt: crawlTimestamp,
            rawSnippet: (item.description || "").substring(0, 500),
          },
          inferredProducts: inferredProducts,
          location: {
            city: company.headquarters?.city || "",
            state: company.headquarters?.state || "",
            region: company.headquarters?.state || "",
          },
          dossier: {
            companyProfile:
              company.description || `${company.name} — ${company.industry}`,
            procurementClues: [item.description || item.title].filter(Boolean),
            productFit: inferredProducts.map((p) => p.productName).join(", "),
            urgencyIndicators: extractUrgencyIndicators(
              item.title + " " + (item.description || ""),
            ),
            nextAction: "Review lead and contact procurement team",
          },
          tags: [source.type, ...inferredProducts.map((p) => p.productCode)],
          // Provenance: initial timeline entry for auditability
          timeline: [{
            action: "lead_created",
            description: `Auto-generated from ${source.name} (${source.type}). Source URL: ${item.url || source.url}. Crawled at ${crawlTimestamp.toISOString()}. robots.txt: allowed.`,
            timestamp: crawlTimestamp,
            metadata: {
              sourceId: source._id,
              sourceName: source.name,
              sourceType: source.type,
              crawledUrl: item.url || source.url,
              robotsChecked: true,
              productsInferred: inferredProducts.length,
            },
          }],
        });

        // Score the lead
        const scoreResult = scoreLead(lead, company);
        lead.score = scoreResult.totalScore;
        lead.scoreBreakdown = scoreResult.breakdown;
        lead.scoreExplanation = scoreResult.explanation;
        lead.priority =
          scoreResult.totalScore >= 80
            ? "critical"
            : scoreResult.totalScore >= 60
              ? "high"
              : scoreResult.totalScore >= 40
                ? "medium"
                : "low";

        // Auto-assign to best-fit sales officer
        const assignedUser = await autoAssignLead(lead);
        if (assignedUser) {
          lead.assignedTo = assignedUser._id;
          lead.territory = assignedUser.territory;
          lead.status = "contacted";
          lead.timeline.push({
            action: "auto_assigned",
            description: `Auto-assigned to ${assignedUser.name} (${assignedUser.territory})`,
            timestamp: new Date(),
            metadata: { userId: assignedUser._id, territory: assignedUser.territory },
          });
        }

        await lead.save();

        result.leadsCreated++;
      } catch (err) {
        result.errors.push(err.message);
      }
    }

    // Update source stats
    source.lastCrawled = new Date();
    source.lastSuccess = new Date();
    source.crawlCount += 1;
    source.leadsGenerated += result.leadsCreated;
    source.lastError = "";
    await source.save();
  } catch (error) {
    source.lastCrawled = new Date();
    source.lastError = error.message;
    source.errorCount += 1;
    if (source.errorCount > 10) source.status = "error";
    await source.save();
    result.errors.push(error.message);
  }

  return result;
}

/**
 * Crawl an HTML page using CSS selectors
 */
async function crawlHTML(source) {
  const items = [];
  try {
    const { data } = await axios.get(source.url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LeadIntelBot/1.0)",
        ...source.config.headers,
      },
      timeout: 15000,
    });

    const $ = cheerio.load(data);
    const sel = source.config.selectors;
    const container = sel.container || "body";

    $(container).each((i, el) => {
      const title = sel.title
        ? $(el).find(sel.title).text().trim()
        : $(el).text().trim().substring(0, 200);
      const description = sel.description
        ? $(el).find(sel.description).text().trim()
        : "";
      const company = sel.company ? $(el).find(sel.company).text().trim() : "";
      const date = sel.date ? $(el).find(sel.date).text().trim() : "";
      const link = sel.link ? $(el).find(sel.link).attr("href") || "" : "";
      const url = link.startsWith("http")
        ? link
        : link
          ? new URL(link, source.url).href
          : source.url;

      if (title) {
        items.push({ title, description, company, date, url });
      }
    });
  } catch (error) {
    console.error(`HTML crawl error for ${source.name}:`, error.message);
  }
  return items;
}

/**
 * Crawl an RSS/Atom feed
 */
async function crawlRSS(source) {
  const items = [];
  try {
    const feed = await rssParser.parseURL(source.url);
    for (const entry of feed.items || []) {
      items.push({
        title: entry.title || "",
        description: entry.contentSnippet || entry.content || "",
        company: "",
        date: entry.pubDate || "",
        url: entry.link || source.url,
      });
    }
  } catch (error) {
    console.error(`RSS crawl error for ${source.name}:`, error.message);
  }
  return items;
}

/**
 * Extract urgency indicators from text
 */
function extractUrgencyIndicators(text) {
  const indicators = [];
  const lower = text.toLowerCase();
  const urgencyKeywords = [
    { pattern: /urgent|immediate|asap/i, label: "Urgent requirement" },
    { pattern: /tender|bid|rfq|rfp|eoi/i, label: "Active tender/RFQ" },
    { pattern: /deadline|last date|closing date/i, label: "Has deadline" },
    { pattern: /expansion|new plant|capacity/i, label: "Expansion activity" },
    { pattern: /contract.*expir|renewal/i, label: "Contract renewal" },
    { pattern: /shortage|supply.*issue/i, label: "Supply shortage" },
    { pattern: /commissioning|startup|launch/i, label: "New commissioning" },
  ];

  for (const kw of urgencyKeywords) {
    if (kw.pattern.test(lower)) {
      indicators.push(kw.label);
    }
  }
  return indicators;
}

/**
 * Crawl all active sources
 */
export async function crawlAllSources() {
  const sources = await Source.find({
    status: "active",
    "schedule.enabled": true,
  });
  console.log(`Starting scheduled crawl of ${sources.length} sources...`);

  const results = [];
  for (const source of sources) {
    const result = await crawlSource(source);
    results.push({ source: source.name, ...result });
    // Small delay between crawls to be respectful
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log("Crawl cycle complete:", results);
  return results;
}
