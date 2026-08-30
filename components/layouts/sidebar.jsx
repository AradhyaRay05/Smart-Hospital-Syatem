"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRole } from "@/hooks/use-role";
import { getNavigationForRole } from "@/lib/navigation";

export function Sidebar({ collapsed, onToggle, isMobile = false }) {
  const pathname = usePathname();
  const { role } = useRole();
  const navigation = getNavigationForRole(role);
  const allHrefs = navigation.flatMap((group) => group.items.map((item) => item.href));
  const hasExactMatch = allHrefs.includes(pathname);

  const handleNavClick = () => {
    if (isMobile) {
      onToggle();
    }
  };

  return (
    <aside
      className={cn(
        "flex h-screen max-h-screen flex-col bg-card/85 backdrop-blur-xl supports-[backdrop-filter]:bg-card/75 shadow-soft transition-all duration-300 relative z-30",
        !isMobile && "border-r border-border/40",
        isMobile && "rounded-r-3xl overflow-hidden",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Floating Re-expand Arrow Button when Collapsed */}
      {!isMobile && collapsed && (
        <button
          type="button"
          onClick={onToggle}
          aria-label="Expand sidebar"
          title="Expand sidebar"
          className="absolute top-4.5 -right-3.5 z-50 flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-card shadow-md text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:border-primary/40 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="size-4" />
        </button>
      )}

      {/* Sidebar Header & Brand */}
      <div className={cn(
        "flex h-16 shrink-0 items-center border-b border-border/40",
        collapsed ? "justify-center px-2" : "justify-between px-4"
      )}>
        <Link href="/dashboard" className="flex items-center gap-3 group" title="SHDS Dashboard">
          <div className="gradient-primary rounded-xl p-2 shadow-md shadow-primary/20 transition-transform duration-300 group-hover:scale-105">
            <Activity className="size-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-xl font-extrabold tracking-tight text-foreground transition-opacity duration-300">
              SHDS
            </span>
          )}
        </Link>
        {!collapsed && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggle} 
            className="hidden lg:flex h-8 w-8 rounded-xl hover:bg-muted"
            title="Collapse sidebar"
          >
            <ChevronLeft className="size-4 text-muted-foreground" />
          </Button>
        )}
      </div>

      {/* Sidebar Navigation */}
      <ScrollArea className="flex-1 min-h-0 py-3">
        <nav className="space-y-6 px-3 pb-16">
          {navigation.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="mb-2 px-3 text-xs font-extrabold uppercase tracking-widest text-muted-foreground/80">
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
                      onClick={handleNavClick}
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