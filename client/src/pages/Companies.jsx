import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { companiesApi } from "@/lib/api";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Building2,
  MapPin,
  Globe,
  Users,
  DollarSign,
  ExternalLink,
  Factory,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Plus,
  Download,
  Filter,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Companies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: [
      "companies",
      {
        search: searchQuery,
        industry: industryFilter,
        customer: customerFilter,
        page,
      },
    ],
    queryFn: () =>
      companiesApi.getAll({
        ...(searchQuery && { search: searchQuery }),
        ...(industryFilter !== "all" && { industry: industryFilter }),
        ...(customerFilter !== "all" && {
          isCustomer: customerFilter === "customer",
        }),
        page,
        limit: 50,
      }),
  });

  const companies = data?.companies || data?.data || [];
  const total = data?.total || companies.length;

  // Get unique industries from fetched data
  const industries = [
    ...new Set(companies.map((c) => c.industry).filter(Boolean)),
  ];

  const filteredCompanies = companies;

  const formatCurrency = (value) => {
    if (!value) return "N/A";
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(0)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(0)} L`;
    return `₹${value.toLocaleString()}`;
  };

  const customerCount = companies.filter((c) => c.isCustomer).length;
  const totalEmployees = companies.reduce(
    (acc, c) => acc + (c.employeeCount || 0),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Companies</h1>
          <p className="text-muted-foreground">{total} companies in database</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Company
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
            placeholder="Search companies by name, industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Industry Filter */}
        <Select value={industryFilter} onValueChange={setIndustryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {industries.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Customer Filter */}
        <Select value={customerFilter} onValueChange={setCustomerFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            <SelectItem value="customer">Customers</SelectItem>
            <SelectItem value="prospect">Prospects</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Companies Table */}
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
                <TableHead className="font-semibold">Company</TableHead>
                <TableHead className="font-semibold">Industry</TableHead>
                <TableHead className="font-semibold">Locations</TableHead>
                <TableHead className="font-semibold">Products</TableHead>
                <TableHead className="font-semibold">Turnover</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company, idx) => {
                const name =
                  company.normalizedName || company.name || "Unknown";
                const prods = company.productNeeds || company.products || [];
                const locs = company.locations || [];
                return (
                  <motion.tr
                    key={company._id || company.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-secondary/30 cursor-pointer"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold">
                          {name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{name}</p>
                          {company.website && (
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-primary hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Globe className="h-3 w-3" />
                              Website
                            </a>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-foreground">{company.industry}</p>
                        <p className="text-xs text-muted-foreground">
                          {company.subIndustry}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {locs.slice(0, 2).map((loc, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            <MapPin className="h-3 w-3 mr-1" />
                            {loc.city || loc.state}
                          </Badge>
                        ))}
                        {locs.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{locs.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {prods.slice(0, 2).map((product, i) => (
                          <Badge
                            key={i}
                            className="bg-primary/10 text-primary border-primary/30 text-xs"
                          >
                            {typeof product === "string"
                              ? product
                              : product.productName || product.productCode}
                          </Badge>
                        ))}
                        {prods.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{prods.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">
                          {formatCurrency(company.turnover)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {company.isCustomer ? (
                        <Badge className="bg-success/20 text-success border-success/30">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Customer
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <XCircle className="h-3 w-3 mr-1" />
                          Prospect
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        View
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>

          {filteredCompanies.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary mb-4">
                <Building2 className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No companies found
              </h3>
              <p className="text-muted-foreground max-w-md">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{total}</p>
              <p className="text-sm text-muted-foreground">Total Companies</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {customerCount}
              </p>
              <p className="text-sm text-muted-foreground">Customers</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20">
              <Factory className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {industries.length}
              </p>
              <p className="text-sm text-muted-foreground">Industries</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/20">
              <Users className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {totalEmployees.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Employees</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Companies;
