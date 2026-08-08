"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createPrescription } from "@/actions/prescriptions";
import { getMedicalRecords } from "@/actions/medical-records";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormSelect } from "@/components/shared/form-select";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

const itemSchema = z.object({
  medicineName: z.string().min(1, "Medicine name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  duration: z.string().min(1, "Duration is required"),
  instructions: z.string().optional().or(z.literal("")),
});

const schema = z.object({
  medicalRecordId: z.string().min(1, "Medical record is required"),
  instructions: z.string().optional().or(z.literal("")),
  items: z.array(itemSchema).min(1, "At least one medicine is required"),
});

export default function NewPrescriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedRecordId = searchParams.get("medicalRecordId");

  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);

  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      medicalRecordId: preSelectedRecordId || "",
      instructions: "",
      items: [{ medicineName: "", dosage: "", frequency: "", duration: "", instructions: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  useEffect(() => {
    getMedicalRecords({ limit: 100 }).then((res) => {
      if (res.success) setRecords(res.data);
    });
    if (preSelectedRecordId) setValue("medicalRecordId", preSelectedRecordId);
  }, [preSelectedRecordId, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await createPrescription(data);
    if (result.success) { toast.success(result.message); router.push("/prescriptions"); }
    else { toast.error(result.message); }
    setLoading(false);
  };

  return (
    <div>
      <PageHeader title="Create Prescription" description="Prescribe medicines for a patient" breadcrumbs={[{ label: "Prescriptions", href: "/prescriptions" }, { label: "Create" }]} />
      <Card className="max-w-3xl">
        <CardHeader><CardTitle>Prescription Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label>Medical Record <span className="text-destructive">*</span></Label>
              <FormSelect
                options={records.map(r => ({ value: r.id, label: `${r.patient.firstName} ${r.patient.lastName} - ${r.diagnosis || "No diagnosis"} (${format(new Date(r.createdAt), "MMM dd")})` }))}
                onValueChange={(val) => setValue("medicalRecordId", val)}
                placeholder="Select medical record"
              />
              {errors.medicalRecordId && <p className="text-sm text-destructive">{errors.medicalRecordId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">General Instructions</Label>
              <Textarea id="instructions" rows={2} placeholder="General prescription instructions" {...register("instructions")} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Medicines <span className="text-destructive">*</span></Label>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ medicineName: "", dosage: "", frequency: "", duration: "", instructions: "" })}>
                  <Plus className="mr-1 size-3" /> Add Medicine
                </Button>
              </div>

              {errors.items && <p className="text-sm text-destructive">{errors.items.message}</p>}

              {fields.map((field, index) => (
                <div key={field.id} className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Medicine {index + 1}</p>
                    {fields.length > 1 && (
                      <Button type="button" variant="ghost" size="icon-sm" onClick={() => remove(index)}>
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1"><Label className="text-xs">Medicine Name</Label><Input placeholder="e.g., Amoxicillin" {...register(`items.${index}.medicineName`)} />{errors.items?.[index]?.medicineName && <p className="text-xs text-destructive">{errors.items[index].medicineName.message}</p>}</div>
                    <div className="space-y-1"><Label className="text-xs">Dosage</Label><Input placeholder="e.g., 500mg" {...register(`items.${index}.dosage`)} />{errors.items?.[index]?.dosage && <p className="text-xs text-destructive">{errors.items[index].dosage.message}</p>}</div>
                    <div className="space-y-1"><Label className="text-xs">Frequency</Label><Input placeholder="e.g., 3 times a day" {...register(`items.${index}.frequency`)} />{errors.items?.[index]?.frequency && <p className="text-xs text-destructive">{errors.items[index].frequency.message}</p>}</div>
                    <div className="space-y-1"><Label className="text-xs">Duration</Label><Input placeholder="e.g., 7 days" {...register(`items.${index}.duration`)} />{errors.items?.[index]?.duration && <p className="text-xs text-destructive">{errors.items[index].duration.message}</p>}</div>
                  </div>
                  <div className="space-y-1"><Label className="text-xs">Instructions</Label><Input placeholder="e.g., Take after meals" {...register(`items.${index}.instructions`)} /></div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>{loading && <Loader2 className="mr-2 size-4 animate-spin" />}Create Prescription</Button>
              <Button type="button" variant="outline" onClick={() => router.push("/prescriptions")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
