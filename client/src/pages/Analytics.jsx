import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api";
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
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Analytics = () => {
  const [period, setPeriod] = useState("30d");

  const { data, isLoading } = useQuery({
    queryKey: ["analytics", period],
    queryFn: () => analyticsApi.getAnalytics(period),
  });

  const analytics = data || {};
  const overview = analytics.overview || {};
  const funnel = analytics.funnel || [];
  const scoreDistribution = analytics.scoreDistribution || [];
  const sourcePerformance = analytics.sourcePerformance || [];
  const productDemand = analytics.productDemand || [];
  const territoryAnalysis = analytics.territoryAnalysis || [];

  // Build KPIs
  const kpis = [
    {
      label: "Total Leads",
      value: (overview.totalLeads || 0).toLocaleString(),
      change: 12.5,
      icon: Target,
      positive: true,
    },
    {
      label: "Conversion Rate",
      value: `${overview.conversionRate || 0}%`,
      change: 3.2,
      icon: Percent,
      positive: true,
    },
    {
      label: "Avg Score",
      value: overview.avgScore || 0,
      change: 5.1,
      icon: TrendingUp,
      positive: true,
    },
    {
      label: "Active Leads",
      value: (overview.activeLeads || 0).toLocaleString(),
      change: 8.7,
      icon: Users,
      positive: true,
    },
  ];

  // Build product chart data
  const productData = productDemand.map((p, i) => {
    const colors = [
      "hsl(217, 91%, 60%)",
      "hsl(142, 76%, 45%)",
      "hsl(38, 92%, 50%)",
      "hsl(280, 67%, 55%)",
      "hsl(187, 92%, 50%)",
      "hsl(348, 83%, 47%)",
    ];
    return {
      name: p._id || p.product,
      value: p.count,
      color: colors[i % colors.length],
    };
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
          <Select value={period} onValueChange={setPeriod}>
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
        {kpis.map((kpi, idx) => (
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
                <p className="text-2xl font-bold text-foreground mt-1">
                  {kpi.value}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                <kpi.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div
              className={cn(
                "flex items-center gap-1 mt-3 text-sm",
                kpi.positive ? "text-success" : "text-destructive",
              )}
            >
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

      {/* Conversion Funnel + Product Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 rounded-xl border border-border bg-card p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Conversion Funnel
            </h2>
            <p className="text-sm text-muted-foreground">
              Lead progression stages
            </p>
          </div>
          {funnel.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnel} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="_id"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="count"
                  radius={[0, 4, 4, 0]}
                  fill="hsl(217, 91%, 60%)"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-10">
              No funnel data available
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Product Demand
            </h2>
            <p className="text-sm text-muted-foreground">Lead distribution</p>
          </div>
          <ProductPieChart
            data={
              productData.length > 0
                ? productData
                : [{ name: "No data", value: 1, color: "#ccc" }]
            }
          />
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
          <h2 className="text-lg font-semibold text-foreground">
            Source Performance
          </h2>
          <p className="text-sm text-muted-foreground">
            Lead generation by source
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {sourcePerformance.map((source, idx) => {
            const colors = [
              "hsl(217,91%,60%)",
              "hsl(142,76%,45%)",
              "hsl(38,92%,50%)",
              "hsl(280,67%,55%)",
              "hsl(187,92%,50%)",
            ];
            return (
              <div
                key={source._id || idx}
                className="p-4 rounded-lg bg-secondary/30 border border-border/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[idx % colors.length] }}
                  />
                  <Badge
                    variant="outline"
                    className="text-xs bg-success/20 text-success border-success/30"
                  >
                    {source.avgScore || 0} avg
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {source.count}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {source._id || "Unknown"}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Territory Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            Territory Performance
          </h2>
          <p className="text-sm text-muted-foreground">
            Lead distribution by region
          </p>
        </div>
        {territoryAnalysis.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={territoryAnalysis.slice(0, 8)}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="_id"
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
                dataKey="count"
                fill="hsl(217, 91%, 60%)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted-foreground text-center py-10">
            No territory data available
          </p>
        )}
      </motion.div>

      {/* Score Distribution */}
      {scoreDistribution.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Score Distribution
            </h2>
            <p className="text-sm text-muted-foreground">
              Lead quality breakdown
            </p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="_id"
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
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="count"
                fill="hsl(142, 76%, 45%)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
};

export default Analytics;
