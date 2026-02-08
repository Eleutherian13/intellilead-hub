import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function TerritoryHeatmap({ data }) {
  const maxLeads = Math.max(...data.map((d) => d.leads));

  const getHeatColor = (leads) => {
    const intensity = leads / maxLeads;
    if (intensity > 0.8) return "bg-blue-500";
    if (intensity > 0.6) return "bg-blue-400";
    if (intensity > 0.4) return "bg-blue-300";
    if (intensity > 0.2) return "bg-blue-200";
    return "bg-blue-100";
  };

  const getTextColor = (leads) => {
    const intensity = leads / maxLeads;
    return intensity > 0.5 ? "text-white" : "text-gray-800";
  };

  return (
    <div className="space-y-4">
      {/* Territory Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {data.map((territory, idx) => (
          <motion.div
            key={territory.state}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className={cn(
              "relative p-4 rounded-lg",
              getHeatColor(territory.leads),
              "hover:scale-105 transition-transform cursor-pointer",
            )}
          >
            <p
              className={cn(
                "text-sm font-medium truncate",
                getTextColor(territory.leads),
              )}
            >
              {territory.state}
            </p>
            <p
              className={cn(
                "text-2xl font-bold",
                getTextColor(territory.leads),
              )}
            >
              {territory.leads}
            </p>
            <p
              className={cn(
                "text-xs opacity-80",
                getTextColor(territory.leads),
              )}
            >
              leads
            </p>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 pt-4 border-t border-border/50">
        <span className="text-xs text-muted-foreground">Lead Density:</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-blue-100" />
          <span className="text-xs text-muted-foreground">Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-blue-300" />
          <span className="text-xs text-muted-foreground">Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-blue-500" />
          <span className="text-xs text-muted-foreground">High</span>
        </div>
      </div>
    </div>
  );
}
