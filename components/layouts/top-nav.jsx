"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRole } from "@/hooks/use-role";
import { toast } from "sonner";

export function TopNav({ onMenuToggle }) {
  const router = useRouter();
  const { user } = useRole();
  const [loggingOut, setLoggingOut] = useState(false);

  const initials = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() : "U";

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/sign-in");
    } catch {
      toast.error("Logout failed");
    }
    setLoggingOut(false);
  };

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center gap-4 border-b border-border/40 bg-card/80 px-4 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60 lg:px-8">
      {/* Mobile Menu Toggle */}
      <Button variant="ghost" size="icon" onClick={onMenuToggle} className="lg:hidden rounded-xl h-10 w-10 hover:bg-muted">
        <Menu className="size-5" />
      </Button>

      {/* Global Search Bar */}
      <div className="flex flex-1 items-center gap-4">
        <div className="relative hidden w-full max-w-md md:block">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search patients, doctors, appointments..." 
            className="pl-11 h-11 rounded-xl bg-background/50 border-border/50 focus-visible:ring-primary/30 font-medium text-sm transition-all focus:bg-background" 
          />
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative rounded-xl h-10 w-10 hover:bg-muted">
          <Bell className="size-5 text-muted-foreground" />
          <span className="absolute right-2 top-2 size-2.5 rounded-full bg-teal-500 ring-2 ring-card animate-pulse" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 rounded-2xl p-1.5 pr-2 outline-none hover:bg-muted/80 transition-colors border border-transparent hover:border-border/40">
            <Avatar className="size-9 border-2 border-background shadow-xs">
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs font-extrabold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-bold text-foreground leading-tight">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs font-semibold text-primary capitalize">{user?.role?.toLowerCase() || "User"}</p>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-xl border-border/40">
            <div className="px-3 py-2.5 mb-1 rounded-xl bg-muted/40 border border-border/30">
              <p className="text-sm font-extrabold text-foreground">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs font-semibold text-muted-foreground truncate">{user?.email}</p>
            </div>
            
            <DropdownMenuItem 
              onClick={() => router.push("/profile")}
              className="rounded-xl font-semibold cursor-pointer py-2.5 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <User className="mr-2.5 size-4 text-primary" /> Profile Settings
            </DropdownMenuItem>

            <DropdownMenuItem 
              onClick={handleLogout} 
              className="rounded-xl font-semibold cursor-pointer py-2.5 text-destructive focus:text-destructive focus:bg-destructive/10 transition-colors" 
              disabled={loggingOut}
            >
              <LogOut className="mr-2.5 size-4" />
              {loggingOut ? "Signing out..." : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}