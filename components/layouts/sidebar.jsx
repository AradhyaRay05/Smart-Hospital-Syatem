"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronLeft, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRole } from "@/hooks/use-role";
import { getNavigationForRole } from "@/lib/navigation";

export function Sidebar({ collapsed, onToggle }) {
  const pathname = usePathname();
  const { role } = useRole();
  const navigation = getNavigationForRole(role);
  const allHrefs = navigation.flatMap((group) => group.items.map((item) => item.href));
  const hasExactMatch = allHrefs.includes(pathname);

  return (
    <aside
      className={cn(
        "flex h-screen max-h-screen flex-col border-r border-border/40 bg-card shadow-soft transition-all duration-300 relative z-30 overflow-hidden",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Sidebar Header & Brand */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/40 px-4">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="gradient-primary rounded-xl p-2 shadow-md shadow-primary/20 transition-transform duration-300 group-hover:scale-105">
            <Activity className="size-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-xl font-extrabold tracking-tight text-foreground transition-opacity duration-300">
              SHDS
            </span>
          )}
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggle} 
          className="hidden lg:flex h-8 w-8 rounded-xl hover:bg-muted"
        >
          <ChevronLeft className={cn("size-4 transition-transform duration-300 text-muted-foreground", collapsed && "rotate-180")} />
        </Button>
      </div>

      {/* Sidebar Navigation */}
      <ScrollArea className="flex-1 min-h-0 py-3">
        <nav className="space-y-6 px-3 pb-16">
          {navigation.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="mb-2 px-3 text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground/80">
                  {group.label}
                </p>
              )}
              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const isActive = hasExactMatch
                    ? pathname === item.href
                    : pathname === item.href ||
                      (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200",
                        isActive
                          ? "gradient-primary text-white shadow-md shadow-primary/20"
                          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground hover:translate-x-0.5",
                        collapsed && "justify-center px-2 hover:translate-x-0"
                      )}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className={cn(
                        "size-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                        isActive ? "text-white" : "text-muted-foreground group-hover:text-primary"
                      )} />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}