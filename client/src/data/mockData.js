// Mock Companies
export const mockCompanies = [
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
    turnover: 5000,
    employeeCount: 10000,
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
    turnover: 5000,
    employeeCount: 10000,
    isCustomer: false,
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
    turnover: 5000,
    employeeCount: 10000,
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
    turnover: 5000,
    employeeCount: 10000,
    isCustomer: false,
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
    turnover: 5000,
    employeeCount: 10000,
    isCustomer: false,
    lastSignalDate: new Date(Date.now() - 43200000).toISOString(),
  },
];

// Mock Leads
export const mockLeads = [
  {
    id: "lead-1",
    company: mockCompanies[0],
    source: {
      url: "https://eprocure.gov.in/tender/12345",
      type: "tender",
      extractedDate: new Date().toISOString(),
      title: "Supply of Furnace Oil for Blast Furnace Operations",
      content:
        "Tender for annual contract supply of 50,000 KL Furnace Oil for Jamshedpur plant",
    },
    signals: [
      {
        type: "equipment",
        value: "Blast Furnace",
        context: "Primary steelmaking",
        confidence: 85,
      },
      {
        type: "volume",
        value: "50,000 KL",
        context: "Annual requirement",
        confidence: 85,
      },
      {
        type: "urgency",
        value: "Immediate",
        context: "Tender closing in 15 days",
        confidence: 85,
      },
    ],
    inferredProducts: [
      {
        product: "FO",
        confidence: 85,
        reason: "Blast furnace fuel requirement",
        urgency: 8,
      },
      {
        product: "LSHS",
        confidence: 85,
        reason: "Alternative fuel option",
        urgency: 8,
      },
    ],
    score: {
      intent: 85,
      freshness: 90,
      companySize: 8,
      proximity: 7,
      total: 85,
    },
    territory: "East",
    status: "new",
    priority: "high",
    notificationSent: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "lead-2",
    company: mockCompanies[0],
    source: {
      url: "https://economictimes.com/news/hindalco-expansion",
      type: "news",
      extractedDate: new Date(Date.now() - 86400000).toISOString(),
      title: "Hindalco announces ₹5,000 Cr expansion in Odisha",
      content:
        "Hindalco Industries to expand aluminum smelting capacity with new captive power plant",
    },
    signals: [
      {
        type: "expansion",
        value: "Capacity Addition",
        context: "New smelter line",
        confidence: 85,
      },
      {
        type: "equipment",
        value: "Captive Power Plant",
        context: "500 MW addition",
        confidence: 85,
      },
    ],
    inferredProducts: [
      {
        product: "FO",
        confidence: 85,
        reason: "Captive power plant fuel",
        urgency: 8,
      },
      {
        product: "HSD",
        confidence: 85,
        reason: "DG backup and construction",
        urgency: 8,
      },
    ],
    score: {
      intent: 85,
      freshness: 90,
      companySize: 8,
      proximity: 7,
      total: 85,
    },
    territory: "East",
    status: "contacted",
    priority: "high",
    notificationSent: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "lead-3",
    company: mockCompanies[0],
    source: {
      url: "https://gem.gov.in/tender/67890",
      type: "tender",
      extractedDate: new Date(Date.now() - 172800000).toISOString(),
      title: "Bitumen VG-30 for Road Construction Project",
      content:
        "Requirement of 10,000 MT Bitumen for Karnataka state highway project",
    },
    signals: [
      {
        type: "project",
        value: "Road Construction",
        context: "State Highway NH-48",
        confidence: 85,
      },
      {
        type: "volume",
        value: "10,000 MT",
        context: "Project requirement",
        confidence: 85,
      },
    ],
    inferredProducts: [
      {
        product: "Bitumen",
        confidence: 85,
        reason: "Road construction project",
        urgency: 8,
      },
    ],
    score: {
      intent: 85,
      freshness: 90,
      companySize: 8,
      proximity: 7,
      total: 85,
    },
    territory: "South",
    status: "new",
    priority: "medium",
    notificationSent: false,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "lead-4",
    company: mockCompanies[0],
    source: {
      url: "https://ireps.gov.in/tender/railway-fuel",
      type: "tender",
      extractedDate: new Date(Date.now() - 259200000).toISOString(),
      title: "Annual HSD Supply for Railway Workshops",
      content:
        "Tender for High Speed Diesel supply to multiple railway workshops across zones",
    },
    signals: [
      {
        type: "contract",
        value: "Annual Rate Contract",
        context: "Multi-zone supply",
        confidence: 85,
      },
      {
        type: "volume",
        value: "Large Volume",
        context: "Pan-India requirement",
        confidence: 85,
      },
    ],
    inferredProducts: [
      {
        product: "HSD",
        confidence: 85,
        reason: "Railway operations fuel",
        urgency: 8,
      },
    ],
    score: {
      intent: 85,
      freshness: 90,
      companySize: 8,
      proximity: 7,
      total: 85,
    },
    territory: "North",
    status: "assigned",
    priority: "medium",
    notificationSent: false,
    assignedTo: "user-1",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "lead-5",
    company: mockCompanies[0],
    source: {
      url: "https://ril.com/press-release/new-plant",
      type: "website",
      extractedDate: new Date(Date.now() - 345600000).toISOString(),
      title: "New Chemical Plant Commissioning",
      content:
        "Reliance commissioning new propylene derivative plant at Jamnagar complex",
    },
    signals: [
      {
        type: "commissioning",
        value: "New Plant",
        context: "Propylene derivatives",
        confidence: 85,
      },
    ],
    inferredProducts: [
      {
        product: "Propylene",
        confidence: 85,
        reason: "Chemical feedstock requirement",
        urgency: 8,
      },
      {
        product: "Hexane",
        confidence: 85,
        reason: "Solvent for processing",
        urgency: 8,
      },
    ],
    score: {
      intent: 85,
      freshness: 90,
      companySize: 8,
      proximity: 7,
      total: 85,
    },
    territory: "West",
    status: "converted",
    priority: "low",
    notificationSent: false,
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
];

// Dashboard Stats
export const mockDashboardStats = {
  totalLeads: 1247,
  newLeadsToday: 42,
  conversionRate: 18.5,
  avgLeadScore: 76,
  leadsChange: 12.5,
  conversionChange: 8.3,
  topProducts: ["FO", "HSD", "Bitumen"],
  territoryCoverage: {
    North: 42,
    South: 38,
    East: 45,
    West: 35,
  },
};

// Lead Trends (Weekly)
export const mockLeadTrends = [
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
export const mockProductDistribution = [
  { name: "Furnace Oil", value: 450, color: "#3B82F6" },
  { name: "HSD", value: 320, color: "#10B981" },
  { name: "Bitumen", value: 210, color: "#F59E0B" },
  { name: "LSHS", value: 180, color: "#8B5CF6" },
  { name: "Others", value: 87, color: "#6B7280" },
];

// Territory Data for Heatmap
export const mockTerritoryData = [
  { state: "Maharashtra", leads: 245, lat: 19.7515, lng: 75.7139 },
  { state: "Gujarat", leads: 198, lat: 22.2587, lng: 71.1924 },
  { state: "Karnataka", leads: 167, lat: 15.3173, lng: 75.7139 },
  { state: "Tamil Nadu", leads: 189, lat: 11.1271, lng: 78.6569 },
  { state: "Odisha", leads: 134, lat: 20.9517, lng: 85.0985 },
  { state: "Jharkhand", leads: 123, lat: 23.6102, lng: 85.2799 },
  { state: "West Bengal", leads: 156, lat: 22.9868, lng: 87.855 },
  { state: "Rajasthan", leads: 145, lat: 27.0238, lng: 74.2179 },
  { state: "Uttar Pradesh", leads: 212, lat: 26.8467, lng: 80.9462 },
  { state: "Delhi", leads: 178, lat: 28.7041, lng: 77.1025 },
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
  {
    source: "Government Tenders",
    leads: 427,
    conversion: 24.5,
    color: "#3B82F6",
  },
  { source: "News Articles", leads: 312, conversion: 18.3, color: "#10B981" },
  {
    source: "Company Websites",
    leads: 245,
    conversion: 21.7,
    color: "#F59E0B",
  },
  {
    source: "Industry Directories",
    leads: 189,
    conversion: 15.2,
    color: "#8B5CF6",
  },
  { source: "Social Media", leads: 74, conversion: 9.8, color: "#EC4899" },
];
