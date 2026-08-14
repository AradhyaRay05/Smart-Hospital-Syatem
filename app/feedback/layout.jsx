import Link from "next/link";
import { Building2, ArrowLeft, ShieldCheck, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Patient Feedback & Grievance Kiosk | Smart Hospital",
  description: "Direct feedback routing, automated escalation, and real-time grievance tracking.",
};

export default function FeedbackLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background flex flex-col">
      {/* Kiosk Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md shadow-xs">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-lg leading-none tracking-tight block">Smart Hospital</span>
                <span className="text-xs text-muted-foreground font-medium">Patient Voice & Grievance Portal</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Rule-Based SLA Protected</span>
            </div>
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Back to Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Kiosk Content */}
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-10 max-w-5xl">
        {children}
      </main>

      {/* Kiosk Footer */}
      <footer className="border-t py-4 bg-background/50 text-center text-xs text-muted-foreground">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1">
            <HeartHandshake className="h-3.5 w-3.5 text-primary inline" />
            Every submission is tracked with a time-bound escalation guarantee.
          </p>
          <p>Need urgent emergency help? Call <strong>108 / +91 98765 00000</strong></p>
        </div>
      </footer>
    </div>
  );
}
