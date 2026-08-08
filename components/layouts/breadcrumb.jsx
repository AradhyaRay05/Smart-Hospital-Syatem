"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground">
      <Link href="/dashboard" className="flex items-center gap-1 hover:text-foreground">
        <Home className="size-3.5" />
      </Link>
      {items?.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <ChevronRight className="size-3.5" />
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground">{item.label}</Link>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
