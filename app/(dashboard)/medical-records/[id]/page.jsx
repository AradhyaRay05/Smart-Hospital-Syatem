"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getMedicalRecordById } from "@/actions/medical-records";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2, Pencil, Plus, Pill, AlertCircle } from "lucide-react";

export default function MedicalRecordDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMedicalRecordById(params.id).then((result) => {
      if (result.success) setRecord(result.data);
      else { toast.error(result.message); router.push("/medical-records"); }
      setLoading(false);
    });
  }, [params.id]);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  if (!record) return null;

  return (
    <div>
      <PageHeader
        title="Medical Record"
        description={`${record.patient.firstName} ${record.patient.lastName} - ${format(new Date(record.createdAt), "MMMM dd, yyyy")}`}
        breadcrumbs={[{ label: "Medical Records", href: "/medical-records" }, { label: "Details" }]}
      >
        <div className="flex gap-2">
          <Link href={`/medical-records/${record.id}/edit`}><Button variant="outline"><Pencil className="mr-2 size-4" />Edit</Button></Link>
          <Link href={`/prescriptions/new?medicalRecordId=${record.id}`}><Button><Plus className="mr-2 size-4" />Add Prescription</Button></Link>
        </div>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-base">Visit Info</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div><p className="text-sm text-muted-foreground">Patient</p><p className="font-medium">{record.patient.firstName} {record.patient.lastName}</p></div>
            <Separator />
            <div><p className="text-sm text-muted-foreground">Doctor</p><p className="font-medium">Dr. {record.doctor.user.firstName} {record.doctor.user.lastName}</p><p className="text-xs text-muted-foreground">{record.doctor.department.name}</p></div>
            <Separator />
            <div><p className="text-sm text-muted-foreground">Date</p><p className="font-medium">{format(new Date(record.createdAt), "MMMM dd, yyyy")}</p></div>
            {record.followUpDate && (
              <><Separator /><div><p className="text-sm text-muted-foreground">Follow-up</p><p className="font-medium">{format(new Date(record.followUpDate), "MMMM dd, yyyy")}</p></div></>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Clinical Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-sm font-medium text-muted-foreground">Symptoms</p><p>{record.symptoms}</p></div>
              <Separator />
              <div><p className="text-sm font-medium text-muted-foreground">Diagnosis</p><p>{record.diagnosis}</p></div>
              <Separator />
              <div><p className="text-sm font-medium text-muted-foreground">Treatment</p><p>{record.treatment}</p></div>
              {record.allergies && (
                <><Separator /><div className="flex items-start gap-2"><AlertCircle className="mt-0.5 size-4 text-destructive" /><div><p className="text-sm font-medium text-destructive">Allergies</p><p>{record.allergies}</p></div></div></>
              )}
              {record.doctorNotes && (
                <><Separator /><div><p className="text-sm font-medium text-muted-foreground">Doctor Notes</p><p>{record.doctorNotes}</p></div></>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Prescriptions</CardTitle>
                <Link href={`/prescriptions/new?medicalRecordId=${record.id}`}><Button size="sm"><Plus className="mr-1 size-3" />Add</Button></Link>
              </div>
            </CardHeader>
            <CardContent>
              {record.prescriptions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No prescriptions yet.</p>
              ) : (
                <div className="space-y-3">
                  {record.prescriptions.map((rx) => (
                    <div key={rx.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2"><Pill className="size-4 text-primary" /><span className="font-medium">Prescription</span></div>
                        <Badge variant="secondary">{format(new Date(rx.createdAt), "MMM dd, yyyy")}</Badge>
                      </div>
                      {rx.instructions && <p className="text-sm text-muted-foreground mb-2">{rx.instructions}</p>}
                      <div className="space-y-1">
                        {rx.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-sm">
                            <span className="font-medium">{item.medicineName}</span>
                            <span className="text-muted-foreground">{item.dosage} &bull; {item.frequency} &bull; {item.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
