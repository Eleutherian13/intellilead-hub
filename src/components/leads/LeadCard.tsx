import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  MapPin,
  TrendingUp,
  ChevronRight,
  Target,
  Clock,
} from "lucide-react";
import { Lead } from "@/types/lead";
import { motion } from "framer-motion";

interface LeadCardProps {
  lead: Lead;
  onClick?: () => void;
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const priorityStyles = {
    high: {
      indicator: "bg-red-500",
      badge: "bg-red-500/20 text-red-400 border-red-500/30",
    },
    medium: {
      indicator: "bg-amber-500",
      badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    },
    low: {
      indicator: "bg-emerald-500",
      badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
  };

  const statusStyles = {
    new: "status-new",
    assigned: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    contacted: "status-contacted",
    converted: "status-converted",
    rejected: "status-rejected",
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500/20";
    if (score >= 60) return "bg-amber-500/20";
    return "bg-red-500/20";
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="relative group"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-border/50",
          "bg-card hover:bg-card/80 transition-all duration-300",
          "hover:border-primary/30 hover:shadow-lg cursor-pointer"
        )}
        onClick={onClick}
      >
        {/* Priority indicator */}
        <div
          className={cn(
            "priority-indicator",
            priorityStyles[lead.priority].indicator
          )}
        />

        <div className="p-5 pl-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground line-clamp-1">
                  {lead.company.normalizedName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {lead.company.industry}
                </p>
              </div>
            </div>

            {/* Score Badge */}
            <div
              className={cn(
                "flex flex-col items-center justify-center rounded-lg p-2 min-w-[60px]",
                getScoreBgColor(lead.score.total)
              )}
            >
              <span className={cn("text-xl font-bold", getScoreColor(lead.score.total))}>
                {lead.score.total}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Score
              </span>
            </div>
          </div>

          {/* Source & Location */}
          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5" />
              <span className="capitalize">{lead.source.type}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span>{lead.company.locations[0]?.state || "Unknown"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatTimeAgo(lead.createdAt)}</span>
            </div>
          </div>

          {/* Inferred Products */}
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Recommended Products</p>
            <div className="flex flex-wrap gap-2">
              {lead.inferredProducts.slice(0, 3).map((product, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/30"
                >
                  {product.product}
                  <span className="ml-1 text-muted-foreground">
                    {product.confidence}%
                  </span>
                </Badge>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn("capitalize", statusStyles[lead.status])}
              >
                {lead.status}
              </Badge>
              <Badge
                variant="outline"
                className={cn("capitalize", priorityStyles[lead.priority].badge)}
              >
                {lead.priority}
              </Badge>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary hover:bg-primary/10"
            >
              View Details
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
        </div>
      </div>
    </motion.div>
  );
}
