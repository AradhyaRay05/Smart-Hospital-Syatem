"use client";

/**
 * motion-fx.jsx
 * ---------------------------------------------------------------------------
 * A small, dependency-free "Unlumen UI / Smooth UI" style motion layer.
 *
 * Unlumen UI and Smooth UI are shadcn-CLI-installed component registries
 * (React + Tailwind + Motion) for hover-zoom, hover-glow, and text-reveal /
 * shimmer effects. This file reproduces the same visual language —
 * spring-like zoom on hover, soft glow-on-hover halos, word-by-word text
 * reveal, shimmering text, and magnetic buttons — using plain React,
 * Tailwind utility classes, and the Web Animations/IntersectionObserver
 * APIs already available in the browser. That keeps the effects consistent
 * across the whole app without requiring a package install step.
 *
 * All primitives respect `prefers-reduced-motion`.
 * ---------------------------------------------------------------------------
 */

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  ZoomHover — Unlumen-style "zoom over hover" wrapper                       */
/* -------------------------------------------------------------------------- */
/**
 * Wrap any card/tile/image in this to get a smooth spring-like scale-up on
 * hover/focus, with an optional subtle lift. Use `strength` to tune scale.
 */
export function ZoomHover({
  children,
  className = "",
  strength = "md", // "sm" | "md" | "lg"
  lift = true,
  as: Tag = "div",
  ...props
}) {
  const strengths = {
    sm: "hover:scale-[1.03] focus-within:scale-[1.03]",
    md: "hover:scale-[1.06] focus-within:scale-[1.06]",
    lg: "hover:scale-110 focus-within:scale-110",
  };

  return (
    <Tag
      className={cn(
        "transition-transform duration-500 ease-out will-change-transform motion-reduce:transition-none motion-reduce:hover:scale-100",
        "[transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]",
        strengths[strength] || strengths.md,
        lift && "hover:-translate-y-1 focus-within:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/*  GlowHover — Unlumen-style "glow over hover" wrapper                       */
/* -------------------------------------------------------------------------- */
/**
 * Adds a soft, colored glow halo that fades in on hover/focus behind the
 * element, plus a brightened ring/border. Pass `color` as a Tailwind color
 * token pair (e.g. "primary", "accent", "cyan").
 */
export function GlowHover({
  children,
  className = "",
  color = "primary",
  intensity = "md", // "sm" | "md" | "lg"
  as: Tag = "div",
  ...props
}) {
  const glowColorVar =
    color === "primary"
      ? "var(--primary)"
      : color === "accent"
      ? "var(--accent)"
      : color === "destructive"
      ? "var(--destructive)"
      : color;

  const intensities = { sm: "0.25", md: "0.45", lg: "0.65" };
  const blurAmount = { sm: "18px", md: "28px", lg: "40px" };

  return (
    <Tag
      className={cn(
        "group/glow relative isolate transition-all duration-500 motion-reduce:transition-none",
        className
      )}
      style={{ "--glow-color": glowColorVar }}
      {...props}
    >
      {/* Glow halo */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-1 -z-10 rounded-[inherit] opacity-0 blur-2xl transition-opacity duration-500 group-hover/glow:opacity-100 group-focus-within/glow:opacity-100 motion-reduce:hidden"
        style={{
          background: `radial-gradient(closest-side, color-mix(in oklab, var(--glow-color) ${
            Number(intensities[intensity] || intensities.md) * 100
          }%, transparent), transparent 75%)`,
          filter: `blur(${blurAmount[intensity] || blurAmount.md})`,
        }}
      />
      {/* Brightened ring on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-[5] rounded-[inherit] ring-1 ring-transparent transition-all duration-500 group-hover/glow:ring-2"
        style={{ "--tw-ring-color": "color-mix(in oklab, var(--glow-color) 55%, transparent)" }}
      />
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/*  ZoomGlowCard — convenience combo used across cards/tiles                  */
/* -------------------------------------------------------------------------- */
export function ZoomGlowCard({ children, className = "", color = "primary", ...props }) {
  return (
    <GlowHover color={color} className="rounded-[inherit]">
      <ZoomHover
        strength="sm"
        className={cn(
          "h-full rounded-3xl border border-border/50 bg-card shadow-soft transition-colors duration-300 hover:border-primary/40 hover:shadow-hover",
          className
        )}
        {...props}
      >
        {children}
      </ZoomHover>
    </GlowHover>
  );
}

/* -------------------------------------------------------------------------- */
/*  GlowButton — Unlumen "Glow Button" style CTA                              */
/* -------------------------------------------------------------------------- */
export function GlowButtonWrap({ children, className = "", color = "accent" }) {
  const glowColorVar =
    color === "primary" ? "var(--primary)" : color === "accent" ? "var(--accent)" : color;
  return (
    <span
      className={cn("group/gb relative inline-flex isolate", className)}
      style={{ "--glow-color": glowColorVar }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-2 -z-10 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover/gb:opacity-90 motion-reduce:hidden"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--glow-color) 65%, transparent), transparent 70%)",
        }}
      />
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  TextReveal — Smooth UI style word-by-word reveal on scroll-into-view      */
/* -------------------------------------------------------------------------- */
export function TextReveal({
  text,
  as: Tag = "span",
  className = "",
  splitBy = "words", // "words" | "chars"
  staggerMs = 40,
  once = true,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  const units = splitBy === "chars" ? Array.from(text) : text.split(" ");

  return (
    <Tag ref={ref} className={cn("inline", className)}>
      {units.map((unit, i) => (
        <span
          key={`${unit}-${i}`}
          className="inline-block transition-all duration-500 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0"
          style={{
            transitionDelay: `${i * staggerMs}ms`,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(0.6em)",
          }}
        >
          {unit}
          {splitBy === "words" && i < units.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/*  ShimmerText — Smooth UI style shimmering gradient text                    */
/* -------------------------------------------------------------------------- */
export function ShimmerText({ children, as: Tag = "span", className = "" }) {
  return (
    <Tag
      className={cn(
        "inline-block pb-2.5 pt-1 bg-[length:200%_auto] bg-clip-text text-transparent motion-reduce:animate-none",
        "bg-gradient-to-r from-teal-300 via-sky-200 to-teal-300 animate-[shimmer_5s_ease-in-out_infinite]",
        className
      )}
    >
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/*  CountUp — animated number, honoring reduced motion                       */
/* -------------------------------------------------------------------------- */
export function CountUp({ value, duration = 1600, suffix = "", className = "", once = true }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !started.current)) {
          started.current = true;
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - (1 - progress) * (1 - progress);
            setDisplay(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(step);
            else setDisplay(value);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration, once]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  ScrollFadeIn — shared fade/slide-in-on-scroll wrapper                     */
/* -------------------------------------------------------------------------- */
export function ScrollFadeIn({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out transform motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12 pointer-events-none",
        className
      )}
    >
      {children}
    </div>
  );
}
