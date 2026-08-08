import { cn } from "@/lib/utils";

export function EmptyState({ icon: Icon, title, description, children, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center", className)}>
      {Icon && (
        <div className="mb-4 rounded-full bg-muted p-4">
          <Icon className="size-8 text-muted-foreground" />
        </div>
      )}
      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      {description && <p className="mb-4 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {children}
    </div>
  );
}
