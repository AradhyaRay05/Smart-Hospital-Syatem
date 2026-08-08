"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getDoctorById } from "@/actions/doctors";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, Loader2, Phone, Mail, Clock, Award, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function DoctorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoctorById(params.id).then((result) => {
      if (result.success) {
        setDoctor(result.data);
      } else {
        toast.error(result.message);
        router.push("/doctors");
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

  if (!doctor) return null;

  const initials = `${doctor.user.firstName?.[0] || ""}${doctor.user.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div>
      <PageHeader
        title={`Dr. ${doctor.user.firstName} ${doctor.user.lastName}`}
        description={doctor.specialization}
        breadcrumbs={[
          { label: "Doctors", href: "/doctors" },
          { label: `Dr. ${doctor.user.firstName} ${doctor.user.lastName}` },
        ]}
      >
        <Link href={`/doctors/${doctor.id}/edit`}>
          <Button><Pencil className="mr-2 size-4" />Edit</Button>
        </Link>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Avatar className="size-20 mb-4">
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">Dr. {doctor.user.firstName} {doctor.user.lastName}</h2>
            <p className="text-muted-foreground">{doctor.specialization}</p>
            <Badge className="mt-2" variant={doctor.available ? "default" : "secondary"}>
              {doctor.available ? "Available" : "Unavailable"}
            </Badge>

            <Separator className="my-4" />

            <div className="w-full space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="size-4 text-muted-foreground" />
                <span>{doctor.user.email}</span>
              </div>
              {doctor.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="size-4 text-muted-foreground" />
                  <span>{doctor.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Award className="size-4 text-muted-foreground" />
                <span>{doctor.department.name}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <GraduationCap className="size-4 text-muted-foreground" />
                <span>{doctor.qualification}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="size-4 text-muted-foreground" />
                <span>{doctor.experience} years experience</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{doctor._count.appointments}</p>
                <p className="text-sm text-muted-foreground">Appointments</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{doctor._count.medicalRecords}</p>
                <p className="text-sm text-muted-foreground">Medical Records</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{doctor._count.prescriptions}</p>
                <p className="text-sm text-muted-foreground">Prescriptions</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {doctor.appointments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No appointments yet.</p>
              ) : (
                <div className="space-y-3">
                  {doctor.appointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">{apt.patient.firstName} {apt.patient.lastName}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(apt.appointmentDate), "MMM dd, yyyy")} at {apt.appointmentTime}
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
