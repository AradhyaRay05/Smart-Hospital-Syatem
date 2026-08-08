"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBill } from "@/actions/billing";
import { getAllPatients } from "@/actions/patients";
import { getAppointments } from "@/actions/appointments";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormSelect } from "@/components/shared/form-select";
import { toast } from "sonner";
import { Loader2, DollarSign } from "lucide-react";

const schema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  appointmentId: z.string().min(1, "Appointment is required"),
  consultationFee: z.coerce.number().min(0, "Fee must be 0 or more"),
  additionalCharges: z.coerce.number().min(0).default(0),
  discount: z.coerce.number().min(0).default(0),
  paymentMethod: z.string().optional().or(z.literal("")),
});

export default function NewBillPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { patientId: "", appointmentId: "", consultationFee: 0, additionalCharges: 0, discount: 0, paymentMethod: "" },
  });

  const consultationFee = watch("consultationFee") || 0;
  const additionalCharges = watch("additionalCharges") || 0;
  const discount = watch("discount") || 0;
  const total = parseFloat(consultationFee) + parseFloat(additionalCharges) - parseFloat(discount);

  useEffect(() => {
    Promise.all([getAllPatients(), getAppointments({ status: "COMPLETED", limit: 100 })]).then(([p, a]) => {
      if (p.success) setPatients(p.data);
      if (a.success) setAppointments(a.data);
    });
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await createBill(data);
    if (result.success) { toast.success(result.message); router.push("/billing"); }
    else { toast.error(result.message); }
    setLoading(false);
  };

  return (
    <div>
      <PageHeader title="Generate Bill" description="Create an invoice for a consultation" breadcrumbs={[{ label: "Billing", href: "/billing" }, { label: "Generate" }]} />
      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Invoice Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Patient <span className="text-destructive">*</span></Label>
                <FormSelect options={patients.map(p => ({ value: p.id, label: `${p.firstName} ${p.lastName}` }))} onValueChange={(val) => setValue("patientId", val)} placeholder="Select patient" />
                {errors.patientId && <p className="text-sm text-destructive">{errors.patientId.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Appointment <span className="text-destructive">*</span></Label>
                <FormSelect options={appointments.map(a => ({ value: a.id, label: `${a.patient.firstName} - Dr. ${a.doctor.user.firstName}` }))} onValueChange={(val) => setValue("appointmentId", val)} placeholder="Select appointment" />
                {errors.appointmentId && <p className="text-sm text-destructive">{errors.appointmentId.message}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="consultationFee">Consultation Fee ($) <span className="text-destructive">*</span></Label>
                <Input id="consultationFee" type="number" min="0" step="0.01" {...register("consultationFee")} />
                {errors.consultationFee && <p className="text-sm text-destructive">{errors.consultationFee.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalCharges">Additional Charges ($)</Label>
                <Input id="additionalCharges" type="number" min="0" step="0.01" {...register("additionalCharges")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount ($)</Label>
                <Input id="discount" type="number" min="0" step="0.01" {...register("discount")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <FormSelect
                options={[{ value: "CASH", label: "Cash" }, { value: "CARD", label: "Card" }, { value: "UPI", label: "UPI" }]}
                onValueChange={(val) => setValue("paymentMethod", val)}
                placeholder="Select method (optional)"
              />
            </div>

            <div className="rounded-lg bg-muted p-4 flex items-center justify-between">
              <span className="text-lg font-medium">Total Amount</span>
              <span className="text-2xl font-bold flex items-center gap-1"><DollarSign className="size-5" />{total.toFixed(2)}</span>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>{loading && <Loader2 className="mr-2 size-4 animate-spin" />}Generate Bill</Button>
              <Button type="button" variant="outline" onClick={() => router.push("/billing")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
