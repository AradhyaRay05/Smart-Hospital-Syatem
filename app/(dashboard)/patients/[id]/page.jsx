"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getPatientById } from "@/actions/patients";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, Loader2, Phone, Mail, MapPin, AlertCircle, Calendar, FileText, Receipt, ArrowLeft, CalendarDays, IndianRupee } from "lucide-react";
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
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 animate-in fade-in">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading patient file...</p>
      </div>
    );
  }

  if (!patient) return null;

  const initials = `${patient.firstName?.[0] || ""}${patient.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-start gap-4 mb-2">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted mt-1" onClick={() => router.push("/patients")}>
          <ArrowLeft className="size-5" />
        </Button>
        <div className="flex-1">
          <PageHeader
            title={`${patient.firstName} ${patient.lastName}`}
            description={`Patient ID: ${patient.id.slice(0, 8).toUpperCase()}`}
            breadcrumbs={[
              { label: "Patients", href: "/patients" },
              { label: "Profile" },
            ]}
            className="m-0 p-0"
          >
            <Link href={`/patients/${patient.id}/edit`}>
              <Button className="gradient-primary rounded-xl shadow-md hover:shadow-lg transition-all font-bold px-6">
                <Pencil className="mr-2 size-4" /> Edit Profile
              </Button>
            </Link>
          </PageHeader>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        {/* Left Column - Profile Card */}
        <Card className="shadow-soft border-border/40 bg-card rounded-3xl overflow-hidden relative">
          <div className="h-28 bg-gradient-to-r from-primary/20 via-accent/10 to-transparent absolute top-0 left-0 w-full" />
          <CardContent className="flex flex-col items-center p-6 pt-12 text-center relative z-10">
            <Avatar className="size-24 mb-5 border-4 border-card shadow-lg ring-1 ring-border/50">
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-3xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{patient.firstName} {patient.lastName}</h2>
            
            <div className="flex gap-2 mt-3">
              <Badge variant="outline" className="font-bold px-3 py-1 shadow-sm bg-background">
                {patient.gender}
              </Badge>
              {patient.bloodGroup && (
                <Badge className="font-bold px-3 py-1 shadow-none border-0 bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400">
                  <AlertCircle className="size-3.5 mr-1.5" /> {patient.bloodGroup}
                </Badge>
              )}
            </div>

            <div className="w-full space-y-4 text-left mt-8 bg-muted/30 p-5 rounded-2xl border border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-background rounded-lg shadow-sm text-muted-foreground"><Mail className="size-4" /></div>
                <span className="font-semibold text-sm truncate">{patient.user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-background rounded-lg shadow-sm text-muted-foreground"><Phone className="size-4" /></div>
                <span className="font-semibold text-sm">{patient.phone}</span>
              </div>
              {patient.address && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded-lg shadow-sm text-muted-foreground"><MapPin className="size-4" /></div>
                  <span className="font-semibold text-sm line-clamp-2">{patient.address}</span>
                </div>
              )}
              {patient.emergencyContact && (
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/60">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg shadow-sm text-red-600 dark:text-red-400"><Phone className="size-4" /></div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Emergency</span>
                    <span className="font-bold text-sm text-foreground">{patient.emergencyContact}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Stats & History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="shadow-sm border-border/40 rounded-3xl overflow-hidden bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/50">
              <CardContent className="p-5 flex flex-col items-center text-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl mb-3"><Calendar className="size-5 text-blue-600 dark:text-blue-400" /></div>
                <p className="text-3xl font-black text-blue-700 dark:text-blue-400">{patient._count.appointments}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600/70 dark:text-blue-400/70 mt-1">Appointments</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-border/40 rounded-3xl overflow-hidden bg-teal-50/50 dark:bg-teal-900/10 border-teal-100 dark:border-teal-900/50">
              <CardContent className="p-5 flex flex-col items-center text-center">
                <div className="p-2 bg-teal-100 dark:bg-teal-900/50 rounded-xl mb-3"><FileText className="size-5 text-teal-600 dark:text-teal-400" /></div>
                <p className="text-3xl font-black text-teal-700 dark:text-teal-400">{patient._count.medicalRecords}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-teal-600/70 dark:text-teal-400/70 mt-1">Medical Records</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-border/40 rounded-3xl overflow-hidden bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/50">
              <CardContent className="p-5 flex flex-col items-center text-center">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-xl mb-3"><IndianRupee className="size-5 text-amber-600 dark:text-amber-400" /></div>
                <p className="text-3xl font-black text-amber-700 dark:text-amber-400">{patient._count.bills}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600/70 dark:text-amber-400/70 mt-1">Invoices</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-soft border-border/40 rounded-3xl overflow-hidden h-full">
            <CardHeader className="bg-muted/20 border-b border-border/30 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <CalendarDays className="size-5 text-primary" /> Encounter History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {patient.appointments.length === 0 ? (
                <div className="text-center py-10 px-4 border-2 border-dashed border-border/60 rounded-2xl bg-muted/20">
                  <p className="text-sm font-bold text-muted-foreground">No appointments booked yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {patient.appointments.map((apt) => (
                    <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/50 bg-background p-4 transition-all hover:shadow-md hover:border-primary/30">
                      <div>
                        <p className="font-bold text-foreground text-lg">Dr. {apt.doctor.user.firstName} {apt.doctor.user.lastName}</p>
                        <p className="text-sm font-medium text-muted-foreground mt-0.5">
                          <span className="font-semibold text-primary">{apt.doctor.department.name}</span> <span className="mx-1">•</span> {format(new Date(apt.appointmentDate), "MMM dd, yyyy")} at {apt.appointmentTime}
                        </p>
                      </div>
                      <Badge className={`px-3 py-1 font-bold text-xs shadow-none border-0 w-fit ${
                        apt.status === "SCHEDULED" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400" :
                        apt.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" :
                        "bg-muted text-muted-foreground"
                      }`}>
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