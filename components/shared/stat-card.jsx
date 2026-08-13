import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({ title, value, description, icon: Icon, trend }) {
  return (
    <Card className="shadow-soft border-border/40 bg-card rounded-3xl overflow-hidden hover:shadow-hover hover:-translate-y-0.5 transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">{title}</p>
            <p className="text-3xl font-black tracking-tight text-foreground">{value}</p>
            {description && <p className="text-xs font-semibold text-muted-foreground">{description}</p>}
          </div>
          {Icon && (
            <div className="gradient-primary text-white p-3.5 rounded-2xl shadow-md shadow-primary/20 group-hover:scale-110 transition-transform duration-300 shrink-0">
              <Icon className="size-6" />
            </div>
          )}
        </div>
        {trend && (
          <div className="mt-4 pt-3 border-t border-border/40 flex items-center gap-1.5 text-xs font-bold">
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