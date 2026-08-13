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
import { Loader2, Printer, Pill, Stethoscope, UserRound, ArrowLeft, CalendarDays, ClipboardList } from "lucide-react";

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

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 animate-in fade-in">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading prescription data...</p>
      </div>
    );
  }
  
  if (!prescription) return null;

  const patient = prescription.medicalRecord?.patient;
  const doctor = prescription.doctor;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto space-y-6 print:m-0 print:space-y-0 print:p-0">
      <div className="flex items-center gap-4 mb-2 print:hidden">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" onClick={() => router.back()}>
          <ArrowLeft className="size-5" />
        </Button>
        <PageHeader 
          title="Prescription Details" 
          description={`RX-${prescription.id.slice(0, 8).toUpperCase()}`} 
          breadcrumbs={[{ label: "Prescriptions", href: "/prescriptions" }, { label: "Details" }]}
          className="m-0 p-0 w-full"
        >
          <Button onClick={() => window.print()} className="rounded-xl shadow-md bg-white text-foreground border border-border/50 hover:bg-muted font-bold transition-all hover:-translate-y-0.5">
            <Printer className="mr-2 size-4 text-primary" /> Print Prescription
          </Button>
        </PageHeader>
      </div>

      <Card className="shadow-soft border-border/40 bg-card rounded-3xl overflow-hidden print:shadow-none print:border-0 print:rounded-none">
        {/* Prescription Header (Rx Style) */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 border-b border-primary/10 print:bg-transparent print:border-b-2 print:border-black">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary p-4 rounded-2xl shadow-lg shadow-primary/20 text-white font-serif text-3xl font-black italic flex items-center justify-center h-16 w-16 print:bg-transparent print:text-black print:shadow-none print:border-2 print:border-black print:p-0">
                Rx
              </div>
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Official Prescription</h2>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mt-1">
                  <CalendarDays className="size-4" /> {format(new Date(prescription.createdAt), "MMMM dd, yyyy")}
                </p>
              </div>
            </div>
            
            <div className="text-left md:text-right bg-white/60 dark:bg-slate-900/60 p-4 rounded-2xl border border-white/40 dark:border-slate-800 backdrop-blur-sm print:border-0 print:bg-transparent print:p-0">
              <p className="font-extrabold text-lg text-primary print:text-black flex items-center md:justify-end gap-2">
                <Stethoscope className="size-4 hidden md:block" /> Dr. {doctor.user.firstName} {doctor.user.lastName}
              </p>
              <p className="text-sm font-bold text-foreground mt-0.5">{doctor.department?.name}</p>
              {doctor.qualification && <p className="text-xs font-semibold text-muted-foreground mt-0.5">{doctor.qualification}</p>}
            </div>
          </div>
        </div>

        <CardContent className="p-8 space-y-8">
          {/* Patient Info Block */}
          <div className="rounded-2xl border border-border/50 bg-muted/20 p-5 flex items-start gap-4 print:border-0 print:bg-transparent print:p-0">
            <div className="p-2 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 rounded-lg print:hidden">
              <UserRound className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Prescribed For</p>
              <p className="text-lg font-extrabold text-foreground">{patient?.firstName} {patient?.lastName}</p>
              <p className="text-sm font-medium text-muted-foreground mt-0.5">Patient ID: {patient?.id.slice(0,8).toUpperCase()}</p>
            </div>
          </div>

          <Separator className="print:bg-black" />

          {/* Medicines Table */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold print:text-black">
              <Pill className="size-5" /> Prescribed Medications
            </div>
            <div className="rounded-2xl border border-border/50 overflow-hidden print:border-black">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/40 print:bg-transparent print:border-black">
                    <th className="p-4 text-left font-bold text-muted-foreground uppercase tracking-wider text-xs">#</th>
                    <th className="p-4 text-left font-bold text-muted-foreground uppercase tracking-wider text-xs">Medicine</th>
                    <th className="p-4 text-left font-bold text-muted-foreground uppercase tracking-wider text-xs">Dosage</th>
                    <th className="p-4 text-left font-bold text-muted-foreground uppercase tracking-wider text-xs">Frequency</th>
                    <th className="p-4 text-left font-bold text-muted-foreground uppercase tracking-wider text-xs">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 print:divide-black/20">
                  {prescription.items.map((item, idx) => (
                    <tr key={item.id} className="bg-background hover:bg-muted/10 transition-colors print:bg-transparent">
                      <td className="p-4 font-semibold text-muted-foreground">{idx + 1}</td>
                      <td className="p-4 font-extrabold text-foreground">{item.medicineName}</td>
                      <td className="p-4 font-semibold">{item.dosage}</td>
                      <td className="p-4 font-semibold">{item.frequency}</td>
                      <td className="p-4 font-semibold text-primary print:text-black">{item.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Instructions Blocks */}
          <div className="grid gap-6 md:grid-cols-2 pt-4">
            {prescription.items.some(i => i.instructions) && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-bold text-foreground print:text-black">
                  <ClipboardList className="size-4 text-amber-500" /> Specific Instructions
                </div>
                <div className="space-y-2">
                  {prescription.items.filter(i => i.instructions).map((item) => (
                    <div key={item.id} className="bg-amber-50/50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100 dark:border-amber-900/50 print:border-0 print:bg-transparent print:p-0">
                      <p className="text-sm font-medium"><span className="font-extrabold text-amber-900 dark:text-amber-200">{item.medicineName}:</span> {item.instructions}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {prescription.instructions && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-bold text-foreground print:text-black">
                  <ClipboardList className="size-4 text-blue-500" /> General Advice
                </div>
                <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 print:border-0 print:bg-transparent print:p-0">
                  <p className="text-sm font-medium leading-relaxed">{prescription.instructions}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="hidden print:block pt-20 text-right">
            <div className="inline-block border-t-2 border-black pt-2 w-48 text-center">
              <p className="font-bold">Doctor's Signature</p>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}