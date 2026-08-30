"use client";

import { useEffect, useState } from "react";

export function GlassBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div 
      aria-hidden="true" 
      className="fixed inset-0 pointer-events-none -z-50 overflow-hidden select-none"
    >
      {/* Base theme ambient tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90 transition-colors duration-500" />

      {/* Floating Animated Ambient Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Orb 1: Primary Sky / Medical Cyan (Top Left) */}
        <div 
          className={`
            absolute -top-[10%] -left-[10%] w-[55vw] h-[55vw] min-w-[350px] min-h-[350px] max-w-[800px] max-h-[800px]
            rounded-full bg-gradient-to-br from-sky-400/30 via-primary/25 to-blue-600/20
            dark:from-sky-400/15 dark:via-primary/20 dark:to-cyan-600/10
            blur-[100px] sm:blur-[140px]
            ${mounted ? "animate-glass-orb-1" : "opacity-70"}
            transform-gpu will-change-transform
          `} 
        />

        {/* Orb 2: Emerald & Teal Accent (Top Right) */}
        <div 
          className={`
            absolute top-[5%] -right-[12%] w-[50vw] h-[50vw] min-w-[320px] min-h-[320px] max-w-[750px] max-h-[750px]
            rounded-full bg-gradient-to-bl from-teal-400/25 via-accent/20 to-emerald-500/15
            dark:from-teal-400/15 dark:via-accent/15 dark:to-emerald-600/10
            blur-[95px] sm:blur-[130px]
            ${mounted ? "animate-glass-orb-2" : "opacity-60"}
            transform-gpu will-change-transform
          `} 
        />

        {/* Orb 3: Deep Indigo / Cobalt Depth (Bottom Left / Center) */}
        <div 
          className={`
            absolute -bottom-[15%] left-[10%] w-[60vw] h-[60vw] min-w-[380px] min-h-[380px] max-w-[850px] max-h-[850px]
            rounded-full bg-gradient-to-tr from-indigo-500/20 via-primary/20 to-sky-400/15
            dark:from-indigo-600/15 dark:via-sky-600/12 dark:to-blue-500/10
            blur-[110px] sm:blur-[150px]
            ${mounted ? "animate-glass-orb-3" : "opacity-60"}
            transform-gpu will-change-transform
          `} 
        />

        {/* Orb 4: Soft Cyan & Mint Glow (Bottom Right) */}
        <div 
          className={`
            absolute bottom-[10%] -right-[10%] w-[45vw] h-[45vw] min-w-[300px] min-h-[300px] max-w-[650px] max-h-[650px]
            rounded-full bg-gradient-to-tl from-cyan-300/25 via-teal-400/20 to-sky-500/15
            dark:from-cyan-400/12 dark:via-teal-500/10 dark:to-sky-600/10
            blur-[90px] sm:blur-[120px]
            ${mounted ? "animate-glass-orb-4" : "opacity-50"}
            transform-gpu will-change-transform
          `} 
        />
      </div>

      {/* Glassmorphic Frosted Sheen & Micro Subtle Grid Overlay */}
      <div className="absolute inset-0 backdrop-blur-[60px] sm:backdrop-blur-[80px]" />
      
      {/* Subtle Radial Vignette for Contrast & Readability */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_30%,rgba(0,0,0,0.03)_100%] dark:bg-radial-[circle_at_center,transparent_20%,rgba(0,0,0,0.4)_100%]" />
    </div>
  );
}
