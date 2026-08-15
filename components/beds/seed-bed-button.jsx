"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { seedBedData } from "@/actions/beds";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";

export function SeedBedDataButton({ onSeeded, compact = false }) {
  const [isPending, setIsPending] = useState(false);

  const handleSeed = async () => {
    setIsPending(true);
    try {
      const res = await seedBedData();
      if (res.success) {
        toast.success(res.message);
        if (onSeeded) onSeeded();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Error seeding bed data:", error);
      toast.error("Failed to seed demo bed data");
    } finally {
      setIsPending(false);
    }
  };

  if (compact) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleSeed}
        disabled={isPending}
        className="h-8 gap-1.5 border-dashed border-primary/40 text-primary hover:bg-primary/5"
        id="seed-bed-data-compact"
      >
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Sparkles className="h-3.5 w-3.5" />
        )}
        <span className="hidden xl:inline">Seed Demo</span>
      </Button>
    );
  }

  return (
    <Button
      onClick={handleSeed}
      disabled={isPending}
      className="gap-2 shadow-soft hover:shadow-hover"
      id="seed-bed-data-btn"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      Generate Demo Wards & Beds
    </Button>
  );
}
