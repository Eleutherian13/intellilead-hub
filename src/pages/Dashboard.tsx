import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { LeadTrendChart } from "@/components/dashboard/LeadTrendChart";
import { ProductPieChart } from "@/components/dashboard/ProductPieChart";
import { TerritoryHeatmap } from "@/components/dashboard/TerritoryHeatmap";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import {
  mockDashboardStats,
  mockLeadTrends,
  mockProductDistribution,
  mockTerritoryData,
  mockRecentActivities,
  mockLeads,
} from "@/data/mockData";
import { LeadCard } from "@/components/leads/LeadCard";
import {
  Target,
  TrendingUp,
  Users,
  Percent,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const highPriorityLeads = mockLeads.filter((lead) => lead.priority === "high").slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time lead intelligence overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="bg-success/10 text-success border-success/30"
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            Live Sync Active
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="Total Leads"
          value={mockDashboardStats.totalLeads.toLocaleString()}
          subtitle={`${mockDashboardStats.newLeadsToday} new today`}
          icon={<Target className="h-5 w-5" />}
          trend={{ value: mockDashboardStats.leadsChange, label: "vs last week" }}
          accentColor="primary"
        />
        <StatCard
          title="Conversion Rate"
          value={`${mockDashboardStats.conversionRate}%`}
          subtitle="Lead to customer"
          icon={<Percent className="h-5 w-5" />}
          trend={{ value: mockDashboardStats.conversionChange, label: "vs last month" }}
          accentColor="success"
        />
        <StatCard
          title="Avg Lead Score"
          value={mockDashboardStats.avgLeadScore}
          subtitle="Out of 100"
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 5, label: "improvement" }}
          accentColor="warning"
        />
        <StatCard
          title="Active Territories"
          value={Object.keys(mockDashboardStats.territoryCoverage).length}
          subtitle={`${Object.values(mockDashboardStats.territoryCoverage).reduce((a, b) => a + b, 0)} total leads`}
          icon={<Users className="h-5 w-5" />}
          accentColor="info"
        />
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 rounded-xl border border-border bg-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Lead Trends</h2>
              <p className="text-sm text-muted-foreground">Weekly lead activity</p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">
              View Details
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <LeadTrendChart data={mockLeadTrends} />
        </motion.div>

        {/* Product Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">Product Mix</h2>
            <p className="text-sm text-muted-foreground">Lead distribution by product</p>
          </div>
          <ProductPieChart data={mockProductDistribution} />
        </motion.div>
      </div>

      {/* Territory & Activities Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Territory Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Territory Coverage</h2>
              <p className="text-sm text-muted-foreground">Lead distribution by state</p>
            </div>
          </div>
          <TerritoryHeatmap data={mockTerritoryData} />
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
              <p className="text-sm text-muted-foreground">Latest lead updates</p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <RecentActivities activities={mockRecentActivities} />
        </motion.div>
      </div>

      {/* High Priority Leads */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">High Priority Leads</h2>
            <p className="text-sm text-muted-foreground">Requires immediate attention</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/leads")}>
            View All Leads
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {highPriorityLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onClick={() => navigate(`/leads/${lead.id}`)}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
