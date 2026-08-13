import { TableSkeleton } from "@/components/shared/skeletons";

export default function Loading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-3">
        <div className="h-10 w-56 rounded-xl bg-muted/60 animate-pulse" />
        <div className="h-5 w-80 rounded-lg bg-muted/40 animate-pulse" />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="h-12 flex-1 max-w-sm rounded-xl bg-muted/60 animate-pulse" />
        <div className="h-12 w-48 rounded-xl bg-muted/60 animate-pulse" />
      </div>
      <div className="rounded-3xl border border-border/40 overflow-hidden p-6 bg-card">
        <TableSkeleton />
      </div>
    </div>
  );
}