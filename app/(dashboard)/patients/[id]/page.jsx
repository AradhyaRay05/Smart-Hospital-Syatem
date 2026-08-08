"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getPatientById } from "@/actions/patients";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, Loader2, Phone, Mail, MapPin, AlertCircle, Calendar, FileText, Receipt } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function PatientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatientById(params.id).then((result) => {
      if (result.success) {
        setPatient(result.data);
      } else {
        toast.error(result.message);
        router.push("/patients");
      }
      setLoading(false);
    });
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!patient) return null;

  const initials = `${patient.firstName?.[0] || ""}${patient.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div>
      <PageHeader
        title={`${patient.firstName} ${patient.lastName}`}
        description={`Patient ID: ${patient.id.slice(0, 8)}...`}
        breadcrumbs={[
          { label: "Patients", href: "/patients" },
          { label: `${patient.firstName} ${patient.lastName}` },
        ]}
      >
        <Link href={`/patients/${patient.id}/edit`}>
          <Button><Pencil className="mr-2 size-4" />Edit</Button>
        </Link>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Avatar className="size-20 mb-4">
              <AvatarFallback className="bg-primary/10 text-primary text-xl">{initials}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{patient.firstName} {patient.lastName}</h2>
            <Badge className="mt-1">{patient.gender}</Badge>

            <Separator className="my-4" />

            <div className="w-full space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="size-4 text-muted-foreground" />
                <span>{patient.user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="size-4 text-muted-foreground" />
                <span>{patient.phone}</span>
              </div>
              {patient.bloodGroup && (
                <div className="flex items-center gap-3 text-sm">
                  <AlertCircle className="size-4 text-muted-foreground" />
                  <span>Blood Group: {patient.bloodGroup}</span>
                </div>
              )}
              {patient.address && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span>{patient.address}</span>
                </div>
              )}
              {patient.emergencyContact && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="size-4 text-destructive" />
                  <span>Emergency: {patient.emergencyContact}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="mx-auto mb-2 size-5 text-primary" />
                <p className="text-2xl font-bold">{patient._count.appointments}</p>
                <p className="text-sm text-muted-foreground">Appointments</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="mx-auto mb-2 size-5 text-primary" />
                <p className="text-2xl font-bold">{patient._count.medicalRecords}</p>
                <p className="text-sm text-muted-foreground">Records</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Receipt className="mx-auto mb-2 size-5 text-primary" />
                <p className="text-2xl font-bold">{patient._count.bills}</p>
                <p className="text-sm text-muted-foreground">Bills</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {patient.appointments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No appointments yet.</p>
              ) : (
                <div className="space-y-3">
                  {patient.appointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">Dr. {apt.doctor.user.firstName} {apt.doctor.user.lastName}</p>
                        <p className="text-xs text-muted-foreground">
                          {apt.doctor.department.name} &bull; {format(new Date(apt.appointmentDate), "MMM dd, yyyy")} at {apt.appointmentTime}
                        </p>
                      </div>
                      <Badge variant={apt.status === "SCHEDULED" ? "default" : apt.status === "COMPLETED" ? "default" : "secondary"}>
                        {apt.status}
                      </Badge>
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
