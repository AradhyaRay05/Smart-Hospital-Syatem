import { Breadcrumb } from "@/components/layouts/breadcrumb";

export function PageHeader({ title, description, breadcrumbs, children }) {
  return (
    <div className="mb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
          {description && <p className="text-base font-medium text-muted-foreground">{description}</p>}
        </div>
        {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
      </div>
    </div>
  );
}