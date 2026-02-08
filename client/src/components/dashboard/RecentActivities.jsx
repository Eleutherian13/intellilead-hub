import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  TrendingUp,
  CheckCircle2,
  XCircle,
  UserPlus,
  Bell,
  RefreshCw,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

export function RecentActivities({ activities }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case "new_lead":
        return TrendingUp;
      case "status_change":
        return RefreshCw;
      case "conversion":
        return Target;
      case "assignment":
        return Users;
      default:
        return Bell;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "new_lead":
        return "bg-blue-500/20 text-blue-400";
      case "status_change":
        return "bg-amber-500/20 text-amber-400";
      case "conversion":
        return "bg-emerald-500/20 text-emerald-400";
      case "assignment":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="space-y-3">
      {activities.map((activity, idx) => {
        const Icon = getActivityIcon(activity.type);

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg",
              "bg-secondary/30 border border-border/30",
              "hover:bg-secondary/50 transition-colors cursor-pointer",
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                getActivityColor(activity.type),
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground line-clamp-2">
                {activity.message}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatTimeAgo(activity.timestamp)}
              </p>
            </div>
            {activity.priority === "high" && (
              <Badge
                variant="outline"
                className="shrink-0 bg-red-500/20 text-red-400 border-red-500/30 text-xs"
              >
                High
              </Badge>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
