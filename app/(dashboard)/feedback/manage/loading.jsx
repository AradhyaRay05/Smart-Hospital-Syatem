import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function FeedbackLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="border-0 shadow-soft">
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-12" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Bar Skeleton */}
      <Card className="border shadow-xs">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-9 flex-1 min-w-[200px]" />
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-36" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* List Skeletons */}
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border shadow-xs p-5">
            <div className="space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
