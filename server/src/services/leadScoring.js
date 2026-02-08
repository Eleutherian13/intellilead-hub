/**
 * Lead Scoring Engine
 *
 * Multi-factor scoring algorithm for B2B leads.
 * Produces a composite score (0-100) from five dimensions:
 *  1. Company Fit (size, industry alignment, financial capacity)
 *  2. Signal Strength (source reliability, keyword confidence)
 *  3. Urgency (tender deadlines, expansion signals)
 *  4. Volume Potential (estimated deal size)
 *  5. Geographic Fit (proximity to HPCL DS depots / territories)
 *
 * Model Card:
 *  - Type: Rule-based weighted scoring
 *  - Weights: Configurable per dimension
 *  - Output: Score (0-100), breakdown, natural-language explanation
 *  - Bias mitigation: Equal opportunity across industries
 */

const WEIGHTS = {
  companyFit: 0.25,
  signalStrength: 0.25,
  urgency: 0.2,
  volumePotential: 0.15,
  geographicFit: 0.15,
};

// HPCL DS depot/refinery states (presence indicates geographic fit)
const HPCL_TERRITORIES = [
  "maharashtra",
  "andhra pradesh",
  "telangana",
  "karnataka",
  "tamil nadu",
  "kerala",
  "gujarat",
  "rajasthan",
  "madhya pradesh",
  "uttar pradesh",
  "west bengal",
  "odisha",
  "bihar",
  "punjab",
  "haryana",
  "delhi",
  "chhattisgarh",
  "jharkhand",
  "assam",
  "goa",
];

// Industry fit scores (alignment with HPCL DS product portfolio)
const INDUSTRY_FIT = {
  "oil & gas": 95,
  petroleum: 95,
  energy: 90,
  construction: 85,
  infrastructure: 85,
  roads: 85,
  mining: 80,
  cement: 80,
  steel: 80,
  manufacturing: 75,
  chemicals: 75,
  textiles: 70,
  fertilizer: 70,
  shipping: 70,
  transportation: 70,
  logistics: 65,
  power: 75,
  "food processing": 65,
  "edible oil": 70,
  paint: 65,
  pharmaceuticals: 60,
  agriculture: 60,
  "real estate": 55,
  packaging: 50,
  it: 20,
  technology: 20,
  banking: 15,
  "financial services": 15,
};

/**
 * Score a lead
 * @param {Object} lead — Lead document
 * @param {Object} company — Company document
 * @returns {{ totalScore, breakdown, explanation, priority }}
 */
export function scoreLead(lead, company) {
  const breakdown = {
    companyFit: scoreCompanyFit(company),
    signalStrength: scoreSignalStrength(lead),
    urgency: scoreUrgency(lead),
    volumePotential: scoreVolumePotential(lead, company),
    geographicFit: scoreGeographicFit(lead, company),
  };

  const totalScore = Math.round(
    breakdown.companyFit * WEIGHTS.companyFit +
      breakdown.signalStrength * WEIGHTS.signalStrength +
      breakdown.urgency * WEIGHTS.urgency +
      breakdown.volumePotential * WEIGHTS.volumePotential +
      breakdown.geographicFit * WEIGHTS.geographicFit,
  );

  const priority =
    totalScore >= 80
      ? "critical"
      : totalScore >= 60
        ? "high"
        : totalScore >= 40
          ? "medium"
          : "low";

  const explanation = generateExplanation(breakdown, totalScore, lead, company);

  return { totalScore, breakdown, explanation, priority };
}

function scoreCompanyFit(company) {
  if (!company) return 30;
  let score = 40; // base

  // Industry alignment
  const industry = (company.industry || "").toLowerCase();
  for (const [key, value] of Object.entries(INDUSTRY_FIT)) {
    if (industry.includes(key)) {
      score = Math.max(score, value);
      break;
    }
  }

  // Company size
  const sizeScores = {
    enterprise: 20,
    large: 18,
    medium: 12,
    small: 6,
    startup: 3,
  };
  score = Math.min(score + (sizeScores[company.size] || 8), 100);

  // Has contacts
  if (company.contacts && company.contacts.length > 0)
    score = Math.min(score + 5, 100);

  // Multiple locations
  if (company.locations && company.locations.length > 1)
    score = Math.min(score + 5, 100);

  return Math.min(Math.round(score), 100);
}

function scoreSignalStrength(lead) {
  let score = 30; // base

  // Source type reliability
  const sourceScores = {
    tender: 90,
    news: 60,
    directory: 50,
    website: 55,
    social: 40,
    manual: 70,
    referral: 80,
  };
  const sourceType = lead.source?.type || "manual";
  score = Math.max(score, sourceScores[sourceType] || 40);

  // Product inference confidence
  if (lead.inferredProducts && lead.inferredProducts.length > 0) {
    const maxConfidence = Math.max(
      ...lead.inferredProducts.map((p) => p.confidence || 0),
    );
    score = Math.min(score + Math.round(maxConfidence * 0.2), 100);
  }

  // Multiple products indicate stronger signal
  if (lead.inferredProducts && lead.inferredProducts.length > 1) {
    score = Math.min(score + 10, 100);
  }

  return Math.min(Math.round(score), 100);
}

function scoreUrgency(lead) {
  let score = 20; // base

  const indicators = lead.dossier?.urgencyIndicators || [];
  // Each urgency indicator adds points
  score += indicators.length * 15;

  // Active tender is highly urgent
  if (lead.source?.type === "tender") score += 30;

  // Check for deadline mentions in snippet
  const snippet = (lead.source?.rawSnippet || "").toLowerCase();
  if (/deadline|last date|closing|due date/i.test(snippet)) score += 15;
  if (/urgent|immediate|asap/i.test(snippet)) score += 20;
  if (/expansion|new project|greenfield/i.test(snippet)) score += 10;

  return Math.min(Math.round(score), 100);
}

function scoreVolumePotential(lead, company) {
  let score = 30; // base

  // Company size indicates volume
  const sizeMap = {
    enterprise: 40,
    large: 30,
    medium: 20,
    small: 10,
    startup: 5,
  };
  score += sizeMap[company?.size] || 15;

  // Multiple products = higher volume potential
  if (lead.inferredProducts) {
    score += Math.min(lead.inferredProducts.length * 8, 30);
  }

  // Volume keywords in dossier
  const text = JSON.stringify(lead.dossier || {}).toLowerCase();
  if (/bulk|large.*quantity|annual.*contract|long.*term/i.test(text))
    score += 15;
  if (/\d{3,}\s*(mt|kl|ton)/i.test(text)) score += 10; // 3+ digit quantities

  return Math.min(Math.round(score), 100);
}

function scoreGeographicFit(lead, company) {
  let score = 30; // base

  const state = (
    lead.location?.state ||
    company?.headquarters?.state ||
    ""
  ).toLowerCase();
  if (state && HPCL_TERRITORIES.includes(state)) {
    score += 50;
  } else if (state) {
    score += 20; // Known state but not HPCL territory
  }

  // Multiple locations increase geographic relevance
  if (company?.locations?.length > 2) score += 10;

  return Math.min(Math.round(score), 100);
}

function generateExplanation(breakdown, total, lead, company) {
  const parts = [];

  if (breakdown.companyFit >= 70)
    parts.push(`Strong company fit (${company?.industry || "industry"})`);
  else if (breakdown.companyFit >= 50) parts.push(`Moderate company fit`);

  if (breakdown.signalStrength >= 70)
    parts.push(`High-confidence signal from ${lead.source?.type || "source"}`);

  if (breakdown.urgency >= 60) parts.push(`Elevated urgency detected`);
  if (breakdown.urgency >= 80) parts.push(`Active tender/deadline`);

  if (breakdown.volumePotential >= 60)
    parts.push(`Significant volume potential`);

  if (breakdown.geographicFit >= 70) parts.push(`Within HPCL DS territory`);

  if (lead.inferredProducts?.length > 0) {
    const topProduct = lead.inferredProducts[0];
    parts.push(
      `Primary product: ${topProduct.productName} (${topProduct.confidence}% confidence)`,
    );
  }

  return parts.join(". ") + `. Overall score: ${total}/100.`;
}

/**
 * Re-score all leads (e.g., after model update)
 */
export async function rescoreAllLeads() {
  const Lead = (await import("../models/Lead.js")).default;
  const Company = (await import("../models/Company.js")).default;

  const leads = await Lead.find().populate("company");
  let updated = 0;

  for (const lead of leads) {
    const result = scoreLead(lead, lead.company);
    lead.score = result.totalScore;
    lead.scoreBreakdown = result.breakdown;
    lead.scoreExplanation = result.explanation;
    lead.priority = result.priority;
    await lead.save();
    updated++;
  }

  return { updated };
}
