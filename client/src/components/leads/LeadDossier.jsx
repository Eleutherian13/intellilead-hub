import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  MapPin,
  Globe,
  Users,
  DollarSign,
  Factory,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  ExternalLink,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";

export function LeadDossier({ lead, onBack, onStatusChange }) {
  const company = lead.company || {};
  const scoreBreakdown = lead.scoreBreakdown || {};
  const dossier = lead.dossier || {};
  const source = lead.source || {};
  const products = lead.inferredProducts || [];

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const getProgressColor = (score) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRevenue = (value) => {
    if (!value) return "N/A";
    return value;
  };

  // Build signals from dossier urgencyIndicators + procurementClues
  const signals = [
    ...(dossier.urgencyIndicators || []).map((indicator) => ({
      type: "Urgency",
      value: indicator,
    })),
    ...(dossier.procurementClues || []).map((clue) => ({
      type: "Procurement",
      value: clue,
    })),
  ];

  const statuses = ["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Leads
        </Button>

        <div className="flex items-center gap-2 flex-wrap">
          {statuses.map((status) => (
            <Button
              key={status}
              variant={lead.status === status ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusChange?.(status)}
              className={cn(
                "capitalize",
                lead.status === status && "bg-primary",
              )}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Overview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white text-2xl font-bold">
                {(lead.companyName || company.name || "?").charAt(0)}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  {lead.companyName || company.name || "Unknown Company"}
                </h1>
                <p className="text-muted-foreground">
                  {company.industry || "N/A"}{company.subIndustry ? ` \u2022 ${company.subIndustry}` : ""}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {company.status === "active" && (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Active Company
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Company Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-lg bg-secondary/50 p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-xs">Revenue</span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {formatRevenue(company.annualRevenue)}
                </p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-xs">Employees</span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {company.employeeCount ? company.employeeCount.toLocaleString() : "N/A"}
                </p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs">Locations</span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {company.locations?.length || 0}
                </p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Factory className="h-4 w-4" />
                  <span className="text-xs">Size</span>
                </div>
                <p className="text-lg font-semibold text-foreground capitalize">
                  {company.size || "N/A"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Signal Detection Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Detected Signals
            </h2>

            {signals.length > 0 ? (
              <div className="space-y-3">
                {signals.map((signal, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                        <Target className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground capitalize">
                          {signal.type}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {signal.value}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        signal.type === "Urgency"
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : "bg-amber-500/20 text-amber-400 border-amber-500/30",
                      )}
                    >
                      {signal.type}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No signals detected yet.</p>
            )}

            {/* Dossier info */}
            {dossier.companyProfile && (
              <div className="mt-4 p-3 rounded-lg bg-secondary/20 border border-border/50">
                <p className="text-sm font-medium text-foreground mb-1">Company Profile</p>
                <p className="text-sm text-muted-foreground">{dossier.companyProfile}</p>
              </div>
            )}
            {dossier.nextAction && (
              <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm font-medium text-primary">Next Action</p>
                <p className="text-sm text-foreground">{dossier.nextAction}</p>
              </div>
            )}
          </motion.div>

          {/* Source Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Source Information
            </h2>

            <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Badge variant="outline" className="capitalize mb-2">
                    {source.type || "manual"}
                  </Badge>
                  <h3 className="font-medium text-foreground">
                    {source.name || "Manual Entry"}
                  </h3>
                </div>
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    View Source
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              {source.rawSnippet && (
                <p className="text-sm text-muted-foreground mb-3">
                  {source.rawSnippet}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Scraped: {formatDate(source.scrapedAt)}
              </div>
            </div>

            {/* Score Explanation */}
            {lead.scoreExplanation && (
              <div className="mt-4 p-3 rounded-lg bg-secondary/20 border border-border/50">
                <p className="text-sm font-medium text-foreground mb-1">Score Explanation</p>
                <p className="text-sm text-muted-foreground">{lead.scoreExplanation}</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Lead Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Lead Score
            </h2>

            <div className="flex items-center justify-center mb-6">
              <div
                className={cn(
                  "flex flex-col items-center justify-center w-28 h-28 rounded-full",
                  "bg-gradient-to-br from-primary/20 to-accent/20 border-4",
                  (lead.score || 0) >= 80
                    ? "border-emerald-500"
                    : (lead.score || 0) >= 60
                      ? "border-amber-500"
                      : "border-red-500",
                )}
              >
                <span
                  className={cn(
                    "text-4xl font-bold",
                    getScoreColor(lead.score || 0),
                  )}
                >
                  {lead.score || 0}
                </span>
                <span className="text-xs text-muted-foreground">/ 100</span>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: "Company Fit", value: scoreBreakdown.companyFit || 0 },
                { label: "Signal Strength", value: scoreBreakdown.signalStrength || 0 },
                { label: "Urgency", value: scoreBreakdown.urgency || 0 },
                { label: "Volume Potential", value: scoreBreakdown.volumePotential || 0 },
                { label: "Geographic Fit", value: scoreBreakdown.geographicFit || 0 },
              ].map((score) => (
                <div key={score.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{score.label}</span>
                    <span
                      className={cn("font-medium", getScoreColor(score.value))}
                    >
                      {score.value}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        getProgressColor(score.value),
                      )}
                      style={{ width: `${score.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Recommended Products
            </h2>

            {products.length > 0 ? (
              <div className="space-y-4">
                {products.map((product, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-secondary/30 border border-border/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">
                        {product.productName || product.productCode}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          product.confidence >= 80
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : product.confidence >= 60
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30",
                        )}
                      >
                        {product.confidence}% match
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {product.reason}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${product.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-primary">
                        {product.confidence}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No products inferred yet.</p>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Quick Actions
            </h2>

            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Call Company
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          </motion.div>

          {/* Locations */}
          {(company.locations?.length > 0 || lead.location?.city) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Locations
              </h2>

              <div className="space-y-3">
                {/* Lead location */}
                {lead.location?.city && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {lead.location.city}{lead.location.state ? `, ${lead.location.state}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">Lead Location</p>
                    </div>
                  </div>
                )}
                {/* Company locations */}
                {(company.locations || []).map((location, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {location.city}{location.state ? `, ${location.state}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {location.type || "office"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
