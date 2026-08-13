import { DashboardSkeleton } from "@/components/shared/skeletons";

export default function DashboardLoading() {
  return (
    <div className="animate-in fade-in duration-500">
      <DashboardSkeleton />
    </div>
  );
}