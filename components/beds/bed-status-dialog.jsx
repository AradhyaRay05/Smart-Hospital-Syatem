"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { updateBedStatus, deleteSingleBed, getAvailablePatients } from "@/actions/beds";
import { BED_STATUS_LABELS, BED_TYPE_LABELS } from "@/lib/constants";
import { toast } from "sonner";
import { BedDouble, User, ShieldCheck, Sparkles, Loader2, AlertTriangle, Trash2 } from "lucide-react";

const statusOptions = [
  {
    value: "VACANT",
    label: "Vacant",
    description: "Bed is empty and ready",
    icon: <BedDouble className="h-5 w-5" />,
    color: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    activeColor: "ring-2 ring-emerald-500 border-emerald-500 bg-emerald-100 dark:bg-emerald-950/60",
  },
  {
    value: "OCCUPIED",
    label: "Occupied",
    description: "Patient admitted to bed",
    icon: <User className="h-5 w-5" />,
    color: "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
    activeColor: "ring-2 ring-rose-500 border-rose-500 bg-rose-100 dark:bg-rose-950/60",
  },
  {
    value: "RESERVED",
    label: "Reserved",
    description: "Reserved for incoming patient",
    icon: <ShieldCheck className="h-5 w-5" />,
    color: "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    activeColor: "ring-2 ring-amber-500 border-amber-500 bg-amber-100 dark:bg-amber-950/60",
  },
  {
    value: "NEEDS_CLEANING",
    label: "Needs Cleaning",
    description: "Awaiting housekeeping",
    icon: <Sparkles className="h-5 w-5" />,
    color: "border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
    activeColor: "ring-2 ring-violet-500 border-violet-500 bg-violet-100 dark:bg-violet-950/60",
  },
];

function BedStatusForm({ bed, onCancel, onStatusUpdated }) {
  const [bedNumber, setBedNumber] = useState(bed.bedNumber || "");
  const [bedType, setBedType] = useState(bed.bedType || "GENERAL");
  const [newStatus, setNewStatus] = useState(bed.status);
  const [patientId, setPatientId] = useState(bed.patientId || "");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  const loadPatients = async () => {
    setLoadingPatients(true);
    try {
      const result = await getAvailablePatients();
      if (result.success) {
        setPatients(result.data);
      }
    } catch (error) {
      console.error("Failed to load patients:", error);
    } finally {
      setLoadingPatients(false);
    }
  };

  const handleStatusChange = (val) => {
    setNewStatus(val);
    if (val === "OCCUPIED" && patients.length === 0) {
      loadPatients();
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (bed.status === "OCCUPIED") {
      (async () => {
        try {
          const result = await getAvailablePatients();
          if (isMounted && result.success) {
            setPatients(result.data);
          }
        } catch (err) {
          console.error("Failed to load patients:", err);
        }
      })();
    }
    return () => {
      isMounted = false;
    };
  }, [bed.status]);

  const handleDeleteBed = async () => {
    if (!confirm(`Are you sure you want to delete Bed ${bed.bedNumber}? This action cannot be undone.`)) return;
    setIsDeleting(true);
    try {
      const res = await deleteSingleBed(bed.id);
      if (res.success) {
        toast.success(res.message);
        onStatusUpdated();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to delete bed");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async () => {
    if (!bedNumber.trim()) {
      toast.error("Bed number cannot be empty");
      return;
    }

    if (
      bedNumber.trim() === bed.bedNumber &&
      bedType === bed.bedType &&
      newStatus === bed.status &&
      patientId === (bed.patientId || "") &&
      !notes
    ) {
      toast.info("No changes to save");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateBedStatus(bed.id, {
        bedNumber: bedNumber.trim(),
        bedType,
        status: newStatus,
        patientId: newStatus === "OCCUPIED" ? patientId : "",
        notes,
      });

      if (result.success) {
        toast.success(result.message);

        // Housekeeping alert
        if (result.needsCleaningAlert) {
          toast.warning(
            `🧹 Housekeeping Alert: Bed ${bedNumber} in ${bed.ward?.name || "ward"} needs cleaning!`,
            {
              duration: 8000,
              important: true,
            }
          );
        }

        onStatusUpdated();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update bed details");
      console.error("Update bed status error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl font-bold">
          <BedDouble className="h-5 w-5 text-primary" />
          Manage Bed {bed.bedNumber}
        </DialogTitle>
        <DialogDescription>
          {bed.ward?.name} • Floor {bed.ward?.floor}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-2">
        {/* Bed Identifier & Category Edit */}
        <div className="grid grid-cols-2 gap-3 pb-3 border-b border-border/40">
          <div className="space-y-1.5">
            <Label htmlFor="bed-number-input" className="text-xs font-bold">
              Bed Name / Identifier
            </Label>
            <Input
              id="bed-number-input"
              value={bedNumber}
              onChange={(e) => setBedNumber(e.target.value)}
              placeholder="e.g. A2"
              className="h-10 rounded-xl font-bold text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold">
              Bed Category
            </Label>
            <Select value={bedType} onValueChange={setBedType}>
              <SelectTrigger className="h-10 rounded-xl text-xs font-semibold">
                <SelectValue placeholder="Category">
                  {BED_TYPE_LABELS[bedType] || bedType}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(BED_TYPE_LABELS).map(([k, l]) => (
                  <SelectItem key={k} value={k} label={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Current Status */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground text-xs">Current Status:</span>
          <Badge variant="outline" className="font-semibold text-xs">{BED_STATUS_LABELS[bed.status]}</Badge>
        </div>

        {/* New Status Selection - Touch-friendly buttons */}
        <div className="space-y-2">
          <Label className="text-xs font-bold">New Status</Label>
          <div className="grid grid-cols-2 gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleStatusChange(option.value)}
                className={`
                  flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200
                  ${option.color}
                  ${newStatus === option.value ? option.activeColor : "opacity-70 hover:opacity-100"}
                `}
                id={`status-option-${option.value}`}
              >
                {option.icon}
                <div className="text-left">
                  <p className="text-xs font-bold">{option.label}</p>
                  <p className="text-[10px] opacity-80">{option.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Patient Selector (when Occupied) */}
        {newStatus === "OCCUPIED" && (
          <div className="space-y-2">
            <Label htmlFor="patient-select" className="text-xs font-bold">
              Assign Patient
            </Label>
            {loadingPatients ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 border rounded-xl">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading patients...
              </div>
            ) : (
              <Select value={patientId} onValueChange={setPatientId}>
                <SelectTrigger id="patient-select" className="h-10 rounded-xl text-xs font-medium">
                  <SelectValue placeholder="Select a patient (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No patient assigned</SelectItem>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id} label={`${p.firstName} ${p.lastName}`}>
                      {p.firstName} {p.lastName} — {p.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {/* Notes */}
        <div className="space-y-1.5">
          <Label htmlFor="bed-notes" className="text-xs font-bold">
            Notes (optional)
          </Label>
          <Textarea
            id="bed-notes"
            placeholder="Add any notes about this status change..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="resize-none rounded-xl text-xs"
          />
        </div>

        {/* Housekeeping warning */}
        {newStatus === "NEEDS_CLEANING" && newStatus !== bed.status && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800">
            <AlertTriangle className="h-4 w-4 text-violet-600 dark:text-violet-400 mt-0.5 shrink-0" />
            <p className="text-xs text-violet-700 dark:text-violet-300">
              A housekeeping alert will be triggered when this bed is marked as needing cleaning.
            </p>
          </div>
        )}
      </div>

      <DialogFooter className="flex flex-row items-center justify-between gap-2 pt-3 border-t border-border/40">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleDeleteBed}
          disabled={isSubmitting || isDeleting}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive h-10 rounded-xl gap-1.5 font-bold text-xs"
          id="delete-single-bed-btn"
        >
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Delete Bed
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting || isDeleting}
            className="h-10 rounded-xl font-bold text-xs"
            id="cancel-bed-update"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || isDeleting}
            className="h-10 rounded-xl font-bold text-xs gap-2"
            id="submit-bed-update"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}

export function BedStatusDialog({ bed, open, onOpenChange, onStatusUpdated }) {
  if (!bed) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <BedStatusForm
          key={bed.id}
          bed={bed}
          onCancel={() => onOpenChange(false)}
          onStatusUpdated={onStatusUpdated}
        />
      </DialogContent>
    </Dialog>
  );
}
