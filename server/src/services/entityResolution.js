import Company from "../models/Company.js";

/**
 * Entity Resolution Service
 *
 * Resolves scraped company names to existing Company documents
 * using fuzzy matching, aliases, and normalization.
 *
 * Model Card:
 *  - Type: Rule-based string matching with normalization
 *  - Input: Raw company name string
 *  - Output: Resolved or newly created Company document
 *  - Limitations: May not resolve highly abbreviated names
 */

// Common suffixes to strip for matching
const STRIP_SUFFIXES = [
  "ltd",
  "limited",
  "pvt",
  "private",
  "inc",
  "incorporated",
  "llc",
  "llp",
  "corp",
  "corporation",
  "co",
  "company",
  "enterprises",
  "industries",
  "group",
  "holdings",
];

// Industry classification keywords
const INDUSTRY_KEYWORDS = {
  "Oil & Gas": [
    "oil",
    "gas",
    "petroleum",
    "refinery",
    "fuel",
    "petrochemical",
    "lng",
    "cng",
  ],
  Construction: [
    "construction",
    "builder",
    "infrastructure",
    "cement",
    "concrete",
    "highway",
    "road",
    "nhai",
  ],
  Mining: ["mining", "mines", "mineral", "coal", "iron ore", "bauxite"],
  Steel: ["steel", "iron", "metallurgy", "foundry", "metal"],
  Chemicals: ["chemical", "chemicals", "pharma", "pharmaceutical", "reagent"],
  Manufacturing: [
    "manufacturing",
    "factory",
    "plant",
    "industrial",
    "equipment",
  ],
  Textiles: ["textile", "garment", "fabric", "spinning", "weaving", "cotton"],
  Transport: [
    "transport",
    "logistics",
    "fleet",
    "shipping",
    "freight",
    "trucking",
  ],
  "Power & Energy": [
    "power",
    "energy",
    "electricity",
    "solar",
    "wind",
    "thermal",
  ],
  "Food Processing": [
    "food",
    "edible oil",
    "rice",
    "sugar",
    "flour",
    "dairy",
    "beverage",
  ],
  Fertilizer: ["fertilizer", "urea", "dap", "npk", "agrochemical"],
  "Paint & Coatings": ["paint", "coating", "lacquer", "varnish"],
  "Real Estate": [
    "real estate",
    "property",
    "developer",
    "housing",
    "township",
  ],
  Shipping: ["shipping", "maritime", "port", "vessel", "marine"],
  Agriculture: ["agri", "agriculture", "farm", "seed", "irrigation"],
};

/**
 * Normalize a company name for comparison
 */
function normalizeName(name) {
  let normalized = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim();

  // Remove common suffixes
  for (const suffix of STRIP_SUFFIXES) {
    const regex = new RegExp(`\\b${suffix}\\b`, "g");
    normalized = normalized.replace(regex, "").trim();
  }

  // Collapse whitespace
  normalized = normalized.replace(/\s+/g, " ").trim();
  return normalized;
}

/**
 * Simple similarity score between two strings (Jaccard-like)
 */
function similarity(a, b) {
  const setA = new Set(a.split(" "));
  const setB = new Set(b.split(" "));
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

/**
 * Infer industry from company name
 */
function inferIndustry(companyName) {
  const lower = companyName.toLowerCase();
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return industry;
    }
  }
  return "Other";
}

/**
 * Resolve a company name to an existing company or create a new one
 * @param {string} rawName — the company name as scraped
 * @returns {Object} — Company document
 */
export async function resolveEntity(rawName) {
  if (!rawName || rawName.trim().length < 2) {
    // Create a generic placeholder
    rawName = "Unknown Company";
  }

  const normalized = normalizeName(rawName);

  // 1. Exact name match
  let company = await Company.findOne({
    name: { $regex: new RegExp(`^${escapeRegex(rawName.trim())}$`, "i") },
  });
  if (company) return company;

  // 2. Alias match
  company = await Company.findOne({
    aliases: { $regex: new RegExp(`^${escapeRegex(rawName.trim())}$`, "i") },
  });
  if (company) return company;

  // 3. Fuzzy match against existing companies
  const candidates = await Company.find().select("name aliases").limit(500);
  let bestMatch = null;
  let bestScore = 0;

  for (const candidate of candidates) {
    const candNorm = normalizeName(candidate.name);
    const score = similarity(normalized, candNorm);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = candidate;
    }
    // Also check aliases
    for (const alias of candidate.aliases || []) {
      const aliasScore = similarity(normalized, normalizeName(alias));
      if (aliasScore > bestScore) {
        bestScore = aliasScore;
        bestMatch = candidate;
      }
    }
  }

  if (bestScore >= 0.7 && bestMatch) {
    // High-confidence match — add alias for future
    const fullCompany = await Company.findById(bestMatch._id);
    if (!fullCompany.aliases.includes(rawName.trim())) {
      fullCompany.aliases.push(rawName.trim());
      await fullCompany.save();
    }
    return fullCompany;
  }

  // 4. Create new company
  const industry = inferIndustry(rawName);
  const newCompany = await Company.create({
    name: rawName.trim(),
    industry: industry,
    aliases: [],
    size: "medium",
    source: "scraper",
    status: "prospect",
  });

  return newCompany;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
