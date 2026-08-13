import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-2xl border border-border/50 bg-background/50 p-4 shadow-xs">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-5 flex-1 rounded-lg" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <Card className="shadow-soft border-border/40 rounded-3xl overflow-hidden">
      <CardHeader className="bg-muted/20 border-b border-border/30 pb-4">
        <Skeleton className="h-6 w-36 rounded-lg" />
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <Skeleton className="h-5 w-full rounded-lg" />
        <Skeleton className="h-5 w-3/4 rounded-lg" />
        <Skeleton className="h-5 w-1/2 rounded-lg" />
      </CardContent>
    </Card>
  );
}

export function StatCardSkeleton() {
  return (
    <Card className="shadow-soft border-border/40 rounded-3xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-3 w-32 rounded-md" />
          </div>
          <Skeleton className="size-12 rounded-2xl" />
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-3">
        <Skeleton className="h-9 w-72 rounded-xl" />
        <Skeleton className="h-5 w-96 rounded-lg" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  );
}