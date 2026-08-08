"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createMedicalRecord } from "@/actions/medical-records";
import { getAllDoctors } from "@/actions/doctors";
import { getAllPatients } from "@/actions/patients";
import { getAppointments } from "@/actions/appointments";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormSelect } from "@/components/shared/form-select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

const schema = z.object({
  appointmentId: z.string().min(1, "Appointment is required"),
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  diagnosis: z.string().min(2, "Diagnosis is required"),
  symptoms: z.string().min(2, "Symptoms are required"),
  treatment: z.string().min(2, "Treatment is required"),
  allergies: z.string().optional().or(z.literal("")),
  doctorNotes: z.string().optional().or(z.literal("")),
  followUpDate: z.string().optional().or(z.literal("")),
});

export default function NewMedicalRecordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { appointmentId: "", patientId: "", doctorId: "", diagnosis: "", symptoms: "", treatment: "", allergies: "", doctorNotes: "", followUpDate: "" },
  });

  useEffect(() => {
    Promise.all([getAllDoctors(), getAllPatients(), getAppointments({ status: "COMPLETED", limit: 100 })]).then(([d, p, a]) => {
      if (d.success) setDoctors(d.data);
      if (p.success) setPatients(p.data);
      if (a.success) setAppointments(a.data);
    });
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await createMedicalRecord(data);
    if (result.success) { toast.success(result.message); router.push("/medical-records"); }
    else { toast.error(result.message); }
    setLoading(false);
  };

  return (
    <div>
      <PageHeader title="Create Medical Record" description="Record consultation details" breadcrumbs={[{ label: "Medical Records", href: "/medical-records" }, { label: "Create" }]} />
      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Clinical Information</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Patient <span className="text-destructive">*</span></Label>
                <FormSelect options={patients.map(p => ({ value: p.id, label: `${p.firstName} ${p.lastName}` }))} onValueChange={(val) => setValue("patientId", val)} placeholder="Select patient" />
                {errors.patientId && <p className="text-sm text-destructive">{errors.patientId.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Doctor <span className="text-destructive">*</span></Label>
                <FormSelect options={doctors.map(d => ({ value: d.id, label: `Dr. ${d.user.firstName} ${d.user.lastName}` }))} onValueChange={(val) => setValue("doctorId", val)} placeholder="Select doctor" />
                {errors.doctorId && <p className="text-sm text-destructive">{errors.doctorId.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Appointment <span className="text-destructive">*</span></Label>
              <FormSelect options={appointments.map(a => ({ value: a.id, label: `${a.patient.firstName} ${a.patient.lastName} - Dr. ${a.doctor.user.firstName} (${format(new Date(a.appointmentDate), "MMM dd")})` }))} onValueChange={(val) => setValue("appointmentId", val)} placeholder="Select appointment" />
              {errors.appointmentId && <p className="text-sm text-destructive">{errors.appointmentId.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms <span className="text-destructive">*</span></Label>
                <Textarea id="symptoms" rows={2} placeholder="Patient symptoms" {...register("symptoms")} />
                {errors.symptoms && <p className="text-sm text-destructive">{errors.symptoms.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis <span className="text-destructive">*</span></Label>
                <Textarea id="diagnosis" rows={2} placeholder="Diagnosis" {...register("diagnosis")} />
                {errors.diagnosis && <p className="text-sm text-destructive">{errors.diagnosis.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatment">Treatment Plan <span className="text-destructive">*</span></Label>
                <Textarea id="treatment" rows={2} placeholder="Treatment plan" {...register("treatment")} />
              {errors.treatment && <p className="text-sm text-destructive">{errors.treatment.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Input id="allergies" placeholder="Known allergies" {...register("allergies")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="followUpDate">Follow-up Date</Label>
                <Input id="followUpDate" type="date" {...register("followUpDate")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctorNotes">Doctor Notes</Label>
              <Textarea id="doctorNotes" rows={2} placeholder="Additional notes" {...register("doctorNotes")} />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>{loading && <Loader2 className="mr-2 size-4 animate-spin" />}Create Record</Button>
              <Button type="button" variant="outline" onClick={() => router.push("/medical-records")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
