import { Lead, Company, DashboardStats, LeadTrend, ProductDistribution } from "@/types/lead";

// Mock Companies
export const mockCompanies: Company[] = [
  {
    id: "1",
    normalizedName: "TATA STEEL LIMITED",
    legalName: "Tata Steel Limited",
    industry: "Steel Manufacturing",
    subIndustry: "Integrated Steel",
    website: "https://www.tatasteel.com",
    locations: [
      { city: "Jamshedpur", state: "Jharkhand", type: "HQ" },
      { city: "Kalinganagar", state: "Odisha", type: "Plant" },
    ],
    products: ["FO", "HSD", "LSHS"],
    equipment: ["Blast Furnace", "Coke Oven", "Captive Power Plant"],
    turnover: 250000,
    employeeCount: 35000,
    isCustomer: false,
    lastSignalDate: new Date().toISOString(),
  },
  {
    id: "2",
    normalizedName: "RELIANCE INDUSTRIES",
    legalName: "Reliance Industries Limited",
    industry: "Petrochemicals",
    subIndustry: "Refining & Marketing",
    website: "https://www.ril.com",
    locations: [
      { city: "Mumbai", state: "Maharashtra", type: "HQ" },
      { city: "Jamnagar", state: "Gujarat", type: "Plant" },
    ],
    products: ["Propylene", "Hexane", "Solvent 1425"],
    equipment: ["Cracker Unit", "Polymer Plant"],
    turnover: 850000,
    employeeCount: 195000,
    isCustomer: true,
    lastSignalDate: new Date().toISOString(),
  },
  {
    id: "3",
    normalizedName: "HINDALCO INDUSTRIES",
    legalName: "Hindalco Industries Limited",
    industry: "Aluminum",
    subIndustry: "Primary Aluminum",
    website: "https://www.hindalco.com",
    locations: [
      { city: "Mumbai", state: "Maharashtra", type: "HQ" },
      { city: "Hirakud", state: "Odisha", type: "Plant" },
    ],
    products: ["FO", "HSD"],
    equipment: ["Smelter", "Captive Power Plant", "Rolling Mill"],
    turnover: 180000,
    employeeCount: 20000,
    isCustomer: false,
    lastSignalDate: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "4",
    normalizedName: "ULTRATECH CEMENT",
    legalName: "UltraTech Cement Limited",
    industry: "Cement",
    subIndustry: "Cement Manufacturing",
    website: "https://www.ultratechcement.com",
    locations: [
      { city: "Mumbai", state: "Maharashtra", type: "HQ" },
      { city: "Rajashree", state: "Karnataka", type: "Plant" },
    ],
    products: ["FO", "Bitumen", "HSD"],
    equipment: ["Kiln", "Grinding Mill", "DG Sets"],
    turnover: 65000,
    employeeCount: 22000,
    isCustomer: true,
    lastSignalDate: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "5",
    normalizedName: "INDIAN RAILWAYS",
    legalName: "Ministry of Railways",
    industry: "Transportation",
    subIndustry: "Railways",
    website: "https://www.indianrailways.gov.in",
    locations: [
      { city: "New Delhi", state: "Delhi", type: "HQ" },
      { city: "Mumbai", state: "Maharashtra", type: "Office" },
    ],
    products: ["HSD", "Bitumen"],
    equipment: ["Diesel Locomotives", "DG Sets"],
    turnover: 200000,
    employeeCount: 1300000,
    isCustomer: true,
    lastSignalDate: new Date(Date.now() - 43200000).toISOString(),
  },
];

// Mock Leads
export const mockLeads: Lead[] = [
  {
    id: "lead-1",
    company: mockCompanies[0],
    source: {
      url: "https://eprocure.gov.in/tender/12345",
      type: "tender",
      extractedDate: new Date().toISOString(),
      title: "Supply of Furnace Oil for Blast Furnace Operations",
      content: "Tender for annual contract supply of 50,000 KL Furnace Oil for Jamshedpur plant",
    },
    signals: [
      { type: "equipment", value: "Blast Furnace", context: "Primary steelmaking", confidence: 95 },
      { type: "volume", value: "50,000 KL", context: "Annual requirement", confidence: 90 },
      { type: "urgency", value: "Immediate", context: "Tender closing in 15 days", confidence: 85 },
    ],
    inferredProducts: [
      { product: "FO", confidence: 95, reason: "Blast furnace fuel requirement", urgency: 9 },
      { product: "LSHS", confidence: 75, reason: "Alternative fuel option", urgency: 6 },
    ],
    score: {
      intent: 95,
      freshness: 100,
      companySize: 90,
      proximity: 85,
      total: 92,
    },
    territory: "East",
    status: "new",
    priority: "high",
    notificationSent: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "lead-2",
    company: mockCompanies[2],
    source: {
      url: "https://economictimes.com/news/hindalco-expansion",
      type: "news",
      extractedDate: new Date(Date.now() - 86400000).toISOString(),
      title: "Hindalco announces ₹5,000 Cr expansion in Odisha",
      content: "Hindalco Industries to expand aluminum smelting capacity with new captive power plant",
    },
    signals: [
      { type: "expansion", value: "Capacity Addition", context: "New smelter line", confidence: 88 },
      { type: "equipment", value: "Captive Power Plant", context: "500 MW addition", confidence: 92 },
    ],
    inferredProducts: [
      { product: "FO", confidence: 88, reason: "Captive power plant fuel", urgency: 7 },
      { product: "HSD", confidence: 70, reason: "DG backup and construction", urgency: 5 },
    ],
    score: {
      intent: 75,
      freshness: 85,
      companySize: 85,
      proximity: 90,
      total: 83,
    },
    territory: "East",
    status: "contacted",
    priority: "high",
    notificationSent: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "lead-3",
    company: mockCompanies[3],
    source: {
      url: "https://gem.gov.in/tender/67890",
      type: "tender",
      extractedDate: new Date(Date.now() - 172800000).toISOString(),
      title: "Bitumen VG-30 for Road Construction Project",
      content: "Requirement of 10,000 MT Bitumen for Karnataka state highway project",
    },
    signals: [
      { type: "project", value: "Road Construction", context: "State Highway NH-48", confidence: 95 },
      { type: "volume", value: "10,000 MT", context: "Project requirement", confidence: 90 },
    ],
    inferredProducts: [
      { product: "Bitumen", confidence: 98, reason: "Road construction project", urgency: 8 },
    ],
    score: {
      intent: 90,
      freshness: 70,
      companySize: 80,
      proximity: 75,
      total: 79,
    },
    territory: "South",
    status: "new",
    priority: "medium",
    notificationSent: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "lead-4",
    company: mockCompanies[4],
    source: {
      url: "https://ireps.gov.in/tender/railway-fuel",
      type: "tender",
      extractedDate: new Date(Date.now() - 259200000).toISOString(),
      title: "Annual HSD Supply for Railway Workshops",
      content: "Tender for High Speed Diesel supply to multiple railway workshops across zones",
    },
    signals: [
      { type: "contract", value: "Annual Rate Contract", context: "Multi-zone supply", confidence: 92 },
      { type: "volume", value: "Large Volume", context: "Pan-India requirement", confidence: 85 },
    ],
    inferredProducts: [
      { product: "HSD", confidence: 95, reason: "Railway operations fuel", urgency: 7 },
    ],
    score: {
      intent: 88,
      freshness: 60,
      companySize: 95,
      proximity: 80,
      total: 80,
    },
    territory: "North",
    status: "assigned",
    priority: "medium",
    notificationSent: true,
    assignedTo: "user-1",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "lead-5",
    company: mockCompanies[1],
    source: {
      url: "https://ril.com/press-release/new-plant",
      type: "website",
      extractedDate: new Date(Date.now() - 345600000).toISOString(),
      title: "New Chemical Plant Commissioning",
      content: "Reliance commissioning new propylene derivative plant at Jamnagar complex",
    },
    signals: [
      { type: "commissioning", value: "New Plant", context: "Propylene derivatives", confidence: 90 },
    ],
    inferredProducts: [
      { product: "Propylene", confidence: 85, reason: "Chemical feedstock requirement", urgency: 6 },
      { product: "Hexane", confidence: 60, reason: "Solvent for processing", urgency: 4 },
    ],
    score: {
      intent: 70,
      freshness: 50,
      companySize: 98,
      proximity: 70,
      total: 72,
    },
    territory: "West",
    status: "converted",
    priority: "low",
    notificationSent: true,
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
];

// Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalLeads: 1247,
  newLeadsToday: 23,
  conversionRate: 18.5,
  avgLeadScore: 74,
  leadsChange: 12,
  conversionChange: 3.2,
  topProducts: ["FO", "HSD", "Bitumen"],
  territoryCoverage: {
    North: 312,
    South: 287,
    East: 356,
    West: 292,
  },
};

// Lead Trends (Weekly)
export const mockLeadTrends: LeadTrend[] = [
  { week: "Week 1", new: 145, contacted: 89, converted: 23 },
  { week: "Week 2", new: 167, contacted: 102, converted: 31 },
  { week: "Week 3", new: 134, contacted: 95, converted: 28 },
  { week: "Week 4", new: 189, contacted: 118, converted: 35 },
  { week: "Week 5", new: 156, contacted: 108, converted: 29 },
  { week: "Week 6", new: 198, contacted: 125, converted: 38 },
  { week: "Week 7", new: 212, contacted: 142, converted: 42 },
  { week: "Week 8", new: 178, contacted: 131, converted: 36 },
];

// Product Distribution
export const mockProductDistribution: ProductDistribution[] = [
  { name: "Furnace Oil", value: 35, color: "#3B82F6" },
  { name: "HSD", value: 28, color: "#10B981" },
  { name: "Bitumen", value: 18, color: "#F59E0B" },
  { name: "LSHS", value: 10, color: "#8B5CF6" },
  { name: "Others", value: 9, color: "#6B7280" },
];

// Territory Data for Heatmap
export const mockTerritoryData = [
  { state: "Maharashtra", leads: 156, lat: 19.7515, lng: 75.7139 },
  { state: "Gujarat", leads: 134, lat: 22.2587, lng: 71.1924 },
  { state: "Karnataka", leads: 98, lat: 15.3173, lng: 75.7139 },
  { state: "Tamil Nadu", leads: 112, lat: 11.1271, lng: 78.6569 },
  { state: "Odisha", leads: 145, lat: 20.9517, lng: 85.0985 },
  { state: "Jharkhand", leads: 123, lat: 23.6102, lng: 85.2799 },
  { state: "West Bengal", leads: 89, lat: 22.9868, lng: 87.855 },
  { state: "Rajasthan", leads: 76, lat: 27.0238, lng: 74.2179 },
  { state: "Uttar Pradesh", leads: 104, lat: 26.8467, lng: 80.9462 },
  { state: "Delhi", leads: 67, lat: 28.7041, lng: 77.1025 },
];

// Recent Activities
export const mockRecentActivities = [
  {
    id: "act-1",
    type: "new_lead",
    message: "New high-priority lead from Tata Steel",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    priority: "high",
  },
  {
    id: "act-2",
    type: "status_change",
    message: "Hindalco lead moved to 'Contacted'",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    priority: "medium",
  },
  {
    id: "act-3",
    type: "conversion",
    message: "Reliance Industries lead converted!",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    priority: "high",
  },
  {
    id: "act-4",
    type: "new_lead",
    message: "New tender detected: Indian Railways",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    priority: "medium",
  },
  {
    id: "act-5",
    type: "assignment",
    message: "3 leads assigned to East territory",
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    priority: "low",
  },
];

// Source Performance
export const mockSourcePerformance = [
  { source: "Government Tenders", leads: 456, conversion: 22, color: "#3B82F6" },
  { source: "News Articles", leads: 312, conversion: 15, color: "#10B981" },
  { source: "Company Websites", leads: 234, conversion: 18, color: "#F59E0B" },
  { source: "Industry Directories", leads: 167, conversion: 12, color: "#8B5CF6" },
  { source: "Social Media", leads: 78, conversion: 8, color: "#EC4899" },
];
