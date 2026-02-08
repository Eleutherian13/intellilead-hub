import mongoose from "mongoose";
import dotenv from "dotenv";
import Company from "../models/Company.js";
import Lead from "../models/Lead.js";
import Source from "../models/Source.js";
import User from "../models/User.js";
import Activity from "../models/Activity.js";
import Notification from "../models/Notification.js";
import { inferProducts } from "../services/inferenceEngine.js";
import { scoreLead } from "../services/leadScoring.js";

dotenv.config();

// ─── Demo Companies (50) ─────────────────────────────────────
const demoCompanies = [
  {
    name: "Tata Steel Ltd",
    industry: "Steel",
    size: "enterprise",
    headquarters: { city: "Jamshedpur", state: "Jharkhand" },
    employeeCount: 80000,
    annualRevenue: "₹2,43,000 Cr",
    description: "Leading steel manufacturer in India",
    contacts: [
      {
        name: "Rajesh Kumar",
        designation: "VP Procurement",
        email: "rajesh.kumar@tatasteel.com",
        phone: "+91-9876543210",
        isPrimary: true,
      },
    ],
  },
  {
    name: "JSW Steel Ltd",
    industry: "Steel",
    size: "enterprise",
    headquarters: { city: "Mumbai", state: "Maharashtra" },
    employeeCount: 45000,
    annualRevenue: "₹1,67,000 Cr",
    description: "One of India's leading steel producers",
  },
  {
    name: "UltraTech Cement Ltd",
    industry: "Construction",
    size: "enterprise",
    headquarters: { city: "Mumbai", state: "Maharashtra" },
    employeeCount: 22000,
    annualRevenue: "₹63,000 Cr",
    description: "India's largest cement manufacturer (Aditya Birla Group)",
  },
  {
    name: "Ambuja Cements Ltd",
    industry: "Construction",
    size: "large",
    headquarters: { city: "Mumbai", state: "Maharashtra" },
    employeeCount: 12000,
    annualRevenue: "₹33,000 Cr",
    description: "Major cement producer (Adani Group)",
  },
  {
    name: "Larsen & Toubro Ltd",
    industry: "Construction",
    size: "enterprise",
    headquarters: { city: "Mumbai", state: "Maharashtra" },
    employeeCount: 400000,
    annualRevenue: "₹2,20,000 Cr",
    description: "India's largest engineering & construction conglomerate",
  },
  {
    name: "NHAI (National Highways Authority of India)",
    industry: "Construction",
    size: "enterprise",
    headquarters: { city: "New Delhi", state: "Delhi" },
    description:
      "Government agency responsible for national highway development",
  },
  {
    name: "Adani Ports & SEZ Ltd",
    industry: "Shipping",
    size: "enterprise",
    headquarters: { city: "Ahmedabad", state: "Gujarat" },
    employeeCount: 15000,
    description: "India's largest port developer and operator",
  },
  {
    name: "Shipping Corporation of India",
    industry: "Shipping",
    size: "large",
    headquarters: { city: "Mumbai", state: "Maharashtra" },
    employeeCount: 5000,
    description: "India's national shipping line",
  },
  {
    name: "Indian Oil Corporation",
    industry: "Oil & Gas",
    size: "enterprise",
    headquarters: { city: "New Delhi", state: "Delhi" },
    employeeCount: 32000,
    annualRevenue: "₹8,55,000 Cr",
    description: "India's largest commercial enterprise",
  },
  {
    name: "Coal India Ltd",
    industry: "Mining",
    size: "enterprise",
    headquarters: { city: "Kolkata", state: "West Bengal" },
    employeeCount: 272000,
    description: "World's largest coal producer",
  },
  {
    name: "NMDC Ltd",
    industry: "Mining",
    size: "large",
    headquarters: { city: "Hyderabad", state: "Telangana" },
    employeeCount: 6000,
    description: "National Mineral Development Corporation",
  },
  {
    name: "Hindalco Industries",
    industry: "Mining",
    size: "enterprise",
    headquarters: { city: "Mumbai", state: "Maharashtra" },
    employeeCount: 20000,
    description: "Aluminium and copper producer (Aditya Birla Group)",
  },
  {
    name: "Asian Paints Ltd",
    industry: "Paint & Coatings",
    size: "large",
    headquarters: { city: "Mumbai", state: "Maharashtra" },
    employeeCount: 8000,
    annualRevenue: "₹34,000 Cr",
    description: "India's largest paint company",
  },
  {
    name: "Berger Paints India Ltd",
    industry: "Paint & Coatings",
    size: "large",
    headquarters: { city: "Kolkata", state: "West Bengal" },
    employeeCount: 4000,
    description: "Second-largest paint company in India",
  },
  {
    name: "Ruchi Soya Industries",
    industry: "Food Processing",
    size: "large",
    headquarters: { city: "Indore", state: "Madhya Pradesh" },
    employeeCount: 3000,
    description: "Major edible oil producer (Patanjali Group)",
  },
  {
    name: "Adani Wilmar Ltd",
    industry: "Food Processing",
    size: "large",
    headquarters: { city: "Ahmedabad", state: "Gujarat" },
    employeeCount: 5000,
    description: "Fortune brand edible oil manufacturer",
  },
  {
    name: "Mahanagar Gas Ltd",
    industry: "Oil & Gas",
    size: "medium",
    headquarters: { city: "Mumbai", state: "Maharashtra" },
    description: "City gas distribution (CNG/PNG)",
  },
  {
    name: "IFFCO (Indian Farmers Fertiliser Cooperative)",
    industry: "Fertilizer",
    size: "enterprise",
    headquarters: { city: "New Delhi", state: "Delhi" },
    employeeCount: 6000,
    description: "World's largest fertilizer cooperative",
  },
  {
    name: "Rashtriya Chemicals & Fertilizers",
    industry: "Fertilizer",
    size: "large",
    headquarters: { city: "Mumbai", state: "Maharashtra" },
    employeeCount: 5000,
    description: "Government fertilizer manufacturer",
  },
  {
    name: "Deepak Fertilisers",
    industry: "Fertilizer",
    size: "medium",
    headquarters: { city: "Pune", state: "Maharashtra" },
    description: "Fertilizer and chemicals manufacturer",
  },
  {
    name: "Grasim Industries",
    industry: "Textiles",
    size: "large",
    headquarters: { city: "Mumbai", state: "Maharashtra" },
    employeeCount: 25000,
    description: "Textiles & VSF manufacturer (Aditya Birla)",
  },
  {
    name: "Welspun India Ltd",
    industry: "Textiles",
    size: "medium",
    headquarters: { city: "Mumbai", state: "Maharashtra" },
    employeeCount: 30000,
    description: "Home textiles manufacturer",
  },
  {
    name: "Reliance Industries Ltd",
    industry: "Oil & Gas",
    size: "enterprise",
    headquarters: { city: "Mumbai", state: "Maharashtra" },
    employeeCount: 340000,
    annualRevenue: "₹9,00,000 Cr",
    description:
      "India's largest private company — refining, petrochemicals, retail, telecom",
  },
  {
    name: "GAIL (India) Ltd",
    industry: "Oil & Gas",
    size: "enterprise",
    headquarters: { city: "New Delhi", state: "Delhi" },
    employeeCount: 4000,
    description:
      "India's largest natural gas processing & distribution company",
  },
  {
    name: "Bharat Heavy Electricals Ltd",
    industry: "Manufacturing",
    size: "enterprise",
    headquarters: { city: "New Delhi", state: "Delhi" },
    employeeCount: 35000,
    description: "Power plant equipment manufacturer",
  },
  {
    name: "NTPC Ltd",
    industry: "Power & Energy",
    size: "enterprise",
    headquarters: { city: "New Delhi", state: "Delhi" },
    employeeCount: 16000,
    description: "India's largest power generation company",
  },
  {
    name: "Torrent Power Ltd",
    industry: "Power & Energy",
    size: "large",
    headquarters: { city: "Ahmedabad", state: "Gujarat" },
    description: "Integrated power utility",
  },
  {
    name: "Dalmia Cement (Bharat) Ltd",
    industry: "Construction",
    size: "large",
    headquarters: { city: "New Delhi", state: "Delhi" },
    description: "Leading cement manufacturer with green focus",
  },
  {
    name: "ACC Ltd",
    industry: "Construction",
    size: "large",
    headquarters: { city: "Mumbai", state: "Maharashtra" },
    employeeCount: 9000,
    description: "Cement and ready-mix concrete producer (Adani Group)",
  },
  {
    name: "IRB Infrastructure Developers",
    industry: "Construction",
    size: "large",
    headquarters: { city: "Mumbai", state: "Maharashtra" },
    description: "Toll road developer, highway construction",
  },
  {
    name: "Ashoka Buildcon Ltd",
    industry: "Construction",
    size: "medium",
    headquarters: { city: "Nashik", state: "Maharashtra" },
    description: "Highway & infrastructure developer",
  },
  {
    name: "PNC Infratech Ltd",
    industry: "Construction",
    size: "medium",
    headquarters: { city: "Agra", state: "Uttar Pradesh" },
    description: "Highway and infrastructure construction",
  },
  {
    name: "Dilip Buildcon Ltd",
    industry: "Construction",
    size: "medium",
    headquarters: { city: "Bhopal", state: "Madhya Pradesh" },
    description: "Road and mining construction",
  },
  {
    name: "Vedanta Ltd",
    industry: "Mining",
    size: "enterprise",
    headquarters: { city: "New Delhi", state: "Delhi" },
    employeeCount: 65000,
    description:
      "Diversified natural resource company — zinc, oil, iron ore, aluminium",
  },
  {
    name: "Tata Chemicals Ltd",
    industry: "Chemicals",
    size: "large",
    headquarters: { city: "Mumbai", state: "Maharashtra" },
    description: "Soda ash & specialty chemicals manufacturer",
  },
  {
    name: "BASF India Ltd",
    industry: "Chemicals",
    size: "large",
    headquarters: { city: "Mumbai", state: "Maharashtra" },
    description: "Chemical company — coatings, performance materials",
  },
  {
    name: "Pidilite Industries",
    industry: "Chemicals",
    size: "large",
    headquarters: { city: "Mumbai", state: "Maharashtra" },
    employeeCount: 6000,
    description: "Adhesives, sealants & construction chemicals (Fevicol)",
  },
  {
    name: "Marico Ltd",
    industry: "Food Processing",
    size: "large",
    headquarters: { city: "Mumbai", state: "Maharashtra" },
    description: "Edible oils, hair oils, health foods",
  },
  {
    name: "Godrej Industries",
    industry: "Manufacturing",
    size: "large",
    headquarters: { city: "Mumbai", state: "Maharashtra" },
    description: "Chemicals, real estate, FMCG conglomerate",
  },
  {
    name: "Thermax Ltd",
    industry: "Manufacturing",
    size: "medium",
    headquarters: { city: "Pune", state: "Maharashtra" },
    description: "Industrial boilers, heating, cooling equipment",
  },
  {
    name: "Blue Star Ltd",
    industry: "Manufacturing",
    size: "medium",
    headquarters: { city: "Mumbai", state: "Maharashtra" },
    description: "AC, commercial refrigeration, water purifiers",
  },
  {
    name: "Cochin Shipyard Ltd",
    industry: "Shipping",
    size: "large",
    headquarters: { city: "Kochi", state: "Kerala" },
    description: "Ship building and repair",
  },
  {
    name: "Mazagon Dock Shipbuilders",
    industry: "Shipping",
    size: "large",
    headquarters: { city: "Mumbai", state: "Maharashtra" },
    description: "Ship & submarine builder (Defence)",
  },
  {
    name: "Transport Corporation of India",
    industry: "Transport",
    size: "medium",
    headquarters: { city: "Gurugram", state: "Haryana" },
    description: "Multi-modal logistics operator with fleet of trucks",
  },
  {
    name: "VRL Logistics Ltd",
    industry: "Transport",
    size: "medium",
    headquarters: { city: "Hubli", state: "Karnataka" },
    employeeCount: 18000,
    description: "Transport and logistics with 5000+ vehicles",
  },
  {
    name: "Haldia Petrochemicals Ltd",
    industry: "Oil & Gas",
    size: "large",
    headquarters: { city: "Haldia", state: "West Bengal" },
    description: "Naphtha-based petrochemicals complex",
  },
  {
    name: "Supreme Industries Ltd",
    industry: "Manufacturing",
    size: "medium",
    headquarters: { city: "Mumbai", state: "Maharashtra" },
    description: "Plastic products — pipes, packaging, industrial",
  },
  {
    name: "Finolex Industries",
    industry: "Manufacturing",
    size: "medium",
    headquarters: { city: "Pune", state: "Maharashtra" },
    description: "PVC pipes, fittings manufacturer",
  },
  {
    name: "Gujarat State Fertilizers",
    industry: "Fertilizer",
    size: "large",
    headquarters: { city: "Vadodara", state: "Gujarat" },
    description: "Fertilizer, chemicals & packaging producer",
  },
  {
    name: "Chambal Fertilisers",
    industry: "Fertilizer",
    size: "large",
    headquarters: { city: "New Delhi", state: "Delhi" },
    description: "Urea & complex fertilizer manufacturer (KK Birla Group)",
  },
];

// ─── Demo Sources (15) ────────────────────────────────────────
const demoSources = [
  {
    name: "GeM - Government e-Marketplace",
    type: "tender_portal",
    url: "https://gem.gov.in",
    description: "Government procurement portal",
    config: {
      isRSS: false,
      selectors: {
        container: ".tender-item",
        title: ".tender-title",
        description: ".tender-desc",
      },
    },
    status: "active",
    reliability: 85,
  },
  {
    name: "CPPP - Central Public Procurement Portal",
    type: "tender_portal",
    url: "https://eprocure.gov.in",
    description: "Central govt tender portal",
    config: { isRSS: false },
    status: "active",
    reliability: 80,
  },
  {
    name: "TenderTiger",
    type: "tender_portal",
    url: "https://www.tendertiger.com",
    description: "Private tender aggregator",
    config: { isRSS: false },
    status: "active",
    reliability: 70,
  },
  {
    name: "Economic Times - Energy",
    type: "news_site",
    url: "https://economictimes.indiatimes.com/industry/energy",
    description: "ET energy news",
    config: { isRSS: true },
    status: "active",
    reliability: 75,
  },
  {
    name: "Moneycontrol - Infrastructure",
    type: "news_site",
    url: "https://www.moneycontrol.com/news/business/infrastructure/",
    description: "Infrastructure sector news",
    config: { isRSS: false },
    status: "active",
    reliability: 70,
  },
  {
    name: "IndustryAbout - India Directory",
    type: "industry_directory",
    url: "https://www.industryabout.com/india",
    description: "Industrial facilities directory",
    config: { isRSS: false },
    status: "active",
    reliability: 65,
  },
  {
    name: "IndiaMART - Petroleum",
    type: "industry_directory",
    url: "https://www.indiamart.com",
    description: "B2B marketplace",
    config: { isRSS: false },
    status: "active",
    reliability: 60,
  },
  {
    name: "NHAI Tenders",
    type: "tender_portal",
    url: "https://www.nhai.gov.in/tenders",
    description: "Road construction tenders",
    config: { isRSS: false },
    status: "active",
    reliability: 90,
  },
  {
    name: "Business Standard - Commodities",
    type: "news_site",
    url: "https://www.business-standard.com/commodities",
    description: "Commodity market news",
    config: { isRSS: true },
    status: "active",
    reliability: 72,
  },
  {
    name: "Ministry of Petroleum RSS",
    type: "tender_portal",
    url: "https://www.petroleum.nic.in",
    description: "Ministry of Petroleum news",
    config: { isRSS: true },
    status: "active",
    reliability: 80,
  },
  {
    name: "Zauba Corp - Import Data",
    type: "industry_directory",
    url: "https://www.zaubacorp.com",
    description: "Company & import/export data",
    config: { isRSS: false },
    status: "active",
    reliability: 55,
  },
  {
    name: "LiveMint - Industry",
    type: "news_site",
    url: "https://www.livemint.com/industry",
    description: "Industry news",
    config: { isRSS: true },
    status: "active",
    reliability: 68,
  },
  {
    name: "BidDetail - Petroleum Tenders",
    type: "tender_portal",
    url: "https://www.biddetail.com",
    description: "Tender aggregator for petroleum sector",
    config: { isRSS: false },
    status: "active",
    reliability: 60,
  },
  {
    name: "MCA Company Directory",
    type: "industry_directory",
    url: "https://www.mca.gov.in",
    description: "Ministry of Corporate Affairs registry",
    config: { isRSS: false },
    status: "paused",
    reliability: 75,
  },
  {
    name: "Indian Oil Tenders",
    type: "tender_portal",
    url: "https://iocl.com/tenders",
    description: "IOCL tender/bid portal for benchmarking",
    config: { isRSS: false },
    status: "active",
    reliability: 65,
  },
];

// ─── Generated Lead Templates (we'll create 300+ leads) ──────
const leadTemplates = [
  {
    title: "Tender for supply of HSD to {company} mining operations",
    sourceType: "tender",
    text: "Requirement: 5000 KL High Speed Diesel for mining fleet operations. Annual contract for heavy earth moving equip. Bulk supply needed at mine site. Last date: 45 days.",
  },
  {
    title: "{company} expanding steel plant — FO requirement",
    sourceType: "news",
    text: "Announces capacity expansion of 2 MTPA. New blast furnace commissioning requires furnace oil supply for reheating furnaces. Bulk FO procurement planned.",
  },
  {
    title: "Bitumen supply for {company} highway project",
    sourceType: "tender",
    text: "NHAI awarded 120km highway construction project. VG-30 and CRMB bitumen required. Estimated 8000 MT over 24 months. Urgent supply needed at construction site.",
  },
  {
    title: "{company} seeks hexane for solvent extraction plant",
    sourceType: "directory",
    text: "Setting up new edible oil solvent extraction plant. Requires food-grade hexane supply. 200 MT/month. Long-term contract preferred.",
  },
  {
    title: "Marine fuel bunkering opportunity at {company}",
    sourceType: "news",
    text: "Port expansion enables larger vessel bunkering. VLSFO and marine gas oil demand expected to grow 40%. New bunkering facility commissioning.",
  },
  {
    title: "{company} - Diesel requirement for DG sets",
    sourceType: "directory",
    text: "Multiple factory locations require HSD supply for standby DG sets. Combined capacity 15 MW. Monthly requirement: 50 KL HSD.",
  },
  {
    title: "Road construction tender — bitumen for {company}",
    sourceType: "tender",
    text: "State highway department tender for 4-lane road construction. Bitumen grade VG-30 and emulsion required. Total estimated quantity: 3500 MT.",
  },
  {
    title: "{company} procurement of LDO for textile mills",
    sourceType: "tender",
    text: "Textile manufacturing unit requires Light Diesel Oil for burner operations. Spinning and dyeing processes. 100 KL/month. Competitive rates desired.",
  },
  {
    title: "{company} LSHS requirement for power generation",
    sourceType: "news",
    text: "Captive power plant running on low sulphur heavy stock. Current supplier contract expiring. Seeking new supply arrangement for 500 MT/month.",
  },
  {
    title: "Propylene supply for {company} polymer plant",
    sourceType: "directory",
    text: "Polypropylene manufacturing unit requires propylene feedstock. Current capacity 400 KTPA. Looking for additional suppliers.",
  },
  {
    title: "{company} MTO requirement for paint manufacturing",
    sourceType: "directory",
    text: "Paint manufacturing facility requires Mineral Turpentine Oil as solvent base. 80 KL/month. ISI grade preferred.",
  },
  {
    title: "Solvent 1425 for {company} rubber processing",
    sourceType: "directory",
    text: "Rubber product manufacturing requires Solvent 1425 for processing. Monthly requirement of 30 KL. Must meet BIS standards.",
  },
  {
    title: "{company} sulphur procurement for DAP production",
    sourceType: "tender",
    text: "Fertilizer plant requires sulphur for phosphoric acid and DAP production. Annual requirement 60000 MT. Ships to Kandla/Paradip port.",
  },
  {
    title: "SKO distribution contract for {company}",
    sourceType: "tender",
    text: "Government distribution agency requires SKO for PDS. Monthly allocation: 500 KL. Multiple delivery points across district.",
  },
  {
    title: "FO supply for {company} cement kiln",
    sourceType: "news",
    text: "Cement plant switching from pet coke to furnace oil. Two rotary kilns require FO supply. Estimated 300 MT/month. Near Rajasthan plant.",
  },
  {
    title: "{company} fleet diesel supply agreement",
    sourceType: "directory",
    text: "Transport company with 3000+ trucks seeking bulk diesel supply agreement. 5 lakh litres/month across 12 depots. Pan-India supply needed.",
  },
  {
    title: "Bitumen emulsion for {company} road maintenance",
    sourceType: "tender",
    text: "Annual road maintenance contract. Requires bitumen emulsion MS, SS grades. 500 MT estimated. Multiple municipal areas.",
  },
  {
    title: "{company} petrochemical unit — naphtha/propylene",
    sourceType: "news",
    text: "New petrochemical complex announced. Cracker unit will need propylene. Downstream PP plant capacity 200 KTPA. Commissioning in 18 months.",
  },
  {
    title: "Boiler fuel (FO) for {company} sugar mill",
    sourceType: "directory",
    text: "Sugar mill co-generation plant. Backup fuel oil required for boilers during non-crushing season. 100 MT/month for 6 months.",
  },
  {
    title: "{company} diesel for construction equipment",
    sourceType: "tender",
    text: "Large construction project. HSD requirement for excavators, dumpers, cranes. Estimated 200 KL/month at project site. 3-year project.",
  },
  {
    title: "Chemical grade sulphur for {company}",
    sourceType: "tender",
    text: "Chemical manufacturing plant requires sulphur for sulphuric acid production. Granulated sulphur preferred. 2000 MT/month.",
  },
  {
    title: "{company} commissioning new thermal plant — FO/LSHS",
    sourceType: "news",
    text: "Thermal power station commissioning 500 MW unit. Startup fuel requirement: LSHS and FO. Also needs HSD for DG backup.",
  },
  {
    title: "Hexane for {company} rice bran oil extraction",
    sourceType: "directory",
    text: "Rice bran oil processing plant. Hexane needed for solvent extraction. 150 MT/month. Food grade certification required.",
  },
  {
    title: "{company} seeking bulk diesel for mining fleet",
    sourceType: "tender",
    text: "Open-cast mining operations. 500+ heavy vehicles. HSD bulk supply with on-site storage. Annual contract value ₹50 Cr+.",
  },
  {
    title: "{company} waterproofing project — bitumen needs",
    sourceType: "directory",
    text: "Real estate developer — waterproofing for 5 residential tower basements. Bitumen grade 80/100 required. Estimated 200 MT.",
  },
];

const indianStates = [
  "Maharashtra",
  "Gujarat",
  "Tamil Nadu",
  "Karnataka",
  "Rajasthan",
  "Uttar Pradesh",
  "West Bengal",
  "Madhya Pradesh",
  "Andhra Pradesh",
  "Telangana",
  "Kerala",
  "Punjab",
  "Haryana",
  "Delhi",
  "Odisha",
  "Bihar",
  "Jharkhand",
  "Chhattisgarh",
  "Assam",
  "Goa",
];

const cities = {
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Jamnagar"],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Salem",
    "Tiruchirappalli",
  ],
  Karnataka: ["Bengaluru", "Mysuru", "Hubli", "Mangalore", "Belgaum"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Allahabad"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Haldia", "Siliguri"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior"],
  Delhi: ["New Delhi", "Delhi"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Tirupati"],
  Telangana: ["Hyderabad", "Warangal", "Karimnagar"],
  Kerala: ["Kochi", "Thiruvananthapuram", "Kozhikode"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar"],
  Haryana: ["Gurugram", "Faridabad", "Panipat"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela"],
  Bihar: ["Patna", "Gaya", "Muzaffarpur"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad"],
  Chhattisgarh: ["Raipur", "Bhilai", "Bilaspur"],
  Assam: ["Guwahati", "Silchar", "Dibrugarh"],
  Goa: ["Panaji", "Margao", "Vasco da Gama"],
};

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysBack) {
  const now = Date.now();
  return new Date(now - Math.random() * daysBack * 24 * 60 * 60 * 1000);
}

// ─── Seed Function ────────────────────────────────────────────
async function seedDatabase() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/lead-intel";

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB for seeding");

    // Clear existing data
    await Promise.all([
      Company.deleteMany({}),
      Lead.deleteMany({}),
      Source.deleteMany({}),
      Activity.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log("Cleared existing data");

    // Check if admin user exists, create if not
    let adminUser = await User.findOne({ email: "admin@leadintel.com" });
    if (!adminUser) {
      adminUser = await User.create({
        name: "Admin User",
        email: "admin@leadintel.com",
        password: "admin123",
        role: "admin",
        territory: "All India",
        phone: "+91-9000000001",
        whatsappNumber: "+919000000001",
      });
      console.log("Admin user created: admin@leadintel.com / admin123");
    }

    // Create a demo sales officer
    let salesUser = await User.findOne({ email: "sales@leadintel.com" });
    if (!salesUser) {
      salesUser = await User.create({
        name: "Priya Sharma",
        email: "sales@leadintel.com",
        password: "sales123",
        role: "sales_officer",
        territory: "Western Region",
        phone: "+91-9000000002",
        whatsappNumber: "+919000000002",
      });
      console.log("Sales user created: sales@leadintel.com / sales123");
    }

    let managerUser = await User.findOne({ email: "manager@leadintel.com" });
    if (!managerUser) {
      managerUser = await User.create({
        name: "Vikram Singh",
        email: "manager@leadintel.com",
        password: "manager123",
        role: "manager",
        territory: "Northern Region",
        phone: "+91-9000000003",
        whatsappNumber: "+919000000003",
      });
      console.log("Manager user created: manager@leadintel.com / manager123");
    }

    const users = [adminUser, salesUser, managerUser];

    // Create companies
    const createdCompanies = await Company.insertMany(
      demoCompanies.map((c) => ({
        ...c,
        headquarters: {
          ...c.headquarters,
          coordinates: {
            lat: 20 + Math.random() * 12,
            lng: 72 + Math.random() * 15,
          },
        },
        aliases: [],
        tags: [c.industry.toLowerCase()],
        status: "active",
        source: "seed",
      })),
    );
    console.log(`Created ${createdCompanies.length} companies`);

    // Create sources
    const createdSources = await Source.insertMany(
      demoSources.map((s) => ({
        ...s,
        schedule: {
          enabled: true,
          intervalMinutes: 60,
          cronExpression: "0 * * * *",
        },
        addedBy: adminUser._id,
        crawlCount: randomInt(5, 50),
        leadsGenerated: randomInt(2, 30),
        lastCrawled: randomDate(7),
        lastSuccess: randomDate(7),
      })),
    );
    console.log(`Created ${createdSources.length} sources`);

    // Generate leads (300+)
    const leadsToCreate = [];
    const statuses = [
      "new",
      "contacted",
      "qualified",
      "proposal",
      "negotiation",
      "won",
      "lost",
    ];
    const feedbackStatuses = ["pending", "accepted", "rejected", "converted"];

    for (let i = 0; i < 320; i++) {
      const company = randomPick(createdCompanies);
      const template = randomPick(leadTemplates);
      const source = randomPick(createdSources);
      const state = company.headquarters?.state || randomPick(indianStates);
      const city = cities[state] ? randomPick(cities[state]) : state;
      const status = randomPick(statuses);
      const assignedUser = randomPick(users);

      const text = template.text.replace(/{company}/g, company.name);
      const title = template.title.replace(/{company}/g, company.name);

      const inferredProducts = inferProducts(text, company.industry);
      const createdAt = randomDate(60);

      const lead = {
        title: title,
        company: company._id,
        companyName: company.name,
        status: status,
        source: {
          type: template.sourceType,
          name: source.name,
          url: source.url,
          scrapedAt: createdAt,
          rawSnippet: text,
        },
        inferredProducts: inferredProducts,
        location: { city: city, state: state, region: state },
        dossier: {
          companyProfile:
            company.description || `${company.name} — ${company.industry}`,
          procurementClues: [text],
          productFit: inferredProducts.map((p) => p.productName).join(", "),
          urgencyIndicators: [],
          nextAction: randomPick([
            "Schedule introductory call with procurement head",
            "Send product catalog and price list",
            "Arrange site visit and technical presentation",
            "Submit tender response by deadline",
            "Follow up on previous proposal",
            "Negotiate contract terms",
          ]),
          estimatedDealValue: `₹${randomInt(10, 500)} Lakhs`,
        },
        assignedTo: assignedUser._id,
        territory: assignedUser.territory,
        tags: [
          template.sourceType,
          ...inferredProducts.map((p) => p.productCode),
        ],
        notes: "",
        createdAt: createdAt,
        updatedAt: createdAt,
      };

      // Set feedback for some leads
      if (["won", "lost"].includes(status) || Math.random() > 0.6) {
        const fbStatus =
          status === "won"
            ? "converted"
            : status === "lost"
              ? "rejected"
              : randomPick(feedbackStatuses);
        lead.feedback = {
          status: fbStatus,
          reason:
            fbStatus === "rejected"
              ? randomPick([
                  "Price too high",
                  "Already has supplier",
                  "Not responsive",
                  "Out of territory",
                ])
              : fbStatus === "converted"
                ? "Deal closed successfully"
                : fbStatus === "accepted"
                  ? "Good potential, proceeding"
                  : "",
          feedbackAt: new Date(
            createdAt.getTime() + randomInt(1, 14) * 86400000,
          ),
          feedbackBy: assignedUser._id,
          conversionValue:
            fbStatus === "converted" ? randomInt(10, 500) * 100000 : 0,
        };
      }

      leadsToCreate.push(lead);
    }

    const createdLeads = await Lead.insertMany(leadsToCreate);
    console.log(`Created ${createdLeads.length} leads`);

    // Score all leads
    console.log("Scoring leads...");
    for (const lead of createdLeads) {
      const company = createdCompanies.find(
        (c) => c._id.toString() === lead.company.toString(),
      );
      const scoreResult = scoreLead(lead, company);
      await Lead.findByIdAndUpdate(lead._id, {
        score: scoreResult.totalScore,
        scoreBreakdown: scoreResult.breakdown,
        scoreExplanation: scoreResult.explanation,
        priority: scoreResult.priority,
      });
    }
    console.log("All leads scored");

    // Create sample activities
    const activities = [];
    for (let i = 0; i < 50; i++) {
      const lead = randomPick(createdLeads);
      const user = randomPick(users);
      activities.push({
        user: user._id,
        type: randomPick([
          "lead_created",
          "lead_updated",
          "lead_assigned",
          "lead_scored",
          "feedback_given",
          "source_crawled",
        ]),
        title: `Activity on ${lead.companyName}`,
        description: `${user.name} performed an action on lead "${lead.title}"`,
        lead: lead._id,
        company: lead.company,
        createdAt: randomDate(30),
      });
    }
    await Activity.insertMany(activities);
    console.log(`Created ${activities.length} activity records`);

    // Create sample notifications
    const notifications = [];
    for (let i = 0; i < 25; i++) {
      const lead = randomPick(createdLeads);
      const user = randomPick(users);
      notifications.push({
        user: user._id,
        lead: lead._id,
        type: randomPick([
          "new_lead",
          "lead_update",
          "score_change",
          "assignment",
        ]),
        title: `Notification: ${lead.companyName}`,
        message: `New opportunity detected for ${lead.companyName} — Score: ${lead.score || 50}`,
        priority: randomPick(["low", "medium", "high", "critical"]),
        channels: {
          inApp: { sent: true, read: Math.random() > 0.5 },
          whatsapp: {
            sent: Math.random() > 0.7,
            sentAt: randomDate(7),
            status: "sent",
          },
        },
        actionUrl: `/leads`,
        actionLabel: "View Lead",
        createdAt: randomDate(14),
      });
    }
    await Notification.insertMany(notifications);
    console.log(`Created ${notifications.length} notifications`);

    console.log("\n✅ Seed complete!");
    console.log(`  Companies: ${createdCompanies.length}`);
    console.log(`  Leads: ${createdLeads.length}`);
    console.log(`  Sources: ${createdSources.length}`);
    console.log(`  Activities: ${activities.length}`);
    console.log(`  Notifications: ${notifications.length}`);
    console.log(`  Users: admin@leadintel.com / admin123`);
    console.log(`         sales@leadintel.com / sales123`);
    console.log(`         manager@leadintel.com / manager123`);
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedDatabase();
