import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Target,
  TrendingUp,
  CheckCircle2,
  UserPlus,
  AlertCircle,
  Clock,
  CheckCheck,
  Trash2,
  Filter,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock notifications
const mockNotifications = [
  {
    id: "1",
    type: "new_lead",
    title: "New High-Priority Lead",
    message: "Tata Steel - Furnace Oil requirement detected from government tender",
    leadId: "lead-1",
    read: false,
    createdAt: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: "2",
    type: "status_change",
    title: "Lead Status Updated",
    message: "Hindalco Industries lead moved from 'New' to 'Contacted'",
    leadId: "lead-2",
    read: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "3",
    type: "conversion",
    title: "Lead Converted! 🎉",
    message: "Reliance Industries - Propylene deal successfully closed",
    leadId: "lead-5",
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "4",
    type: "assignment",
    title: "New Lead Assignment",
    message: "3 new leads assigned to your territory (East Region)",
    read: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "5",
    type: "reminder",
    title: "Follow-up Reminder",
    message: "UltraTech Cement lead pending follow-up for 3 days",
    leadId: "lead-3",
    read: true,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: "6",
    type: "new_lead",
    title: "New Tender Alert",
    message: "Indian Railways - Annual HSD Supply tender published",
    leadId: "lead-4",
    read: true,
    createdAt: new Date(Date.now() - 28800000).toISOString(),
  },
  {
    id: "7",
    type: "system",
    title: "System Update",
    message: "AI model retrained with 500+ new industry patterns",
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_lead":
        return Target;
      case "status_change":
        return TrendingUp;
      case "conversion":
        return CheckCircle2;
      case "assignment":
        return UserPlus;
      case "reminder":
        return AlertCircle;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "new_lead":
        return "bg-primary/20 text-primary";
      case "status_change":
        return "bg-warning/20 text-warning";
      case "conversion":
        return "bg-success/20 text-success";
      case "assignment":
        return "bg-info/20 text-info";
      case "reminder":
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteSelected = () => {
    setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
    setSelectedIds([]);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount} unread notifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <Button variant="outline" size="sm" onClick={deleteSelected}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete ({selectedIds.length})
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-border bg-card">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Notifications</SelectItem>
            <SelectItem value="unread">Unread Only</SelectItem>
            <SelectItem value="new_lead">New Leads</SelectItem>
            <SelectItem value="conversion">Conversions</SelectItem>
            <SelectItem value="status_change">Status Changes</SelectItem>
            <SelectItem value="assignment">Assignments</SelectItem>
            <SelectItem value="reminder">Reminders</SelectItem>
          </SelectContent>
        </Select>

        {/* Quick filter badges */}
        <div className="flex flex-wrap gap-2">
          {[
            { value: "new_lead", label: "Leads", count: notifications.filter((n) => n.type === "new_lead").length },
            { value: "conversion", label: "Conversions", count: notifications.filter((n) => n.type === "conversion").length },
            { value: "reminder", label: "Reminders", count: notifications.filter((n) => n.type === "reminder").length },
          ].map((quickFilter) => (
            <Badge
              key={quickFilter.value}
              variant={filter === quickFilter.value ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter(quickFilter.value === filter ? "all" : quickFilter.value)}
            >
              {quickFilter.label}
              <span className="ml-1 text-muted-foreground">({quickFilter.count})</span>
            </Badge>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredNotifications.map((notification, idx) => {
            const Icon = getNotificationIcon(notification.type);
            
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: idx * 0.03 }}
                className={cn(
                  "relative flex items-start gap-4 p-4 rounded-xl border",
                  "transition-all duration-200 hover:bg-secondary/30 group",
                  notification.read
                    ? "bg-card border-border/50"
                    : "bg-secondary/20 border-primary/30"
                )}
                onClick={() => markAsRead(notification.id)}
              >
                {/* Checkbox */}
                <Checkbox
                  checked={selectedIds.includes(notification.id)}
                  onCheckedChange={() => toggleSelect(notification.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1"
                />

                {/* Unread indicator */}
                {!notification.read && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-primary" />
                )}

                {/* Icon */}
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", getNotificationColor(notification.type))}>
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={cn("font-medium text-foreground", !notification.read && "font-semibold")}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {notification.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Action button */}
                  {notification.leadId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-8 text-primary hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Lead
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredNotifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary mb-4">
              <Bell className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No notifications
            </h3>
            <p className="text-muted-foreground max-w-md">
              {filter === "unread"
                ? "You're all caught up! No unread notifications."
                : "No notifications match your current filter."}
            </p>
            {filter !== "all" && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setFilter("all")}
              >
                Clear Filter
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
