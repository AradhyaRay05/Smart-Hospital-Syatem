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
      <div className="flex h-screen overflow-hidden bg-background">
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block z-20 shadow-soft">
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-[280px] p-0 border-r-0 shadow-2xl">
            <Sidebar collapsed={false} onToggle={() => {}} />
          </SheetContent>
        </Sheet>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden relative">
          
          {/* Top Navigation */}
          <div className="z-10">
            <TopNav onMenuToggle={() => setMobileOpen(true)} />
          </div>
          
          {/* Scrollable Main View */}
          <main className="flex-1 overflow-y-auto scroll-smooth">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-[1600px] animate-in fade-in duration-500">
              {children}
            </div>
          </main>
          
        </div>
      </div>
    </RoleProvider>
  );
}