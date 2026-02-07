import React from "react";
import {
  mockDashboardStats,
  mockLeadTrends,
  mockProductDistribution,
  mockSourcePerformance,
  mockTerritoryData,
} from "@/data/mockData";
import { LeadTrendChart } from "@/components/dashboard/LeadTrendChart";
import { ProductPieChart } from "@/components/dashboard/ProductPieChart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  Target,
  Percent,
  DollarSign,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Generate mock conversion funnel data
const funnelData = [
  { stage: "Leads", value: 1247, color: "hsl(217, 91%, 60%)" },
  { stage: "Qualified", value: 856, color: "hsl(187, 92%, 50%)" },
  { stage: "Contacted", value: 512, color: "hsl(38, 92%, 50%)" },
  { stage: "Proposal", value: 234, color: "hsl(280, 67%, 55%)" },
  { stage: "Converted", value: 167, color: "hsl(142, 76%, 45%)" },
];

// Monthly revenue data
const revenueData = [
  { month: "Jul", revenue: 45, target: 50 },
  { month: "Aug", revenue: 52, target: 55 },
  { month: "Sep", revenue: 48, target: 52 },
  { month: "Oct", revenue: 61, target: 58 },
  { month: "Nov", revenue: 55, target: 60 },
  { month: "Dec", revenue: 67, target: 65 },
  { month: "Jan", revenue: 72, target: 70 },
  { month: "Feb", revenue: 68, target: 72 },
];

const Analytics = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">
            Performance metrics and insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="30d">
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Lead Value",
            value: "₹24.5 Cr",
            change: 18.5,
            icon: DollarSign,
            positive: true,
          },
          {
            label: "Conversion Rate",
            value: "18.5%",
            change: 3.2,
            icon: Percent,
            positive: true,
          },
          {
            label: "Avg Deal Size",
            value: "₹1.2 Cr",
            change: -2.1,
            icon: Target,
            positive: false,
          },
          {
            label: "Active Prospects",
            value: "847",
            change: 12,
            icon: Users,
            positive: true,
          },
        ].map((kpi, idx) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                <kpi.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className={cn(
              "flex items-center gap-1 mt-3 text-sm",
              kpi.positive ? "text-success" : "text-destructive"
            )}>
              {kpi.positive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{Math.abs(kpi.change)}%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">Lead Trends</h2>
            <p className="text-sm text-muted-foreground">Weekly lead activity comparison</p>
          </div>
          <LeadTrendChart data={mockLeadTrends} />
        </motion.div>

        {/* Revenue vs Target */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">Revenue vs Target</h2>
            <p className="text-sm text-muted-foreground">Monthly performance tracking</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}Cr`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="hsl(var(--muted-foreground))"
                fill="hsl(var(--muted-foreground) / 0.1)"
                strokeDasharray="5 5"
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(142, 76%, 45%)"
                fill="hsl(142, 76%, 45% / 0.2)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 rounded-xl border border-border bg-card p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">Conversion Funnel</h2>
            <p className="text-sm text-muted-foreground">Lead progression stages</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={funnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis
                type="number"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="stage"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                fill="hsl(217, 91%, 60%)"
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Product Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">Product Mix</h2>
            <p className="text-sm text-muted-foreground">Lead distribution</p>
          </div>
          <ProductPieChart data={mockProductDistribution} />
        </motion.div>
      </div>

      {/* Source Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">Source Performance</h2>
          <p className="text-sm text-muted-foreground">Lead generation by source</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {mockSourcePerformance.map((source, idx) => (
            <div
              key={source.source}
              className="p-4 rounded-lg bg-secondary/30 border border-border/50"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: source.color }}
                />
                <Badge
                  variant="outline"
                  className="text-xs bg-success/20 text-success border-success/30"
                >
                  {source.conversion}%
                </Badge>
              </div>
              <p className="text-2xl font-bold text-foreground">{source.leads}</p>
              <p className="text-sm text-muted-foreground mt-1">{source.source}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Territory Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">Territory Performance</h2>
          <p className="text-sm text-muted-foreground">Lead distribution by region</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockTerritoryData.slice(0, 8)}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="state"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar
              dataKey="leads"
              fill="hsl(217, 91%, 60%)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default Analytics;
