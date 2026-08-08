"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getPrescriptionById } from "@/actions/prescriptions";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2, Printer } from "lucide-react";

export default function PrescriptionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPrescriptionById(params.id).then((result) => {
      if (result.success) setPrescription(result.data);
      else { toast.error(result.message); router.push("/prescriptions"); }
      setLoading(false);
    });
  }, [params.id]);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  if (!prescription) return null;

  const patient = prescription.medicalRecord?.patient;
  const doctor = prescription.doctor;

  return (
    <div>
      <PageHeader title="Prescription Details" description={`Prescribed on ${format(new Date(prescription.createdAt), "MMMM dd, yyyy")}`} breadcrumbs={[{ label: "Prescriptions", href: "/prescriptions" }, { label: "Details" }]}>
        <Button onClick={() => window.print()}><Printer className="mr-2 size-4" />Print</Button>
      </PageHeader>

      <Card className="max-w-3xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Prescription</CardTitle>
              <p className="text-sm text-muted-foreground">Date: {format(new Date(prescription.createdAt), "MMMM dd, yyyy")}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">Dr. {doctor.user.firstName} {doctor.user.lastName}</p>
              <p className="text-sm text-muted-foreground">{doctor.department?.name}</p>
              {doctor.qualification && <p className="text-xs text-muted-foreground">{doctor.qualification}</p>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">Patient</p>
            <p className="font-medium">{patient?.firstName} {patient?.lastName}</p>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium mb-3">Medicines</p>
            <div className="rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left font-medium">#</th>
                    <th className="p-2 text-left font-medium">Medicine</th>
                    <th className="p-2 text-left font-medium">Dosage</th>
                    <th className="p-2 text-left font-medium">Frequency</th>
                    <th className="p-2 text-left font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {prescription.items.map((item, idx) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="p-2">{idx + 1}</td>
                      <td className="p-2 font-medium">{item.medicineName}</td>
                      <td className="p-2">{item.dosage}</td>
                      <td className="p-2">{item.frequency}</td>
                      <td className="p-2">{item.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {prescription.items.some(i => i.instructions) && (
            <div>
              <p className="text-sm font-medium mb-2">Special Instructions</p>
              {prescription.items.filter(i => i.instructions).map((item) => (
                <p key={item.id} className="text-sm"><span className="font-medium">{item.medicineName}:</span> {item.instructions}</p>
              ))}
            </div>
          )}

          {prescription.instructions && (
            <><Separator /><div><p className="text-sm font-medium mb-1">General Instructions</p><p className="text-sm">{prescription.instructions}</p></div></>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
