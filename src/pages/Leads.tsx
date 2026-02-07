import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LeadCard } from "@/components/leads/LeadCard";
import { LeadDossier } from "@/components/leads/LeadDossier";
import { mockLeads } from "@/data/mockData";
import { Lead } from "@/types/lead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  Download,
  Plus,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const Leads = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Find selected lead if viewing dossier
  const selectedLead = id ? mockLeads.find((lead) => lead.id === id) : null;

  // Filter leads
  const filteredLeads = mockLeads.filter((lead) => {
    const matchesSearch =
      lead.company.normalizedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || lead.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleStatusChange = (newStatus: Lead["status"]) => {
    console.log("Status changed to:", newStatus);
    // In a real app, this would update the backend
  };

  if (selectedLead) {
    return (
      <LeadDossier
        lead={selectedLead}
        onBack={() => navigate("/leads")}
        onStatusChange={handleStatusChange}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground">
            {filteredLeads.length} leads found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-border bg-card">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search leads by company, industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        {/* View Toggle */}
        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-none px-3"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-none px-3"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="outline" size="icon">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Quick filters:</span>
        {[
          { label: "High Score (80+)", count: mockLeads.filter((l) => l.score.total >= 80).length },
          { label: "New Today", count: mockLeads.filter((l) => l.status === "new").length },
          { label: "Needs Follow-up", count: 8 },
          { label: "Tender Leads", count: mockLeads.filter((l) => l.source.type === "tender").length },
        ].map((filter) => (
          <Badge
            key={filter.label}
            variant="outline"
            className="cursor-pointer hover:bg-secondary transition-colors"
          >
            {filter.label}
            <span className="ml-1.5 text-muted-foreground">({filter.count})</span>
          </Badge>
        ))}
      </div>

      {/* Leads Grid/List */}
      <AnimatePresence mode="wait">
        {filteredLeads.length > 0 ? (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                : "space-y-4"
            )}
          >
            {filteredLeads.map((lead, idx) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <LeadCard
                  lead={lead}
                  onClick={() => navigate(`/leads/${lead.id}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary mb-4">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No leads found
            </h3>
            <p className="text-muted-foreground max-w-md">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setPriorityFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Leads;
