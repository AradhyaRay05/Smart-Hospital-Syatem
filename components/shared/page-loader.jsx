"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------------
   Default cycling messages shown when no specific hint is provided.
   Contextual pages can pass their own `messages` prop.
   -------------------------------------------------------------------------- */
const DEFAULT_MESSAGES = [
  "Be patient, we're on it…",
  "Fetching the latest data…",
  "Syncing records securely…",
  "Almost there, hold tight…",
  "Preparing your workspace…",
];

/**
 * PageLoader
 *
 * A full-height centered loader with a custom medical-themed icon
 * (triple pulse rings + heartbeat dot) and a rotating text hint.
 *
 * Props:
 *   messages  — string[]  Override cycling text phrases.
 *   className — string    Extra wrapper classes.
 *   size      — "sm"|"md"|"lg"  Controls icon size. Default "md".
 */
export function PageLoader({ messages, className, size = "md" }) {
  const phrases = messages && messages.length > 0 ? messages : DEFAULT_MESSAGES;
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((prev) => (prev + 1) % phrases.length);
        setVisible(true);
      }, 350);
    }, 2400);
    return () => clearInterval(interval);
  }, [phrases.length]);

  const iconSize = {
    sm: { outer: 52, mid: 36, inner: 22, dot: 8 },
    md: { outer: 72, mid: 50, inner: 30, dot: 12 },
    lg: { outer: 96, mid: 66, inner: 40, dot: 16 },
  }[size] ?? { outer: 72, mid: 50, inner: 30, dot: 12 };

  return (
    <div
      className={cn(
        "flex h-[60vh] flex-col items-center justify-center gap-6 animate-in fade-in duration-500",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={phrases[idx]}
    >
      {/* ── Custom Icon: triple-ring pulse + ECG heartbeat dot ── */}
      <div className="relative flex items-center justify-center" style={{ width: iconSize.outer, height: iconSize.outer }}>
        {/* Outer ping ring */}
        <span
          className="absolute rounded-full border-2 border-primary/30 animate-[ping_2.2s_ease-out_infinite]"
          style={{ width: iconSize.outer, height: iconSize.outer }}
          aria-hidden="true"
        />
        {/* Mid ring – counter-clockwise slow spin */}
        <span
          className="absolute rounded-full border-2 border-dashed border-primary/40 animate-[spin_6s_linear_infinite_reverse]"
          style={{ width: iconSize.mid, height: iconSize.mid }}
          aria-hidden="true"
        />
        {/* Inner ring – clockwise spin with gap */}
        <span
          className="absolute rounded-full border-2 border-primary/60 animate-[spin_3s_linear_infinite]"
          style={{
            width: iconSize.inner,
            height: iconSize.inner,
            borderTopColor: "transparent",
            borderRightColor: "transparent",
          }}
          aria-hidden="true"
        />
        {/* Heartbeat core dot */}
        <span
          className="rounded-full bg-primary animate-[pulse_1.4s_ease-in-out_infinite] shadow-lg shadow-primary/40"
          style={{ width: iconSize.dot, height: iconSize.dot }}
          aria-hidden="true"
        />
      </div>

      {/* ── Animated cycling message ── */}
      <p
        className={cn(
          "text-sm font-semibold text-muted-foreground tracking-wide text-center max-w-xs",
          "transition-all duration-300",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
        )}
      >
        {phrases[idx]}
      </p>

      {/* ── Subtle progress dots ── */}
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {phrases.map((_, i) => (
          <span
            key={i}
            className={cn(
              "rounded-full transition-all duration-500",
              i === idx
                ? "w-5 h-1.5 bg-primary"
                : "w-1.5 h-1.5 bg-primary/25"
            )}
          />
        ))}
      </div>
    </div>
  );
}
