import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({ title, value, description, icon: Icon, trend }) {
  return (
    /* hover-zoom + hover-glow applied via global CSS utilities from globals.css.
       No extra import needed — the classes are available everywhere. */
    <Card className="hover-zoom hover-glow shadow-soft border-border/40 bg-card rounded-3xl overflow-hidden hover:shadow-hover hover:border-primary/30 transition-all duration-300 group">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 min-w-0">
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-muted-foreground truncate">
              {title}
            </p>
            <p className="text-2xl sm:text-3xl font-black tracking-tight text-foreground leading-none">
              {value}
            </p>
            {description && (
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground leading-snug">
                {description}
              </p>
            )}
          </div>
          {Icon && (
            <div className="gradient-primary text-white p-3 sm:p-3.5 rounded-2xl shadow-md shadow-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shrink-0">
              <Icon className="size-5 sm:size-6" />
            </div>
          )}
        </div>
        {trend && (
          <div className="mt-4 pt-3 border-t border-border/40 flex items-center gap-1.5 text-xs sm:text-sm font-bold">
            <span className={cn(
              "px-2 py-0.5 rounded-md",
              trend.positive
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
            )}>
              {trend.positive ? "+" : ""}{trend.value}%
            </span>
            <span className="text-muted-foreground font-medium">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}