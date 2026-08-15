"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Menu,
  LogOut,
  User,
  AlertTriangle,
  CalendarDays,
  BedDouble,
  IndianRupee,
  CheckCircle2,
  Sparkles,
  Pill,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRole } from "@/hooks/use-role";
import { getUserNotifications } from "@/actions/notifications";
import { toast } from "sonner";

export function TopNav({ onMenuToggle }) {
  const router = useRouter();
  const { user } = useRole();
  const [loggingOut, setLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await getUserNotifications();
      if (res.success) {
        let readIds = new Set();
        try {
          readIds = new Set(JSON.parse(localStorage.getItem("shds_read_notifications") || "[]"));
        } catch {}
        const merged = res.data.map((item) =>
          readIds.has(item.id) ? { ...item, unread: false } : item
        );
        setNotifications(merged);
      }
    } catch (err) {
      console.error("Fetch notifications error:", err);
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000);
    const handleCustomRefresh = () => fetchNotifications();
    window.addEventListener("refresh-notifications", handleCustomRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener("refresh-notifications", handleCustomRefresh);
    };
  }, [fetchNotifications]);

  const initials = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() : "U";
  const unreadCount = notifications.filter((n) => n.unread).length;

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

  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, unread: false }));
      try {
        const ids = updated.map((n) => n.id);
        localStorage.setItem("shds_read_notifications", JSON.stringify(ids));
      } catch {}
      return updated;
    });
    toast.success("All notifications marked as read");
  };

  const handleNotificationClick = (n) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === n.id ? { ...item, unread: false } : item))
    );
    try {
      const existing = JSON.parse(localStorage.getItem("shds_read_notifications") || "[]");
      if (!existing.includes(n.id)) {
        existing.push(n.id);
        localStorage.setItem("shds_read_notifications", JSON.stringify(existing));
      }
    } catch {}
    if (n.href) router.push(n.href);
  };

  const getIconForType = (type) => {
    switch (type) {
      case "appointment":
        return <CalendarDays className="size-4 text-blue-500" />;
      case "prescription":
        return <Pill className="size-4 text-purple-500" />;
      case "billing":
        return <IndianRupee className="size-4 text-teal-500" />;
      case "feedback":
        return <AlertTriangle className="size-4 text-amber-500" />;
      default:
        return <CheckCircle2 className="size-4 text-primary" />;
    }
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
        {/* Notification Bell Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative rounded-xl h-10 w-10 flex items-center justify-center hover:bg-muted outline-none border border-transparent hover:border-border/40 transition-colors cursor-pointer">
            <Bell className="size-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 size-2.5 rounded-full bg-teal-500 ring-2 ring-card animate-pulse" />
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80 sm:w-96 rounded-2xl p-2 shadow-2xl border-border/40 space-y-1">
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-border/40">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-foreground">Notifications</span>
                {unreadCount > 0 ? (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold">
                    {unreadCount} new
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] font-semibold text-muted-foreground">
                    All caught up
                  </Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="space-y-1 max-h-80 overflow-y-auto py-1">
              {notifications.length === 0 ? (
                <div className="py-8 text-center space-y-1">
                  <p className="text-xs font-bold text-muted-foreground">No new notifications</p>
                  <p className="text-[11px] text-muted-foreground/70">You are all caught up!</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <DropdownMenuItem
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors border ${
                      n.unread
                        ? "bg-primary/5 border-primary/20 font-semibold"
                        : "border-transparent hover:bg-muted/60 text-muted-foreground"
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-background shadow-xs shrink-0 mt-0.5">
                      {n.icon || getIconForType(n.type)}
                    </div>
                    <div className="flex-1 space-y-0.5 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-foreground truncate">{n.title}</p>
                        <span className="text-[10px] text-muted-foreground shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-tight">
                        {n.desc}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 rounded-2xl p-1.5 pr-2 outline-none hover:bg-muted/80 transition-colors border border-transparent hover:border-border/40 cursor-pointer">
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