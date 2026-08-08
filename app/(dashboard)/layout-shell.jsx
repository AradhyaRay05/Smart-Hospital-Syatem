"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layouts/sidebar";
import { TopNav } from "@/components/layouts/top-nav";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { RoleProvider } from "@/hooks/use-role";

export default function DashboardLayout({ children, role, user }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <RoleProvider role={role} user={user}>
      <div className="flex h-screen overflow-hidden">
        <div className="hidden lg:block">
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-[260px] p-0">
            <Sidebar collapsed={false} onToggle={() => {}} />
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 flex-col overflow-hidden">
          <TopNav onMenuToggle={() => setMobileOpen(true)} />
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-6">{children}</div>
          </main>
        </div>
      </div>
    </RoleProvider>
  );
}
