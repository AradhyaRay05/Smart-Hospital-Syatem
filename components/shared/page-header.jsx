"use client";

import { Breadcrumb } from "@/components/layouts/breadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({ 
  title, 
  description, 
  breadcrumbs, 
  onBack, 
  children, 
  className = "" 
}) {
  return (
    <div className={cn("mb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300", className)}>
      {breadcrumbs && (
        <div className="flex items-center">
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-muted shrink-0 mt-0.5 sm:mt-0"
              onClick={onBack}
              title="Go back"
            >
              <ArrowLeft className="size-5" />
            </Button>
          )}
          <div className="space-y-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
              {title}
            </h1>
            {description && (
              <p className="text-sm sm:text-base font-medium text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
        {children && (
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}