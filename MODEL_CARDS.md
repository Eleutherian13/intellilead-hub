# MODEL_CARDS.md - AI/ML Model Documentation

## HPCL Lead Intelligence Platform - Model Cards

---

## 1. Product Inference Engine

### Overview

The Product Inference Engine maps unstructured text signals from web scraping to HPCL's 13-product catalog using rule-based NLP with keyword matching and confidence scoring.

### Purpose

Automatically identify which HPCL petroleum products a potential lead might need based on scraped content from tenders, news articles, industry reports, and corporate websites.

### Product Catalog (13 HPCL Products)

| Code  | Product Name            | Category            |
| ----- | ----------------------- | ------------------- |
| MS    | Motor Spirit (Petrol)   | Transport Fuels     |
| HSD   | High Speed Diesel       | Transport Fuels     |
| LDO   | Light Diesel Oil        | Industrial Fuels    |
| FO    | Furnace Oil             | Industrial Fuels    |
| LSHS  | Low Sulphur Heavy Stock | Industrial Fuels    |
| SKO   | Superior Kerosene Oil   | Domestic/Industrial |
| HEX   | Hexane                  | Solvents            |
| S1425 | Solvent 1425            | Solvents            |
| MTO   | Mineral Turpentine Oil  | Solvents            |
| BIT   | Bitumen                 | Infrastructure      |
| MF    | Marine Fuels            | Marine              |
| SUL   | Sulphur                 | Chemicals           |
| PPL   | Propylene               | Petrochemicals      |

### Methodology

1. **Keyword Extraction**: Each product has a curated dictionary of 10-30 keywords including:
   - Product names and abbreviations
   - Industry-specific terms (e.g., "road construction" -> Bitumen)
   - Common use cases (e.g., "furnace", "boiler" -> Furnace Oil)
   - Regulatory terms (e.g., "BS-VI" -> MS/HSD)

2. **Confidence Scoring**:
   - **Direct mention** of product name: 0.95 confidence
   - **Strong indicator** keywords: 0.80 confidence
   - **Contextual match** (industry + use case): 0.60 confidence
   - **Weak signal** (single keyword): 0.40 confidence
   - Multiple matches boost confidence (capped at 0.98)

3. **Output**: Array of `{ productCode, productName, confidence }` sorted by confidence descending

### Limitations

- Rule-based, not ML-trained; cannot learn new patterns without manual keyword updates
- May miss novel product references or industry jargon not in keyword dictionary
- No semantic understanding; relies on exact/fuzzy string matching
- Confidence scores are heuristic, not calibrated probabilities

### Bias & Fairness

- No demographic bias concerns (B2B product matching)
- Potential geographic bias: keyword dictionaries may favor Indian English terminology
- Industrial sector bias: heavy industry keywords are more comprehensive than niche sectors

---

## 2. Lead Scoring Model

### Overview

Multi-dimensional weighted scoring model that ranks B2B leads on a 0-100 scale across 5 dimensions.

### Purpose

Prioritize sales team effort by scoring leads based on business potential, enabling focus on the highest-value opportunities.

### Scoring Dimensions

| Dimension                | Weight | Factors                                                                  |
| ------------------------ | ------ | ------------------------------------------------------------------------ |
| **Company Profile**      | 25%    | Revenue, employee count, industry alignment, existing HPCL customer      |
| **Signal Strength**      | 25%    | Source reliability, content recency, signal type (tender vs news)        |
| **Product Fit**          | 20%    | Inference confidence, number of matching products, volume indicators     |
| **Engagement Potential** | 15%    | Contact information availability, previous interactions, territory match |
| **Timing**               | 15%    | Tender deadlines, procurement cycles, urgency signals                    |

### Scoring Formula

```
totalScore = (companyScore * 0.25) + (signalScore * 0.25) + (productFitScore * 0.20) + (engagementScore * 0.15) + (timingScore * 0.15)
```

### Priority Mapping

| Score Range | Priority | SLA                     |
| ----------- | -------- | ----------------------- |
| 85-100      | Critical | Contact within 4 hours  |
| 70-84       | High     | Contact within 24 hours |
| 50-69       | Medium   | Contact within 3 days   |
| 0-49        | Low      | Batch review weekly     |

### Feedback Loop

- Sales reps provide feedback (useful/not_useful/converted/rejected) on each lead
- Feedback is stored and can be used to adjust scoring weights over time
- Current implementation: feedback tracked but manual weight adjustment

### Limitations

- Weights are expert-assigned, not optimized through ML training
- No temporal decay on scoring (old signals weighted same as new)
- Company profile scoring requires structured data that may be incomplete for smaller firms

---

## 3. Entity Resolution Engine

### Overview

Fuzzy matching system to deduplicate companies and link signals from multiple sources to a single canonical entity.

### Purpose

Ensure the same company appearing under different names across sources is unified into one record, preventing duplicate leads and enabling comprehensive company profiles.

### Methodology

1. **Normalization Pipeline**:
   - Lowercase conversion
   - Remove legal suffixes: Ltd, Limited, Pvt, Private, Inc, Corp, LLP, etc.
   - Remove punctuation and extra whitespace
   - Standardize common abbreviations (Intl -> International, Mfg -> Manufacturing)

2. **Matching Strategies** (applied in order):
   - **Exact match** on normalized name (confidence: 1.0)
   - **CIN/GST match** on government registration numbers (confidence: 0.99)
   - **Fuzzy string match** using Levenshtein distance (threshold: 0.85 similarity, confidence: proportional)
   - **Domain match** from website URLs (confidence: 0.90)
   - **Phone/address overlap** (confidence: 0.75)

3. **Merge Strategy**:
   - When match found, update existing company record with new data
   - Prefer most recent data for mutable fields (revenue, employee count)
   - Append to array fields (locations, product needs, signals)
   - Keep earliest `createdAt` timestamp

### Performance Characteristics

- Designed for batch processing during crawl ingestion
- O(n) scan against existing companies using indexed normalized names
- Fuzzy matching only triggered when exact match fails

### Limitations

- Cannot resolve across entirely different company names (e.g., "TATA" vs "Tata Sons")
- No ML-based entity resolution; relies on string similarity
- May create false matches for very short company names (2-3 characters)
- No cross-language matching (Hindi company names not supported)

---

## Data Governance

### Source Reliability Tracking

Each data source has a `governance` object tracking:

- `reliability`: 0.0-1.0 score based on historical data quality
- `totalLeadsGenerated`: cumulative count
- `lastCrawlStatus`: success/failure/partial
- `avgLeadScore`: average quality of leads from this source

### Data Freshness

- Crawl schedules: configurable per source (hourly/daily/weekly)
- Lead freshness: `lastUpdated` timestamp on every lead
- Stale lead detection: leads not updated in 30+ days flagged for review

### Ethical Considerations

- Only publicly available data is scraped (government tenders, public news, corporate websites)
- No personal data processing; all data is B2B company-level
- robots.txt compliance in web scraper
- Rate limiting on all scraping operations
