import React, { useState } from "react";
import { mockSourcePerformance } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  Building,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  Pause,
  ExternalLink,
  MoreHorizontal,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock source data
const mockSources = [
  {
    id: "1",
    name: "Government eProcurement",
    domain: "eprocure.gov.in",
    type: "tender_portal",
    status: "active",
    lastCrawl: new Date(Date.now() - 3600000).toISOString(),
    nextCrawl: new Date(Date.now() + 82800000).toISOString(),
    leadsGenerated: 456,
    conversionRate: 22,
    crawlFrequency: "daily",
  },
  {
    id: "2",
    name: "Economic Times",
    domain: "economictimes.com",
    type: "news_site",
    status: "active",
    lastCrawl: new Date(Date.now() - 7200000).toISOString(),
    nextCrawl: new Date(Date.now() + 79200000).toISOString(),
    leadsGenerated: 312,
    conversionRate: 15,
    crawlFrequency: "daily",
  },
  {
    id: "3",
    name: "GeM Portal",
    domain: "gem.gov.in",
    type: "tender_portal",
    status: "active",
    lastCrawl: new Date(Date.now() - 1800000).toISOString(),
    nextCrawl: new Date(Date.now() + 84600000).toISOString(),
    leadsGenerated: 234,
    conversionRate: 18,
    crawlFrequency: "hourly",
  },
  {
    id: "4",
    name: "Industry Directories",
    domain: "indiamart.com",
    type: "company_directory",
    status: "paused",
    lastCrawl: new Date(Date.now() - 86400000).toISOString(),
    nextCrawl: null,
    leadsGenerated: 167,
    conversionRate: 12,
    crawlFrequency: "weekly",
  },
  {
    id: "5",
    name: "IREPS Railway",
    domain: "ireps.gov.in",
    type: "tender_portal",
    status: "active",
    lastCrawl: new Date(Date.now() - 10800000).toISOString(),
    nextCrawl: new Date(Date.now() + 75600000).toISOString(),
    leadsGenerated: 78,
    conversionRate: 25,
    crawlFrequency: "daily",
  },
];

const Sources = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const getSourceIcon = (type: string) => {
    switch (type) {
      case "tender_portal":
        return FileText;
      case "news_site":
        return Newspaper;
      case "company_directory":
        return Building;
      default:
        return Globe;
    }
  };

  const getSourceColor = (type: string) => {
    switch (type) {
      case "tender_portal":
        return "bg-primary/20 text-primary";
      case "news_site":
        return "bg-info/20 text-info";
      case "company_directory":
        return "bg-warning/20 text-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const formatTimeUntil = (dateString: string | null) => {
    if (!dateString) return "Paused";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Soon";
    if (diffInHours < 24) return `In ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `In ${diffInDays}d`;
  };

  const filteredSources = mockSources.filter((source) =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    source.domain.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Source
          </Button>
        </div>
      </div>

      {/* Search Bar */}
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

      {/* Source Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockSourcePerformance.slice(0, 4).map((source, idx) => (
          <motion.div
            key={source.source}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">{source.source}</span>
              <Badge
                variant="outline"
                className="bg-success/20 text-success border-success/30"
              >
                {source.conversion}%
              </Badge>
            </div>
            <p className="text-2xl font-bold text-foreground mb-2">{source.leads}</p>
            <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(source.leads / 500) * 100}%`,
                  backgroundColor: source.color,
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sources Table */}
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
              <TableHead className="font-semibold">Next Crawl</TableHead>
              <TableHead className="font-semibold">Performance</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSources.map((source, idx) => {
              const Icon = getSourceIcon(source.type);
              
              return (
                <motion.tr
                  key={source.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group hover:bg-secondary/30"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", getSourceColor(source.type))}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{source.name}</p>
                        <a
                          href={`https://${source.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          {source.domain}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {source.type.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {source.status === "active" ? (
                      <Badge className="bg-success/20 text-success border-success/30">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        <Pause className="h-3 w-3 mr-1" />
                        Paused
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {formatTimeAgo(source.lastCrawl)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {source.nextCrawl ? (
                        <span className="text-foreground">{formatTimeUntil(source.nextCrawl)}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{source.leadsGenerated} leads</span>
                        <span className="text-success">{source.conversionRate}%</span>
                      </div>
                      <Progress value={source.conversionRate * 4} className="h-1.5" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {source.status === "active" ? (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
};

export default Sources;
