import { guardPage } from "@/lib/guards";
import { getBedDashboardData } from "@/actions/beds";
import { BedDashboard } from "@/components/beds/bed-dashboard";
import { redirect } from "next/navigation";
import { BedDouble } from "lucide-react";

export const metadata = {
  title: "Bed Occupancy Tracker | Smart Hospital",
  description: "Real-time bed occupancy dashboard across all hospital wards and floors",
};

export default async function BedsPage() {
  const guard = await guardPage("beds", "read");

  if (!guard.authorized) {
    if (guard.status === 401) {
      redirect("/sign-in");
    }
    if (guard.status === 403) {
      redirect("/forbidden");
    }
    redirect("/sign-in");
  }

  const bedDataResult = await getBedDashboardData();
  const initialData = bedDataResult.success
    ? bedDataResult.data
    : { floors: {}, stats: { total: 0, vacant: 0, occupied: 0, reserved: 0, needsCleaning: 0 }, wards: [] };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <BedDouble className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Bed Occupancy Tracker
              </h1>
              <p className="text-sm text-muted-foreground">
                Live centralized ward status, occupancy management, and housekeeping tracking
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Client View */}
      <BedDashboard initialData={initialData} userRole={guard.role} />
    </div>
  );
}
