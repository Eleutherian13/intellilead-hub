import React from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api";
import { StatCard } from "@/components/dashboard/StatCard";
import { LeadTrendChart } from "@/components/dashboard/LeadTrendChart";
import { ProductPieChart } from "@/components/dashboard/ProductPieChart";
import { TerritoryHeatmap } from "@/components/dashboard/TerritoryHeatmap";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { LeadCard } from "@/components/leads/LeadCard";
import {
  Target,
  TrendingUp,
  Users,
  Percent,
  ArrowUpRight,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardApi.getStats,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-muted-foreground">Failed to load dashboard data.</p>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  const stats = data?.stats || {};
  const charts = data?.charts || {};
  const leadTrend = data?.leadTrend || [];
  const recentActivities = data?.recentActivities || [];
  const topLeads = data?.topLeads || [];

  // Build territory data from charts
  const territoryData = (charts.byTerritory || []).map((t) => ({
    state: t._id || "Unknown",
    leads: t.count,
  }));

  // Build product distribution from charts
  const productDistribution = (charts.byProduct || []).map((p, i) => {
    const colors = [
      "hsl(217, 91%, 60%)",
      "hsl(142, 76%, 45%)",
      "hsl(38, 92%, 50%)",
      "hsl(280, 67%, 55%)",
      "hsl(187, 92%, 50%)",
      "hsl(348, 83%, 47%)",
      "hsl(45, 93%, 47%)",
      "hsl(190, 80%, 42%)",
    ];
    return { name: p._id, value: p.count, color: colors[i % colors.length] };
  });

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
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
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
          value={(stats.totalLeads || 0).toLocaleString()}
          subtitle={`${stats.newLeadsToday || 0} new today`}
          icon={<Target className="h-5 w-5" />}
          trend={{ value: 12.5, label: "vs last week" }}
          accentColor="primary"
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats.conversionRate || 0}%`}
          subtitle="Lead to customer"
          icon={<Percent className="h-5 w-5" />}
          trend={{ value: 3.2, label: "vs last month" }}
          accentColor="success"
        />
        <StatCard
          title="Avg Lead Score"
          value={stats.avgScore || 0}
          subtitle="Out of 100"
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 5.2, label: "improvement" }}
          accentColor="warning"
        />
        <StatCard
          title="Active Leads"
          value={(stats.activeLeads || 0).toLocaleString()}
          subtitle="In pipeline"
          icon={<Users className="h-5 w-5" />}
          accentColor="info"
        />
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 rounded-xl border border-border bg-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Lead Trends
              </h2>
              <p className="text-sm text-muted-foreground">
                Weekly lead activity
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary"
              onClick={() => navigate("/analytics")}
            >
              View Details
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <LeadTrendChart
            data={
              leadTrend.length > 0
                ? leadTrend
                : [{ week: "No data", new: 0, contacted: 0, converted: 0 }]
            }
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Product Mix
            </h2>
            <p className="text-sm text-muted-foreground">
              Lead distribution by product
            </p>
          </div>
          <ProductPieChart
            data={
              productDistribution.length > 0
                ? productDistribution
                : [{ name: "No data", value: 1, color: "#ccc" }]
            }
          />
        </motion.div>
      </div>

      {/* Territory & Activities Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Territory Coverage
              </h2>
              <p className="text-sm text-muted-foreground">
                Lead distribution by state
              </p>
            </div>
          </div>
          <TerritoryHeatmap
            data={
              territoryData.length > 0
                ? territoryData
                : [{ state: "No data", leads: 0 }]
            }
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Recent Activity
              </h2>
              <p className="text-sm text-muted-foreground">
                Latest lead updates
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary"
              onClick={() => navigate("/notifications")}
            >
              View All
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <RecentActivities activities={recentActivities} />
        </motion.div>
      </div>

      {/* High Priority Leads */}
      {topLeads.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Top Scoring Leads
              </h2>
              <p className="text-sm text-muted-foreground">
                Highest potential opportunities
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/leads")}
            >
              View All Leads
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topLeads.slice(0, 3).map((lead) => (
              <LeadCard
                key={lead._id}
                lead={lead}
                onClick={() => navigate(`/leads/${lead._id}`)}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
