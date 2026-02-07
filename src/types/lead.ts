// Lead Intelligence Types

export interface Company {
  id: string;
  normalizedName: string;
  legalName: string;
  cin?: string;
  gst?: string;
  website?: string;
  industry: string;
  subIndustry?: string;
  locations: CompanyLocation[];
  products: string[];
  equipment: string[];
  turnover?: number;
  employeeCount?: number;
  isCustomer: boolean;
  lastSignalDate: string;
}

export interface CompanyLocation {
  city: string;
  state: string;
  type: "HQ" | "Plant" | "Warehouse" | "Office";
  address?: string;
  pincode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Signal {
  type: string;
  value: string;
  context: string;
  confidence: number;
}

export interface InferredProduct {
  product: string;
  confidence: number;
  reason: string;
  urgency: number;
}

export interface LeadScore {
  intent: number;
  freshness: number;
  companySize: number;
  proximity: number;
  total: number;
}

export interface LeadSource {
  url: string;
  type: "tender" | "news" | "website" | "directory";
  extractedDate: string;
  title: string;
  content: string;
}

export interface Lead {
  id: string;
  company: Company;
  source: LeadSource;
  signals: Signal[];
  inferredProducts: InferredProduct[];
  score: LeadScore;
  assignedTo?: string;
  territory: string;
  status: "new" | "assigned" | "contacted" | "converted" | "rejected";
  priority: "high" | "medium" | "low";
  notes?: LeadNote[];
  notificationSent: boolean;
  createdAt: string;
}

export interface LeadNote {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface DashboardStats {
  totalLeads: number;
  newLeadsToday: number;
  conversionRate: number;
  avgLeadScore: number;
  leadsChange: number;
  conversionChange: number;
  topProducts: string[];
  territoryCoverage: Record<string, number>;
}

export interface LeadTrend {
  week: string;
  new: number;
  contacted: number;
  converted: number;
}

export interface ProductDistribution {
  name: string;
  value: number;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "sales";
  territory?: string;
  phone?: string;
  whatsappOptIn?: boolean;
}

export interface Notification {
  id: string;
  type: "new_lead" | "status_change" | "assignment" | "reminder";
  title: string;
  message: string;
  leadId?: string;
  read: boolean;
  createdAt: string;
}
