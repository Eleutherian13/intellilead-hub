import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statCardVariants = cva(
  "relative overflow-hidden rounded-xl border p-6 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-card border-border hover:border-primary/50",
        gradient: "bg-gradient-card border-border/50",
        glass: "glass-card",
        elevated: "bg-card border-border shadow-lg hover:shadow-xl",
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label?: string;
  };
  accentColor?: "primary" | "success" | "warning" | "danger" | "info";
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      variant,
      size,
      title,
      value,
      subtitle,
      icon,
      trend,
      accentColor = "primary",
      ...props
    },
    ref
  ) => {
    const accentColors = {
      primary: "from-blue-500 to-cyan-500",
      success: "from-emerald-500 to-teal-500",
      warning: "from-amber-500 to-orange-500",
      danger: "from-red-500 to-pink-500",
      info: "from-blue-400 to-indigo-500",
    };

    const trendColor =
      trend && trend.value >= 0 ? "text-emerald-400" : "text-red-400";
    const trendIcon = trend && trend.value >= 0 ? "↑" : "↓";

    return (
      <div
        ref={ref}
        className={cn(statCardVariants({ variant, size }), "stat-card group", className)}
        {...props}
      >
        {/* Accent bar */}
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
            accentColors[accentColor]
          )}
        />

        {/* Background glow effect on hover */}
        <div
          className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            "bg-gradient-radial from-primary/5 to-transparent"
          )}
        />

        <div className="relative flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight text-foreground">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <div className={cn("flex items-center gap-1 text-sm", trendColor)}>
                <span>{trendIcon}</span>
                <span>{Math.abs(trend.value)}%</span>
                {trend.label && (
                  <span className="text-muted-foreground">{trend.label}</span>
                )}
              </div>
            )}
          </div>

          {icon && (
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-lg",
                "bg-gradient-to-br",
                accentColors[accentColor],
                "text-white shadow-lg"
              )}
            >
              {icon}
            </div>
          )}
        </div>
      </div>
    );
  }
);

StatCard.displayName = "StatCard";

export { StatCard, statCardVariants };
