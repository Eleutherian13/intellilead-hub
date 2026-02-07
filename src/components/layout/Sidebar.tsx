import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  Bell,
  Settings,
  Target,
  Database,
  Activity,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const navItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    badge: null,
  },
  {
    title: "Leads",
    icon: Target,
    href: "/leads",
    badge: "23",
  },
  {
    title: "Companies",
    icon: Building2,
    href: "/companies",
    badge: null,
  },
  {
    title: "Sources",
    icon: Database,
    href: "/sources",
    badge: null,
  },
  {
    title: "Analytics",
    icon: Activity,
    href: "/analytics",
    badge: null,
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/notifications",
    badge: "5",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
    badge: null,
  },
];

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40",
        "flex flex-col",
        "bg-sidebar border-r border-sidebar-border"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <Zap className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <span className="font-bold text-sidebar-foreground">Lead Intel</span>
                <span className="text-xs text-sidebar-foreground/60">B2B Intelligence</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                "transition-all duration-200",
                "group relative",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-sidebar-primary"
                />
              )}

              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  isActive ? "text-sidebar-primary" : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground"
                )}
              />

              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex-1 font-medium"
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>

              {item.badge && !collapsed && (
                <Badge
                  className={cn(
                    "px-2 py-0.5 text-xs",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "bg-sidebar-accent text-sidebar-foreground/80"
                  )}
                >
                  {item.badge}
                </Badge>
              )}

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 rounded bg-popover text-popover-foreground text-sm opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity whitespace-nowrap z-50">
                  {item.title}
                  {item.badge && (
                    <Badge className="ml-2 px-1.5 py-0 text-xs bg-primary text-primary-foreground">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <div
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg",
            "bg-gradient-to-r from-primary/10 to-accent/10",
            "border border-primary/20"
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent">
            <Users className="h-5 w-5 text-sidebar-foreground" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 min-w-0"
              >
                <p className="font-medium text-sidebar-foreground truncate">
                  Sales Team
                </p>
                <p className="text-xs text-sidebar-foreground/60">
                  East Region
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
