import { TableSkeleton } from "@/components/shared/skeletons";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-48 rounded bg-muted animate-pulse" />
        <div className="h-4 w-72 rounded bg-muted animate-pulse" />
      </div>
      <div className="flex gap-4">
        <div className="h-10 flex-1 max-w-sm rounded bg-muted animate-pulse" />
        <div className="h-10 w-40 rounded bg-muted animate-pulse" />
      </div>
      <TableSkeleton />
    </div>
  );
}
