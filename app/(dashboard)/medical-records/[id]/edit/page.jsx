"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getMedicalRecordById, updateMedicalRecord } from "@/actions/medical-records";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

const schema = z.object({
  diagnosis: z.string().min(2, "Diagnosis is required"),
  symptoms: z.string().min(2, "Symptoms are required"),
  treatment: z.string().min(2, "Treatment is required"),
  allergies: z.string().optional().or(z.literal("")),
  doctorNotes: z.string().optional().or(z.literal("")),
  followUpDate: z.string().optional().or(z.literal("")),
});

export default function EditMedicalRecordPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    getMedicalRecordById(params.id).then((result) => {
      if (result.success) {
        const r = result.data;
        reset({
          diagnosis: r.diagnosis || "",
          symptoms: r.symptoms || "",
          treatment: r.treatment || "",
          allergies: r.allergies || "",
          doctorNotes: r.doctorNotes || "",
          followUpDate: r.followUpDate ? format(new Date(r.followUpDate), "yyyy-MM-dd") : "",
        });
      } else { toast.error(result.message); router.push("/medical-records"); }
      setFetching(false);
    });
  }, [params.id, reset, router]);

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await updateMedicalRecord(params.id, data);
    if (result.success) { toast.success(result.message); router.push(`/medical-records/${params.id}`); }
    else { toast.error(result.message); }
    setLoading(false);
  };

  if (fetching) return <div className="flex items-center justify-center py-20"><Loader2 className="size-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <PageHeader title="Edit Medical Record" description="Update clinical information" breadcrumbs={[{ label: "Medical Records", href: "/medical-records" }, { label: "Edit" }]} />
      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Clinical Information</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="symptoms">Symptoms <span className="text-destructive">*</span></Label><Textarea id="symptoms" rows={2} {...register("symptoms")} />{errors.symptoms && <p className="text-sm text-destructive">{errors.symptoms.message}</p>}</div>
              <div className="space-y-2"><Label htmlFor="diagnosis">Diagnosis <span className="text-destructive">*</span></Label><Textarea id="diagnosis" rows={2} {...register("diagnosis")} />{errors.diagnosis && <p className="text-sm text-destructive">{errors.diagnosis.message}</p>}</div>
            </div>
            <div className="space-y-2"><Label htmlFor="treatment">Treatment <span className="text-destructive">*</span></Label><Textarea id="treatment" rows={2} {...register("treatment")} />{errors.treatment && <p className="text-sm text-destructive">{errors.treatment.message}</p>}</div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="allergies">Allergies</Label><Input id="allergies" {...register("allergies")} /></div>
              <div className="space-y-2"><Label htmlFor="followUpDate">Follow-up Date</Label><Input id="followUpDate" type="date" {...register("followUpDate")} /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="doctorNotes">Doctor Notes</Label><Textarea id="doctorNotes" rows={2} {...register("doctorNotes")} /></div>
            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>{loading && <Loader2 className="mr-2 size-4 animate-spin" />}Update Record</Button>
              <Button type="button" variant="outline" onClick={() => router.push(`/medical-records/${params.id}`)}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
