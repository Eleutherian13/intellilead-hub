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
  // ── Additional 160 companies for 200+ total ──
  { name: "Birla Jute Mills", industry: "Textiles", size: "medium", headquarters: { city: "Kolkata", state: "West Bengal" }, description: "Jute products manufacturer" },
  { name: "Gloster Ltd", industry: "Textiles", size: "medium", headquarters: { city: "Kolkata", state: "West Bengal" }, description: "Jute and jute products exporter" },
  { name: "Cheviot Company Ltd", industry: "Textiles", size: "medium", headquarters: { city: "Kolkata", state: "West Bengal" }, description: "Jute yarn and fabric manufacturer" },
  { name: "Ludlow Jute & Specialities", industry: "Textiles", size: "small", headquarters: { city: "Howrah", state: "West Bengal" }, description: "Jute sacking, hessian, carpet backing" },
  { name: "Nagreeka Exports Ltd", industry: "Textiles", size: "small", headquarters: { city: "Kolkata", state: "West Bengal" }, description: "Jute goods and textile exporter" },
  { name: "Alliance Jute Products", industry: "Textiles", size: "small", headquarters: { city: "Hooghly", state: "West Bengal" }, description: "Jute bags and geo-textiles" },
  { name: "Hooghly Infrastructure Pvt Ltd", industry: "Construction", size: "medium", headquarters: { city: "Kolkata", state: "West Bengal" }, description: "Road and bridge construction" },
  { name: "Sadbhav Engineering Ltd", industry: "Construction", size: "large", headquarters: { city: "Ahmedabad", state: "Gujarat" }, employeeCount: 8000, description: "BOT highway developer" },
  { name: "GR Infraprojects Ltd", industry: "Construction", size: "large", headquarters: { city: "Udaipur", state: "Rajasthan" }, description: "Road EPC contractor" },
  { name: "NCC Ltd", industry: "Construction", size: "large", headquarters: { city: "Hyderabad", state: "Telangana" }, employeeCount: 10000, description: "Infrastructure and building construction" },
  { name: "KNR Constructions Ltd", industry: "Construction", size: "medium", headquarters: { city: "Hyderabad", state: "Telangana" }, description: "Highway and irrigation projects" },
  { name: "HG Infra Engineering Ltd", industry: "Construction", size: "medium", headquarters: { city: "Jaipur", state: "Rajasthan" }, description: "Road EPC company" },
  { name: "J Kumar Infraprojects", industry: "Construction", size: "medium", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Metro rail, flyovers, tunnels" },
  { name: "Gayatri Projects Ltd", industry: "Construction", size: "medium", headquarters: { city: "Hyderabad", state: "Telangana" }, description: "Roads, irrigation, industrial" },
  { name: "Simplex Infrastructures", industry: "Construction", size: "large", headquarters: { city: "Kolkata", state: "West Bengal" }, description: "Multi-sector construction" },
  { name: "ITD Cementation India", industry: "Construction", size: "large", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Marine, tunneling, highways" },
  { name: "Hindustan Zinc Ltd", industry: "Mining", size: "large", headquarters: { city: "Udaipur", state: "Rajasthan" }, employeeCount: 4000, description: "Zinc and lead smelter" },
  { name: "MOIL Ltd", industry: "Mining", size: "medium", headquarters: { city: "Nagpur", state: "Maharashtra" }, description: "Manganese ore producer" },
  { name: "Gujarat Mineral Development Corp", industry: "Mining", size: "medium", headquarters: { city: "Ahmedabad", state: "Gujarat" }, description: "Lignite and other mineral mining" },
  { name: "Singareni Collieries", industry: "Mining", size: "large", headquarters: { city: "Kothagudem", state: "Telangana" }, description: "Coal mining company" },
  { name: "Sesa Goa (Vedanta)", industry: "Mining", size: "large", headquarters: { city: "Panaji", state: "Goa" }, description: "Iron ore mining and export" },
  { name: "National Aluminium Company (NALCO)", industry: "Mining", size: "large", headquarters: { city: "Bhubaneswar", state: "Odisha" }, employeeCount: 7000, description: "Bauxite mining and aluminium smelter" },
  { name: "JSW Cement Ltd", industry: "Construction", size: "large", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Green cement manufacturer" },
  { name: "Shree Cement Ltd", industry: "Construction", size: "large", headquarters: { city: "Beawar", state: "Rajasthan" }, employeeCount: 4000, description: "Cement with power generation" },
  { name: "JK Cement Ltd", industry: "Construction", size: "large", headquarters: { city: "Kanpur", state: "Uttar Pradesh" }, description: "Grey and white cement" },
  { name: "India Cements Ltd", industry: "Construction", size: "large", headquarters: { city: "Chennai", state: "Tamil Nadu" }, description: "South India cement leader" },
  { name: "Ramco Cements", industry: "Construction", size: "large", headquarters: { city: "Chennai", state: "Tamil Nadu" }, description: "Cement and dry mortar" },
  { name: "Birla Corporation", industry: "Construction", size: "large", headquarters: { city: "Kolkata", state: "West Bengal" }, description: "Cement manufacturer (M.P. Birla)" },
  { name: "Dangote Cement (India)", industry: "Construction", size: "medium", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Cement producer" },
  { name: "Orient Cement", industry: "Construction", size: "medium", headquarters: { city: "New Delhi", state: "Delhi" }, description: "Cement manufacturing (CK Birla)" },
  { name: "Kisan Mouldings Ltd", industry: "Manufacturing", size: "small", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "PVC pipes and fittings" },
  { name: "Century Textiles & Industries", industry: "Textiles", size: "large", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Textiles, paper, and real estate (B.K. Birla)" },
  { name: "Raymond Ltd", industry: "Textiles", size: "large", headquarters: { city: "Mumbai", state: "Maharashtra" }, employeeCount: 15000, description: "Fabrics and fashion brand" },
  { name: "Vardhman Textiles", industry: "Textiles", size: "large", headquarters: { city: "Ludhiana", state: "Punjab" }, employeeCount: 25000, description: "Yarn, fabrics, acrylic fiber" },
  { name: "Arvind Ltd", industry: "Textiles", size: "large", headquarters: { city: "Ahmedabad", state: "Gujarat" }, employeeCount: 20000, description: "Denim and branded apparel" },
  { name: "Trident Ltd", industry: "Textiles", size: "large", headquarters: { city: "Ludhiana", state: "Punjab" }, employeeCount: 15000, description: "Terry towels, yarn, paper" },
  { name: "Indo Count Industries", industry: "Textiles", size: "medium", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Bed linen and home textiles" },
  { name: "Bombay Dyeing", industry: "Textiles", size: "medium", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Textiles and real estate" },
  { name: "Mangalore Refinery & Petrochemicals", industry: "Oil & Gas", size: "large", headquarters: { city: "Mangalore", state: "Karnataka" }, employeeCount: 2000, description: "Oil refinery (ONGC subsidiary)" },
  { name: "Chennai Petroleum Corp", industry: "Oil & Gas", size: "large", headquarters: { city: "Chennai", state: "Tamil Nadu" }, description: "Oil refinery (IOCL subsidiary)" },
  { name: "Numaligarh Refinery Ltd", industry: "Oil & Gas", size: "medium", headquarters: { city: "Numaligarh", state: "Assam" }, description: "Crude oil refining in NE India" },
  { name: "Essar Oil (Nayara Energy)", industry: "Oil & Gas", size: "enterprise", headquarters: { city: "Mumbai", state: "Maharashtra" }, employeeCount: 3000, description: "Vadinar refinery operator" },
  { name: "Zuari Agro Chemicals", industry: "Fertilizer", size: "medium", headquarters: { city: "Panaji", state: "Goa" }, description: "Fertilizer and chemical producer" },
  { name: "Coromandel International", industry: "Fertilizer", size: "large", headquarters: { city: "Hyderabad", state: "Telangana" }, description: "Fertilizer and crop protection" },
  { name: "National Fertilizers Ltd", industry: "Fertilizer", size: "large", headquarters: { city: "New Delhi", state: "Delhi" }, employeeCount: 5000, description: "Govt urea manufacturer" },
  { name: "Madras Fertilizers Ltd", industry: "Fertilizer", size: "medium", headquarters: { city: "Chennai", state: "Tamil Nadu" }, description: "Fertilizer and complex nutrients" },
  { name: "Mangalore Chemicals & Fertilizers", industry: "Fertilizer", size: "medium", headquarters: { city: "Mangalore", state: "Karnataka" }, description: "Fertilizer manufacturing (Zuari-Adventz)" },
  { name: "FACT (Fertilisers and Chemicals Travancore)", industry: "Fertilizer", size: "medium", headquarters: { city: "Kochi", state: "Kerala" }, description: "Govt fertilizer company" },
  { name: "SRF Ltd", industry: "Chemicals", size: "large", headquarters: { city: "Gurugram", state: "Haryana" }, employeeCount: 8000, description: "Fluorochemicals, packaging, tech textiles" },
  { name: "Aarti Industries", industry: "Chemicals", size: "large", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Specialty chemicals and pharmaceuticals" },
  { name: "Navin Fluorine International", industry: "Chemicals", size: "medium", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Fluorine chemistry specialist" },
  { name: "Deepak Nitrite Ltd", industry: "Chemicals", size: "large", headquarters: { city: "Vadodara", state: "Gujarat" }, description: "Basic and fine chemicals" },
  { name: "Gujarat Fluorochemicals", industry: "Chemicals", size: "medium", headquarters: { city: "Noida", state: "Uttar Pradesh" }, description: "PTFE and fluoropolymers (INOX)" },
  { name: "Alkyl Amines Chemicals", industry: "Chemicals", size: "medium", headquarters: { city: "Pune", state: "Maharashtra" }, description: "Aliphatic amines producer" },
  { name: "Clean Science and Technology", industry: "Chemicals", size: "medium", headquarters: { city: "Pune", state: "Maharashtra" }, description: "Performance chemicals" },
  { name: "Balaji Amines Ltd", industry: "Chemicals", size: "medium", headquarters: { city: "Solapur", state: "Maharashtra" }, description: "Amines and solvents manufacturer" },
  { name: "Tata Power Company", industry: "Power & Energy", size: "enterprise", headquarters: { city: "Mumbai", state: "Maharashtra" }, employeeCount: 12000, description: "Integrated power company" },
  { name: "Adani Power Ltd", industry: "Power & Energy", size: "enterprise", headquarters: { city: "Ahmedabad", state: "Gujarat" }, description: "Thermal power generation" },
  { name: "JSW Energy Ltd", industry: "Power & Energy", size: "large", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Power generation company" },
  { name: "CESC Ltd", industry: "Power & Energy", size: "large", headquarters: { city: "Kolkata", state: "West Bengal" }, description: "Kolkata power distribution (RP-SG)" },
  { name: "Reliance Power Ltd", industry: "Power & Energy", size: "large", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Thermal and solar power" },
  { name: "NHPC Ltd", industry: "Power & Energy", size: "large", headquarters: { city: "Faridabad", state: "Haryana" }, description: "Hydroelectric power generation" },
  { name: "Sundaram-Clayton Ltd", industry: "Manufacturing", size: "medium", headquarters: { city: "Chennai", state: "Tamil Nadu" }, description: "Auto component manufacturer" },
  { name: "Ashok Leyland Ltd", industry: "Manufacturing", size: "enterprise", headquarters: { city: "Chennai", state: "Tamil Nadu" }, employeeCount: 20000, description: "Commercial vehicle manufacturer" },
  { name: "Tata Motors Ltd", industry: "Manufacturing", size: "enterprise", headquarters: { city: "Mumbai", state: "Maharashtra" }, employeeCount: 82000, annualRevenue: "₹3,46,000 Cr", description: "Auto manufacturer — trucks, buses, cars" },
  { name: "Mahindra & Mahindra Ltd", industry: "Manufacturing", size: "enterprise", headquarters: { city: "Mumbai", state: "Maharashtra" }, employeeCount: 50000, description: "Auto, farm equipment, IT" },
  { name: "Maruti Suzuki India", industry: "Manufacturing", size: "enterprise", headquarters: { city: "New Delhi", state: "Delhi" }, employeeCount: 35000, description: "India's largest car manufacturer" },
  { name: "Hero MotoCorp", industry: "Manufacturing", size: "enterprise", headquarters: { city: "New Delhi", state: "Delhi" }, employeeCount: 9000, description: "World's largest two-wheeler manufacturer" },
  { name: "Bajaj Auto Ltd", industry: "Manufacturing", size: "enterprise", headquarters: { city: "Pune", state: "Maharashtra" }, employeeCount: 10000, description: "Two-wheeler and three-wheeler manufacturer" },
  { name: "Eicher Motors (Royal Enfield)", industry: "Manufacturing", size: "large", headquarters: { city: "Chennai", state: "Tamil Nadu" }, description: "Motorcycles and commercial vehicles" },
  { name: "TVS Motor Company", industry: "Manufacturing", size: "large", headquarters: { city: "Chennai", state: "Tamil Nadu" }, employeeCount: 8000, description: "Two-wheeler manufacturer" },
  { name: "Bharat Forge Ltd", industry: "Manufacturing", size: "large", headquarters: { city: "Pune", state: "Maharashtra" }, description: "Forging and auto components" },
  { name: "Cummins India Ltd", industry: "Manufacturing", size: "large", headquarters: { city: "Pune", state: "Maharashtra" }, employeeCount: 8000, description: "Diesel engines and gensets" },
  { name: "Kirloskar Oil Engines", industry: "Manufacturing", size: "medium", headquarters: { city: "Pune", state: "Maharashtra" }, description: "DG sets and industrial engines" },
  { name: "Caterpillar India Pvt Ltd", industry: "Manufacturing", size: "large", headquarters: { city: "Chennai", state: "Tamil Nadu" }, description: "Earth-moving and mining equipment" },
  { name: "Escorts Kubota Ltd", industry: "Manufacturing", size: "large", headquarters: { city: "Faridabad", state: "Haryana" }, description: "Tractors and construction equipment" },
  { name: "JCB India Ltd", industry: "Manufacturing", size: "large", headquarters: { city: "New Delhi", state: "Delhi" }, description: "Construction and earth-moving machines" },
  { name: "Shriram Pistons & Rings", industry: "Manufacturing", size: "medium", headquarters: { city: "New Delhi", state: "Delhi" }, description: "Auto engine parts" },
  { name: "Sundaram Fasteners Ltd", industry: "Manufacturing", size: "medium", headquarters: { city: "Chennai", state: "Tamil Nadu" }, description: "High-tensile fasteners and auto parts" },
  { name: "Adani Enterprises Ltd", industry: "Mining", size: "enterprise", headquarters: { city: "Ahmedabad", state: "Gujarat" }, description: "Coal trading and mining" },
  { name: "Tata Metaliks Ltd", industry: "Steel", size: "medium", headquarters: { city: "Kolkata", state: "West Bengal" }, description: "Pig iron and ductile iron pipes" },
  { name: "Jindal Stainless Ltd", industry: "Steel", size: "large", headquarters: { city: "New Delhi", state: "Delhi" }, description: "Stainless steel manufacturer" },
  { name: "Steel Authority of India (SAIL)", industry: "Steel", size: "enterprise", headquarters: { city: "New Delhi", state: "Delhi" }, employeeCount: 65000, description: "Govt steel producer — Bhilai, Bokaro, Rourkela" },
  { name: "Rashtriya Ispat Nigam (RINL)", industry: "Steel", size: "large", headquarters: { city: "Visakhapatnam", state: "Andhra Pradesh" }, description: "Govt steel plant at Vizag" },
  { name: "Electrosteel Castings", industry: "Steel", size: "medium", headquarters: { city: "Kolkata", state: "West Bengal" }, description: "DI pipes and pig iron" },
  { name: "Mishra Dhatu Nigam (MIDHANI)", industry: "Steel", size: "medium", headquarters: { city: "Hyderabad", state: "Telangana" }, description: "Special alloys for defence and space" },
  { name: "Kalyani Steels Ltd", industry: "Steel", size: "medium", headquarters: { city: "Pune", state: "Maharashtra" }, description: "Alloy and special steels (Bharat Forge Group)" },
  { name: "Vizag Steel Plant", industry: "Steel", size: "large", headquarters: { city: "Visakhapatnam", state: "Andhra Pradesh" }, description: "Shore-based integrated steel plant" },
  { name: "Essar Steel (ArcelorMittal Nippon)", industry: "Steel", size: "enterprise", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Integrated steel producer at Hazira" },
  { name: "Mormugao Port Authority", industry: "Shipping", size: "medium", headquarters: { city: "Vasco da Gama", state: "Goa" }, description: "Major port for iron ore and coal" },
  { name: "Jawaharlal Nehru Port Trust", industry: "Shipping", size: "large", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "India's busiest container port" },
  { name: "Visakhapatnam Port Authority", industry: "Shipping", size: "large", headquarters: { city: "Visakhapatnam", state: "Andhra Pradesh" }, description: "East coast major port" },
  { name: "Paradip Port Authority", industry: "Shipping", size: "medium", headquarters: { city: "Paradip", state: "Odisha" }, description: "Major port for coal and iron ore" },
  { name: "New Mangalore Port Authority", industry: "Shipping", size: "medium", headquarters: { city: "Mangalore", state: "Karnataka" }, description: "LPG, POL, and iron ore handling" },
  { name: "Kandla Port Trust", industry: "Shipping", size: "large", headquarters: { city: "Gandhidham", state: "Gujarat" }, description: "Largest cargo port by volume" },
  { name: "Great Eastern Shipping", industry: "Shipping", size: "large", headquarters: { city: "Mumbai", state: "Maharashtra" }, employeeCount: 2500, description: "Tankers and dry bulk carriers" },
  { name: "Indian Navy Dockyard Mumbai", industry: "Shipping", size: "large", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Naval ship repair and maintenance" },
  { name: "Garden Reach Shipbuilders", industry: "Shipping", size: "medium", headquarters: { city: "Kolkata", state: "West Bengal" }, description: "Warship and commercial ship builder" },
  { name: "Hindustan Shipyard Ltd", industry: "Shipping", size: "medium", headquarters: { city: "Visakhapatnam", state: "Andhra Pradesh" }, description: "Ship building and repair (Defence)" },
  { name: "Karnaphuli Paper Mills (India Ops)", industry: "Manufacturing", size: "small", headquarters: { city: "Kolkata", state: "West Bengal" }, description: "Paper and pulp using jute waste" },
  { name: "Emami Agrotech Ltd", industry: "Food Processing", size: "large", headquarters: { city: "Kolkata", state: "West Bengal" }, description: "Edible oil and biodiesel" },
  { name: "Patanjali Foods Ltd", industry: "Food Processing", size: "large", headquarters: { city: "Haridwar", state: "Uttar Pradesh" }, description: "Edible oil, food products" },
  { name: "Mother Dairy Fruit & Veg", industry: "Food Processing", size: "large", headquarters: { city: "New Delhi", state: "Delhi" }, description: "Dairy, oil, fruits & vegetables" },
  { name: "Cargill India Pvt Ltd", industry: "Food Processing", size: "enterprise", headquarters: { city: "Gurugram", state: "Haryana" }, description: "Edible oil, feed, food ingredients" },
  { name: "Bunge India Pvt Ltd", industry: "Food Processing", size: "large", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Oilseed processing and edible oil" },
  { name: "Gokul Refoils and Solvent Ltd", industry: "Food Processing", size: "medium", headquarters: { city: "Gandhinagar", state: "Gujarat" }, description: "Edible oil refinery and extraction" },
  { name: "NK Industries Ltd", industry: "Food Processing", size: "small", headquarters: { city: "Ahmedabad", state: "Gujarat" }, description: "Cotton seed oil extraction" },
  { name: "Agro Tech Foods", industry: "Food Processing", size: "medium", headquarters: { city: "Hyderabad", state: "Telangana" }, description: "Edible oil and food products (ConAgra)" },
  { name: "Anil Ltd", industry: "Food Processing", size: "small", headquarters: { city: "Ahmedabad", state: "Gujarat" }, description: "Starch, glucose, organic chemicals" },
  { name: "Kansai Nerolac Paints", industry: "Paint & Coatings", size: "large", headquarters: { city: "Mumbai", state: "Maharashtra" }, employeeCount: 5000, description: "Industrial and decorative paints" },
  { name: "Akzo Nobel India", industry: "Paint & Coatings", size: "large", headquarters: { city: "Gurugram", state: "Haryana" }, description: "Dulux paints and coatings" },
  { name: "Indigo Paints Ltd", industry: "Paint & Coatings", size: "medium", headquarters: { city: "Pune", state: "Maharashtra" }, description: "Decorative paints" },
  { name: "Shalimar Paints", industry: "Paint & Coatings", size: "medium", headquarters: { city: "Kolkata", state: "West Bengal" }, description: "India's oldest paint company" },
  { name: "JSW Paints", industry: "Paint & Coatings", size: "medium", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Decorative and industrial paints" },
  { name: "Sri Ramakrishna Mills (Coimbatore)", industry: "Textiles", size: "medium", headquarters: { city: "Coimbatore", state: "Tamil Nadu" }, description: "Spinning mills and textiles" },
  { name: "Precot Ltd", industry: "Textiles", size: "medium", headquarters: { city: "Coimbatore", state: "Tamil Nadu" }, description: "Cotton yarn and knitted fabrics" },
  { name: "Nahar Spinning Mills", industry: "Textiles", size: "medium", headquarters: { city: "Ludhiana", state: "Punjab" }, employeeCount: 8000, description: "Yarn and fabric manufacturer (Oswal)" },
  { name: "Sangam India Ltd", industry: "Textiles", size: "medium", headquarters: { city: "Bhilwara", state: "Rajasthan" }, description: "Denim, yarn, PVC pipes" },
  { name: "Sutlej Textiles", industry: "Textiles", size: "medium", headquarters: { city: "Bhilwara", state: "Rajasthan" }, description: "Home textiles and yarn" },
  { name: "Tamil Nadu Newsprint & Papers", industry: "Manufacturing", size: "medium", headquarters: { city: "Karur", state: "Tamil Nadu" }, description: "Newsprint and printing paper" },
  { name: "West Coast Paper Mills", industry: "Manufacturing", size: "medium", headquarters: { city: "Dandeli", state: "Karnataka" }, description: "Writing and printing paper" },
  { name: "JK Paper Ltd", industry: "Manufacturing", size: "large", headquarters: { city: "New Delhi", state: "Delhi" }, description: "Packaging board and office paper" },
  { name: "Piramal Pharma Ltd", industry: "Pharmaceuticals", size: "large", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Pharma CDMO and consumer healthcare" },
  { name: "Dr. Reddy's Laboratories", industry: "Pharmaceuticals", size: "enterprise", headquarters: { city: "Hyderabad", state: "Telangana" }, employeeCount: 24000, description: "Global pharma (solvents user)" },
  { name: "Sun Pharmaceutical Industries", industry: "Pharmaceuticals", size: "enterprise", headquarters: { city: "Mumbai", state: "Maharashtra" }, employeeCount: 37000, description: "India's largest pharma company" },
  { name: "Cipla Ltd", industry: "Pharmaceuticals", size: "enterprise", headquarters: { city: "Mumbai", state: "Maharashtra" }, employeeCount: 25000, description: "Global pharma and respiratory care" },
  { name: "Aurobindo Pharma", industry: "Pharmaceuticals", size: "large", headquarters: { city: "Hyderabad", state: "Telangana" }, description: "Generics and API manufacturer" },
  { name: "Divi's Laboratories", industry: "Pharmaceuticals", size: "large", headquarters: { city: "Hyderabad", state: "Telangana" }, description: "API and custom synthesis" },
  { name: "Laurus Labs Ltd", industry: "Pharmaceuticals", size: "medium", headquarters: { city: "Hyderabad", state: "Telangana" }, description: "API and formulations (solvents user)" },
  { name: "GMR Group", industry: "Infrastructure", size: "enterprise", headquarters: { city: "New Delhi", state: "Delhi" }, description: "Airports, energy, highways" },
  { name: "Adani Road Transport Ltd", industry: "Construction", size: "large", headquarters: { city: "Ahmedabad", state: "Gujarat" }, description: "Highway development (Adani Group)" },
  { name: "Megha Engineering & Infrastructure", industry: "Construction", size: "large", headquarters: { city: "Hyderabad", state: "Telangana" }, description: "Water, irrigation, metro projects" },
  { name: "Afcons Infrastructure Ltd", industry: "Construction", size: "large", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Marine, tunneling, oil & gas infrastructure (Shapoorji)" },
  { name: "Kalpataru Projects International", industry: "Construction", size: "large", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "T&D, oil & gas pipelines, railways" },
  { name: "Hindustan Construction Company", industry: "Construction", size: "large", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Dams, tunnels, nuclear power" },
  { name: "Tata Projects Ltd", industry: "Construction", size: "large", headquarters: { city: "Mumbai", state: "Maharashtra" }, employeeCount: 15000, description: "EPC contractor — industrial, infra" },
  { name: "IL&FS Transportation Networks", industry: "Construction", size: "large", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Toll road operator" },
  { name: "Cube Highways (I Squared Capital)", industry: "Construction", size: "large", headquarters: { city: "Singapore", state: "Delhi" }, description: "Road concessionaire in India" },
  { name: "DLF Ltd", industry: "Real Estate", size: "enterprise", headquarters: { city: "Gurugram", state: "Haryana" }, description: "Real estate developer" },
  { name: "Godrej Properties", industry: "Real Estate", size: "large", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Residential and commercial RE" },
  { name: "Oberoi Realty", industry: "Real Estate", size: "large", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Premium real estate developer" },
  { name: "Prestige Estates Projects", industry: "Real Estate", size: "large", headquarters: { city: "Bengaluru", state: "Karnataka" }, description: "Residential, office, retail, hospitality" },
  { name: "Siemens India Ltd", industry: "Manufacturing", size: "enterprise", headquarters: { city: "Mumbai", state: "Maharashtra" }, employeeCount: 8000, description: "Electrical, automation, power systems" },
  { name: "ABB India Ltd", industry: "Manufacturing", size: "large", headquarters: { city: "Bengaluru", state: "Karnataka" }, description: "Power and automation technologies" },
  { name: "Crompton Greaves Consumer", industry: "Manufacturing", size: "large", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Fans, lights, pumps, appliances" },
  { name: "Havells India Ltd", industry: "Manufacturing", size: "large", headquarters: { city: "Noida", state: "Uttar Pradesh" }, employeeCount: 10000, description: "Electrical equipment and consumer goods" },
  { name: "Polycab India Ltd", industry: "Manufacturing", size: "large", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Wires, cables, FMEG" },
  { name: "Dabur India Ltd", industry: "FMCG", size: "large", headquarters: { city: "Ghaziabad", state: "Uttar Pradesh" }, description: "Ayurvedic products and FMCG" },
  { name: "Gujarat Gas Ltd", industry: "Oil & Gas", size: "large", headquarters: { city: "Ahmedabad", state: "Gujarat" }, description: "City gas distribution" },
  { name: "Petronet LNG Ltd", industry: "Oil & Gas", size: "large", headquarters: { city: "New Delhi", state: "Delhi" }, description: "LNG import terminal operator" },
  { name: "ONGC Petro additions Ltd (OPaL)", industry: "Oil & Gas", size: "large", headquarters: { city: "Dahej", state: "Gujarat" }, description: "Petrochemicals complex" },
  { name: "Brahmaputra Valley Fertilizer Corp", industry: "Fertilizer", size: "medium", headquarters: { city: "Namrup", state: "Assam" }, description: "Urea manufacturer in NE India" },
  { name: "Southern Petrochemical Industries Corp (SPIC)", industry: "Fertilizer", size: "medium", headquarters: { city: "Chennai", state: "Tamil Nadu" }, description: "Complex fertilizers" },
  { name: "Gujarat Narmada Valley Fertilizers (GNFC)", industry: "Chemicals", size: "large", headquarters: { city: "Bharuch", state: "Gujarat" }, description: "Fertilizer and chemicals" },
  { name: "Jubilant Ingrevia Ltd", industry: "Chemicals", size: "medium", headquarters: { city: "Noida", state: "Uttar Pradesh" }, description: "Specialty chemicals and life science" },
  { name: "Tatva Chintan Pharma Chem", industry: "Chemicals", size: "medium", headquarters: { city: "Vadodara", state: "Gujarat" }, description: "Phase transfer catalysts and chemicals" },
  { name: "Fine Organic Industries", industry: "Chemicals", size: "medium", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Oleochemicals and specialty chemicals" },
  { name: "Jubilant FoodWorks (Kitchen Ops)", industry: "Food Processing", size: "large", headquarters: { city: "Noida", state: "Uttar Pradesh" }, description: "QSR chain — industrial cooking oils" },
  { name: "Anand Rathi Wealth (Fuel Voucher Program)", industry: "Financial Services", size: "medium", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Corp fleet fuel procurement services" },
  { name: "Indian Railways (Diesel Loco Shed)", industry: "Transportation", size: "enterprise", headquarters: { city: "New Delhi", state: "Delhi" }, description: "HSD for diesel locomotives across India" },
  { name: "Delhi Metro Rail Corporation", industry: "Transportation", size: "large", headquarters: { city: "New Delhi", state: "Delhi" }, description: "Metro rail — backup gensets" },
  { name: "Mumbai Metro One Pvt Ltd", industry: "Transportation", size: "medium", headquarters: { city: "Mumbai", state: "Maharashtra" }, description: "Metro rail operations" },
  { name: "Konkan Railway Corporation", industry: "Transportation", size: "medium", headquarters: { city: "Navi Mumbai", state: "Maharashtra" }, description: "Railway operations — genset fuel" },
  { name: "Indian Army (Regional Depot)", industry: "Defence", size: "enterprise", headquarters: { city: "New Delhi", state: "Delhi" }, description: "Bulk HSD/SKO procurement for military" },
  { name: "Indian Air Force (Fuel Supply)", industry: "Defence", size: "enterprise", headquarters: { city: "New Delhi", state: "Delhi" }, description: "ATF and HSD procurement" },
  { name: "Border Roads Organisation (BRO)", industry: "Construction", size: "large", headquarters: { city: "New Delhi", state: "Delhi" }, description: "Road construction in border areas — bitumen, HSD" },
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
  {
    name: "HPCL Tenders Portal",
    type: "tender_portal",
    url: "https://hindustanpetroleum.com/tenders",
    description: "HPCL official tender portal for competitor tracking",
    config: { isRSS: false },
    status: "active",
    reliability: 85,
  },
  {
    name: "Reuters India Commodities RSS",
    type: "news_site",
    url: "https://www.reuters.com/markets/commodities",
    description: "Global commodity and energy market news",
    config: { isRSS: true },
    status: "active",
    reliability: 85,
  },
  {
    name: "Financial Express Infrastructure",
    type: "news_site",
    url: "https://www.financialexpress.com/infrastructure/",
    description: "Infrastructure sector news and tenders",
    config: { isRSS: true },
    status: "active",
    reliability: 72,
  },
  {
    name: "MSTC e-Commerce Tenders",
    type: "tender_portal",
    url: "https://www.mstcecommerce.com",
    description: "MSTC e-auction and tender portal for petroleum products",
    config: { isRSS: false },
    status: "active",
    reliability: 75,
  },
  {
    name: "TED (Tenders Electronic Daily) India",
    type: "tender_portal",
    url: "https://ted.europa.eu",
    description: "EU procurement notices relevant to Indian firms",
    config: { isRSS: true },
    status: "paused",
    reliability: 60,
  },
  {
    name: "Jute Commissioner Office — Tenders",
    type: "tender_portal",
    url: "https://jutecomm.gov.in",
    description: "Jute industry tenders and JBO procurement",
    config: { isRSS: false },
    status: "active",
    reliability: 70,
  },
  {
    name: "PPAC (Petroleum Planning & Analysis Cell)",
    type: "news_site",
    url: "https://www.ppac.gov.in",
    description: "Petroleum industry data, demand trends, pricing",
    config: { isRSS: false },
    status: "active",
    reliability: 80,
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
  {
    title: "{company} jute batching oil requirement",
    sourceType: "tender",
    text: "Jute mill requires JBO (Jute Batching Oil) for fiber softening and processing. Monthly requirement 50 MT. Jute spinning and weaving operations.",
  },
  {
    title: "JBO supply for {company} jute processing unit",
    sourceType: "directory",
    text: "Jute processing facility needs jute batching oil for raw jute treatment. 40 KL/month for batching and spinning. Bulk delivery to mill site.",
  },
  {
    title: "{company} industrial kerosene (Non-PDS SKO) request",
    sourceType: "tender",
    text: "Manufacturing unit requires non-PDS superior kerosene oil for industrial cleaning and degreasing operations. 20 KL/month. Commercial grade.",
  },
  {
    title: "{company} genset diesel procurement — captive power",
    sourceType: "directory",
    text: "Factory with captive power DG sets. Multiple gensets totaling 8 MW. Requires HSD bulk supply arrangement. 30 KL/month.",
  },
  {
    title: "{company} boiler fuel oil for steam generation",
    sourceType: "news",
    text: "Process industry expanding boiler capacity. Furnace oil for steam generation. New boiler commissioning. 200 MT/month FO requirement.",
  },
  {
    title: "MTO 2445 supply for {company} steel wash operation",
    sourceType: "directory",
    text: "Steel plant requires Mineral Turpentine Oil MTO 2445 for steel surface wash and degreasing. Monthly 25 KL. Industrial grade.",
  },
  {
    title: "{company} road project bitumen — flyover construction",
    sourceType: "tender",
    text: "Urban flyover construction project. VG-30 bitumen and modified bitumen CRMB required. Road project estimated 18 months. 2000 MT total.",
  },
  {
    title: "{company} LDO for captive power backup",
    sourceType: "directory",
    text: "Industrial estate backup power. Light diesel oil for emergency gensets and boiler startup. 15 KL/month across 3 units.",
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
