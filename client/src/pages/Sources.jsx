import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sourcesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  RefreshCw,
  Globe,
  FileText,
  Newspaper,
  Building2,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Sources = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["sources"],
    queryFn: () => sourcesApi.getAll(),
  });

  const crawlMutation = useMutation({
    mutationFn: (id) => sourcesApi.triggerCrawl(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sources"] }),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }) => sourcesApi.update(id, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sources"] }),
  });

  const sources = data?.sources || data?.data || [];

  const getSourceIcon = (type) => {
    switch (type) {
      case "tender_portal":
        return FileText;
      case "news":
      case "news_site":
        return Newspaper;
      case "directory":
      case "company_directory":
        return Building2;
      default:
        return Globe;
    }
  };

  const getSourceColor = (type) => {
    switch (type) {
      case "tender_portal":
        return "bg-primary/20 text-primary";
      case "news":
      case "news_site":
        return "bg-info/20 text-info";
      case "directory":
      case "company_directory":
        return "bg-warning/20 text-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const filteredSources = sources.filter(
    (source) =>
      (source.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (source.domain || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Data Sources</h1>
          <p className="text-muted-foreground">
            Manage web crawlers and data extraction sources
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            Sync All
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Source
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4 p-4 rounded-xl border border-border bg-card">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search sources by name or domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredSources.slice(0, 4).map((source, idx) => (
          <motion.div
            key={source._id || source.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">
                {source.name}
              </span>
              <Badge
                variant="outline"
                className={
                  source.isActive !== false
                    ? "bg-success/20 text-success border-success/30"
                    : "text-muted-foreground"
                }
              >
                {source.isActive !== false ? "Active" : "Paused"}
              </Badge>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">
              {source.governance?.totalLeadsGenerated || 0}
            </p>
            <p className="text-xs text-muted-foreground">leads generated</p>
          </motion.div>
        ))}
      </div>

      {/* Sources Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="font-semibold">Source</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Last Crawl</TableHead>
                <TableHead className="font-semibold">Schedule</TableHead>
                <TableHead className="font-semibold">Leads</TableHead>
                <TableHead className="font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSources.map((source, idx) => {
                const Icon = getSourceIcon(source.type);
                const leadsGen = source.governance?.totalLeadsGenerated || 0;
                const reliability = source.governance?.reliability || 0;

                return (
                  <motion.tr
                    key={source._id || idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-secondary/30"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-lg",
                            getSourceColor(source.type),
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {source.name}
                          </p>
                          {source.url && (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              {source.domain || "Visit"}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {(source.type || "").replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {source.isActive !== false ? (
                        <Badge className="bg-success/20 text-success border-success/30">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-muted-foreground"
                        >
                          <Pause className="h-3 w-3 mr-1" />
                          Paused
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {formatTimeAgo(source.governance?.lastCrawl)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm capitalize">
                        {source.schedule || "daily"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {leadsGen} leads
                          </span>
                          <span className="text-success">{reliability}%</span>
                        </div>
                        <Progress value={reliability} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            toggleMutation.mutate({
                              id: source._id,
                              isActive: !(source.isActive !== false),
                            })
                          }
                        >
                          {source.isActive !== false ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => crawlMutation.mutate(source._id)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </div>
  );
};

export default Sources;
