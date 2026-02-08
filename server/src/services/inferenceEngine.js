import config from "../config/config.js";

/**
 * Product-Need Inference Engine
 *
 * Maps web signals (tender text, news articles, directory entries)
 * to specific HPCL Direct Sales products using keyword matching,
 * industry classification, and contextual rules.
 *
 * Model Card:
 *  - Type: Rule-based NLP with keyword matching
 *  - Input: Raw text from scraped sources
 *  - Output: Array of { productCode, productName, confidence, reason }
 *  - Bias mitigation: Multiple keyword sets, confidence thresholds
 */

// Product keyword maps — each product has primary and secondary signal words
const productSignals = {
  MS: {
    primary: [
      "petrol",
      "motor spirit",
      "gasoline",
      "ms supply",
      "petrol pump",
      "fuel station",
      "retail outlet",
    ],
    secondary: [
      "fuel",
      "automotive fuel",
      "filling station",
      "petroleum retail",
    ],
    industries: ["retail fuel", "transportation", "logistics"],
    baseConfidence: 70,
  },
  HSD: {
    primary: [
      "diesel",
      "high speed diesel",
      "hsd",
      "diesel supply",
      "diesel fuel",
      "agri diesel",
    ],
    secondary: [
      "dg set",
      "generator",
      "heavy vehicle",
      "transport fuel",
      "mining",
      "fleet",
      "truck",
    ],
    industries: [
      "transportation",
      "logistics",
      "mining",
      "construction",
      "agriculture",
      "manufacturing",
    ],
    baseConfidence: 75,
  },
  LDO: {
    primary: ["light diesel oil", "ldo", "industrial diesel"],
    secondary: ["burner fuel", "industrial heating", "furnace"],
    industries: ["manufacturing", "textiles", "ceramics"],
    baseConfidence: 65,
  },
  FO: {
    primary: ["furnace oil", "fuel oil", "fo supply", "heavy fuel oil"],
    secondary: [
      "boiler fuel",
      "industrial heating",
      "thermal energy",
      "steam generation",
      "kiln",
    ],
    industries: [
      "manufacturing",
      "cement",
      "steel",
      "power",
      "textiles",
      "chemicals",
      "paper",
    ],
    baseConfidence: 70,
  },
  LSHS: {
    primary: ["lshs", "low sulphur heavy stock", "heavy stock"],
    secondary: ["heavy fuel", "industrial fuel", "low sulphur fuel"],
    industries: ["shipping", "power", "heavy industry"],
    baseConfidence: 60,
  },
  SKO: {
    primary: ["kerosene", "sko", "superior kerosene"],
    secondary: ["lighting fuel", "cooking fuel", "pds kerosene"],
    industries: ["government supply", "rural distribution"],
    baseConfidence: 55,
  },
  Hexane: {
    primary: ["hexane", "n-hexane", "food grade hexane"],
    secondary: [
      "solvent extraction",
      "edible oil extraction",
      "soybean extraction",
      "rice bran oil",
    ],
    industries: [
      "edible oil",
      "food processing",
      "pharmaceuticals",
      "chemicals",
    ],
    baseConfidence: 75,
  },
  Solvent1425: {
    primary: ["solvent 1425", "mineral solvent", "petroleum solvent"],
    secondary: [
      "paint thinner",
      "industrial solvent",
      "rubber solvent",
      "adhesive",
    ],
    industries: ["paint", "rubber", "adhesives", "coatings", "printing"],
    baseConfidence: 65,
  },
  MTO: {
    primary: ["mto", "mineral turpentine", "turpentine oil", "white spirit"],
    secondary: ["paint solvent", "thinner", "cleaning solvent", "degreasing"],
    industries: ["paint", "coatings", "cleaning", "manufacturing"],
    baseConfidence: 65,
  },
  Bitumen: {
    primary: [
      "bitumen",
      "asphalt",
      "road tar",
      "vg-30",
      "vg-40",
      "crumb rubber modified bitumen",
      "crmb",
    ],
    secondary: [
      "road construction",
      "highway",
      "national highway",
      "nhai",
      "paving",
      "waterproofing",
      "roofing",
    ],
    industries: ["construction", "infrastructure", "roads", "real estate"],
    baseConfidence: 80,
  },
  MarineFuels: {
    primary: [
      "marine fuel",
      "bunker fuel",
      "ship fuel",
      "bunkering",
      "marine gas oil",
      "mgo",
      "vlsfo",
    ],
    secondary: ["vessel", "shipping", "port", "maritime", "coastal", "naval"],
    industries: ["shipping", "maritime", "ports", "navy", "fishing"],
    baseConfidence: 70,
  },
  Sulphur: {
    primary: ["sulphur", "sulfur", "sulphur supply"],
    secondary: [
      "fertilizer",
      "sulphuric acid",
      "chemical grade sulphur",
      "dap",
      "ssp",
    ],
    industries: ["fertilizer", "chemicals", "agriculture"],
    baseConfidence: 60,
  },
  Propylene: {
    primary: ["propylene", "polypropylene", "pp granules"],
    secondary: ["plastic", "polymer", "petrochemical", "packaging"],
    industries: ["petrochemicals", "plastics", "packaging", "textiles"],
    baseConfidence: 65,
  },
};

/**
 * Infer HPCL DS products from text content
 * @param {string} text - Raw text to analyze
 * @param {string} [industry] - Known industry of the company (optional)
 * @returns {Array} Matched products with confidence scores
 */
export function inferProducts(text, industry = "") {
  if (!text) return [];

  const lower = text.toLowerCase();
  const results = [];

  for (const [code, signals] of Object.entries(productSignals)) {
    let confidence = 0;
    const reasons = [];

    // Check primary keywords (high weight)
    for (const keyword of signals.primary) {
      if (lower.includes(keyword)) {
        confidence = Math.max(confidence, signals.baseConfidence);
        reasons.push(`Keyword match: "${keyword}"`);
      }
    }

    // Check secondary keywords (moderate weight)
    let secondaryHits = 0;
    for (const keyword of signals.secondary) {
      if (lower.includes(keyword)) {
        secondaryHits++;
        reasons.push(`Context signal: "${keyword}"`);
      }
    }
    if (secondaryHits > 0 && confidence === 0) {
      confidence = Math.min(signals.baseConfidence - 15, 50);
    }
    if (secondaryHits > 1) {
      confidence = Math.min(confidence + secondaryHits * 5, 95);
    }

    // Industry boost
    if (industry) {
      const lowerIndustry = industry.toLowerCase();
      for (const ind of signals.industries) {
        if (lowerIndustry.includes(ind)) {
          confidence = Math.min(confidence + 15, 95);
          reasons.push(`Industry match: "${ind}"`);
          break;
        }
      }
    }

    // Quantity / volume keywords boost confidence
    if (confidence > 0) {
      const quantityPatterns = [
        /\d+\s*(mt|kl|litre|ton|barrel|bbl)/i,
        /bulk\s*(supply|order|procurement)/i,
        /annual\s*(contract|requirement|demand)/i,
      ];
      for (const pat of quantityPatterns) {
        if (pat.test(text)) {
          confidence = Math.min(confidence + 10, 95);
          reasons.push("Volume/quantity indicators present");
          break;
        }
      }
    }

    if (confidence >= 30) {
      const productInfo = config.hpProducts.find((p) => p.code === code);
      results.push({
        productCode: code,
        productName: productInfo ? productInfo.name : code,
        confidence: Math.round(confidence),
        reason: reasons.join("; "),
      });
    }
  }

  // Sort by confidence descending
  results.sort((a, b) => b.confidence - a.confidence);

  return results;
}

/**
 * Get all available products
 */
export function getProductCatalog() {
  return config.hpProducts;
}

/**
 * Explain inference for a given text (for explainability/auditability)
 */
export function explainInference(text, industry = "") {
  const products = inferProducts(text, industry);
  return {
    input: text.substring(0, 200) + (text.length > 200 ? "..." : ""),
    industry: industry || "Not specified",
    productsIdentified: products.length,
    products: products,
    modelVersion: "1.0.0",
    modelType: "Rule-based NLP with keyword matching",
    timestamp: new Date().toISOString(),
  };
}
