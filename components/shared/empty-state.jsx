import { cn } from "@/lib/utils";

export function EmptyState({ icon: Icon, title, description, children, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border/60 bg-muted/20 p-8 sm:p-12 text-center animate-in fade-in zoom-in-95 duration-300", className)}>
      {Icon && (
        <div className="mb-4 rounded-2xl bg-primary/10 p-4 text-primary shadow-inner">
          <Icon className="size-8" />
        </div>
      )}
      <h3 className="mb-1 text-xl font-extrabold tracking-tight text-foreground">{title}</h3>
      {description && <p className="mb-6 max-w-sm text-sm font-medium text-muted-foreground leading-relaxed">{description}</p>}
      {children}
    </div>
  );
}