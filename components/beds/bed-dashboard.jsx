"use client";

import { useState, useEffect, useCallback } from "react";
import { getBedDashboardData } from "@/actions/beds";
import { BedStatsCards } from "./bed-stats-cards";
import { BedGrid } from "./bed-grid";
import { BedStatusDialog } from "./bed-status-dialog";
import { SeedBedDataButton } from "./seed-bed-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BED_TYPE_LABELS, BED_STATUS_LABELS, GENDER_WARD_LABELS } from "@/lib/constants";
import { RefreshCw, Filter, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BedDashboard({ initialData, userRole }) {
  const [data, setData] = useState(initialData);
  const [selectedBed, setSelectedBed] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [selectedFloor, setSelectedFloor] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedBedType, setSelectedBedType] = useState("all");
  const [selectedGenderWard, setSelectedGenderWard] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const result = await getBedDashboardData();
      if (result.success) {
        setData(result.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Failed to refresh bed data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Auto-polling every 10 seconds
  useEffect(() => {
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const handleBedClick = (bed, ward) => {
    setSelectedBed({ ...bed, ward });
    setDialogOpen(true);
  };

  const handleStatusUpdated = () => {
    refreshData();
    setDialogOpen(false);
    setSelectedBed(null);
  };

  if (!data || !data.floors || Object.keys(data.floors).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M2 4v16"/>
              <path d="M2 8h18a2 2 0 0 1 2 2v10"/>
              <path d="M2 17h20"/>
              <path d="M6 8v9"/>
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-foreground">No Bed Data Yet</h3>
          <p className="text-muted-foreground max-w-md">
            Set up wards and beds to start tracking bed occupancy across your hospital.
            {userRole === "ADMIN" || userRole === "SUPER_ADMIN"
              ? " Click below to generate demo data."
              : " Contact an administrator to set up bed data."}
          </p>
        </div>
        {(userRole === "ADMIN" || userRole === "SUPER_ADMIN") && (
          <SeedBedDataButton onSeeded={refreshData} />
        )}
      </div>
    );
  }

  // Extract unique values for filter dropdowns
  const allWards = data.wards || [];
  const floors = Object.keys(data.floors).sort((a, b) => a - b);
  const departments = [...new Map(allWards.map((w) => [w.department.id, w.department])).values()];

  // Apply filters
  const getFilteredWards = () => {
    let wards = allWards;
    if (selectedDepartment !== "all") {
      wards = wards.filter((w) => w.department.id === selectedDepartment);
    }
    if (selectedGenderWard !== "all") {
      wards = wards.filter((w) => w.genderWard === selectedGenderWard);
    }
    // Filter beds within wards
    wards = wards.map((ward) => {
      let beds = ward.beds;
      if (selectedBedType !== "all") {
        beds = beds.filter((b) => b.bedType === selectedBedType);
      }
      if (selectedStatus !== "all") {
        beds = beds.filter((b) => b.status === selectedStatus);
      }
      return { ...ward, beds };
    });
    // Remove wards with no beds after filtering
    wards = wards.filter((w) => w.beds.length > 0);
    return wards;
  };

  // Build filtered floors
  const getFilteredFloors = () => {
    const filteredWards = getFilteredWards();
    const result = {};
    for (const ward of filteredWards) {
      if (selectedFloor !== "all" && String(ward.floor) !== String(selectedFloor)) continue;
      if (!result[ward.floor]) {
        result[ward.floor] = [];
      }
      result[ward.floor].push(ward);
    }
    return result;
  };

  const filteredFloors = getFilteredFloors();
  const hasActiveFilters =
    selectedFloor !== "all" ||
    selectedDepartment !== "all" ||
    selectedBedType !== "all" ||
    selectedGenderWard !== "all" ||
    selectedStatus !== "all";

  const clearFilters = () => {
    setSelectedFloor("all");
    setSelectedDepartment("all");
    setSelectedBedType("all");
    setSelectedGenderWard("all");
    setSelectedStatus("all");
  };

  const canUpdate = userRole === "ADMIN" || userRole === "SUPER_ADMIN" || userRole === "RECEPTIONIST";

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <BedStatsCards stats={data.stats} />

      {/* Filter Bar + Last Updated */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </div>

          {/* Floor Filter */}
          <Select value={selectedFloor} onValueChange={setSelectedFloor}>
            <SelectTrigger className="w-[130px] h-9 text-sm" id="filter-floor">
              <SelectValue placeholder="Floor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Floors</SelectItem>
              {floors.map((f) => (
                <SelectItem key={f} value={String(f)}>
                  Floor {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Department Filter */}
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[170px] h-9 text-sm" id="filter-department">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Bed Type Filter */}
          <Select value={selectedBedType} onValueChange={setSelectedBedType}>
            <SelectTrigger className="w-[150px] h-9 text-sm" id="filter-bed-type">
              <SelectValue placeholder="Bed Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(BED_TYPE_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Gender Ward Filter */}
          <Select value={selectedGenderWard} onValueChange={setSelectedGenderWard}>
            <SelectTrigger className="w-[140px] h-9 text-sm" id="filter-gender-ward">
              <SelectValue placeholder="Gender Ward" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Wards</SelectItem>
              {Object.entries(GENDER_WARD_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[160px] h-9 text-sm" id="filter-status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(BED_STATUS_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 text-xs text-muted-foreground hover:text-foreground"
              id="clear-filters"
            >
              Clear all
            </Button>
          )}
        </div>

        {/* Last Updated + Manual Refresh */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <Clock className="h-3 w-3" />
            <span>Updated {lastUpdated.toLocaleTimeString("en-US")}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isRefreshing}
            className="h-8 gap-1.5"
            id="refresh-beds"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          {(userRole === "ADMIN" || userRole === "SUPER_ADMIN") && (
            <SeedBedDataButton onSeeded={refreshData} compact />
          )}
        </div>
      </div>

      {/* Bed Grid by Floor */}
      {Object.keys(filteredFloors).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <div className="w-16 h-16 rounded-xl bg-muted/50 flex items-center justify-center">
            <Filter className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground text-sm">No beds match the selected filters.</p>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      ) : (
        Object.entries(filteredFloors)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([floor, wards]) => (
            <div key={floor} className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground">
                  Floor {floor}
                </h2>
                <Badge variant="secondary" className="text-xs">
                  {wards.reduce((sum, w) => sum + w.beds.length, 0)} beds
                </Badge>
              </div>
              <BedGrid
                wards={wards}
                onBedClick={canUpdate ? handleBedClick : undefined}
              />
            </div>
          ))
      )}

      {/* Status Update Dialog */}
      {selectedBed && (
        <BedStatusDialog
          bed={selectedBed}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onStatusUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
}
