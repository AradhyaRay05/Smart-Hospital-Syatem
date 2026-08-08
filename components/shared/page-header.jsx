import { Breadcrumb } from "@/components/layouts/breadcrumb";

export function PageHeader({ title, description, breadcrumbs, children }) {
  return (
    <div className="mb-6 space-y-2">
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </div>
  );
}
