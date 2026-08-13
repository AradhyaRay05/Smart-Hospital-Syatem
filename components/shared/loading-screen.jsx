import { Activity } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background relative overflow-hidden animate-in fade-in duration-300">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-5 p-8 bg-card/60 backdrop-blur-xl border border-border/40 rounded-3xl shadow-soft">
        <div className="gradient-primary rounded-2xl p-4 shadow-lg shadow-primary/20 animate-pulse">
          <Activity className="size-8 text-white" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-extrabold tracking-widest text-primary uppercase">Smart Hospital System</span>
          <p className="text-xs font-medium text-muted-foreground animate-pulse">Loading clinical modules...</p>
        </div>
      </div>
    </div>
  );
}