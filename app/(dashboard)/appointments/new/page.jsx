"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createAppointment } from "@/actions/appointments";
import { getAllDoctors } from "@/actions/doctors";
import { getAllPatients } from "@/actions/patients";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FormSelect } from "@/components/shared/form-select";
import { useRole } from "@/hooks/use-role";
import { toast } from "sonner";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  Stethoscope,
  UserRound,
} from "lucide-react";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
];

const STEPS = [
  { id: 1, title: "Patient", icon: UserRound },
  { id: 2, title: "Doctor", icon: Stethoscope },
  { id: 3, title: "Schedule", icon: CalendarDays },
];

function formatSlot(time) {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

export default function NewAppointmentPage() {
  const router = useRouter();
  const { role, user } = useRole();
  const isPatient = role === "PATIENT";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [deptFilter, setDeptFilter] = useState("all");

  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    async function load() {
      const [docRes, patRes] = await Promise.all([getAllDoctors(), getAllPatients()]);
      if (docRes.success) setDoctors(docRes.data || []);
      if (patRes.success) setPatients(patRes.data || []);

      if (isPatient && user?.patient?.id) {
        setForm((prev) => ({ ...prev, patientId: user.patient.id }));
      }
    }
    load();
  }, [isPatient, user]);

  const departments = useMemo(() => {
    const map = new Map();
    doctors.forEach((d) => {
      if (d.department?.id) map.set(d.department.id, d.department.name);
    });
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    if (deptFilter === "all") return doctors;
    return doctors.filter((d) => d.departmentId === deptFilter || d.department?.id === deptFilter);
  }, [doctors, deptFilter]);

  const selectedPatient = patients.find((p) => p.id === form.patientId);
  const selectedDoctor = doctors.find((d) => d.id === form.doctorId);

  const availableDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d.toISOString().split("T")[0];
    });
  }, []);

  const validateStep = (current) => {
    const next = {};
    if (current === 1 && !isPatient && !form.patientId) next.patientId = "Select a patient";
    if (current === 2 && !form.doctorId) next.doctorId = "Select a doctor";
    if (current === 3) {
      if (!form.appointmentDate) next.appointmentDate = "Select a date";
      if (!form.appointmentTime) next.appointmentTime = "Select a time slot";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(3, s + 1));
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const onSubmit = async () => {
    if (!validateStep(3)) return;
    setLoading(true);
    const result = await createAppointment(form);
    setLoading(false);
    if (result.success) {
      toast.success(result.message);
      router.push("/appointments");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Book Appointment"
        description="Complete the booking in 3 simple steps"
        breadcrumbs={[
          { label: "Appointments", href: "/appointments" },
          { label: "Book" },
        ]}
      />

      <div className="grid grid-cols-3 gap-3">
        {STEPS.map((item) => {
          const Icon = item.icon;
          const active = step === item.id;
          const done = step > item.id;
          return (
            <div
              key={item.id}
              className={`rounded-xl border p-3 transition ${
                active ? "border-primary bg-primary/5 shadow-primary" : done ? "border-green-200 bg-green-50" : "bg-card"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`rounded-lg p-2 ${active ? "bg-primary text-white" : done ? "bg-green-600 text-white" : "bg-muted"}`}>
                  {done ? <CheckCircle2 className="size-4" /> : <Icon className="size-4" />}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Step {item.id}</p>
                  <p className="text-sm font-semibold">{item.title}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Card className="shadow-card">
        <CardContent className="space-y-6 p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Patient Information</h2>
                <p className="text-sm text-muted-foreground">Who is this appointment for?</p>
              </div>

              {isPatient ? (
                <div className="rounded-xl border bg-primary/5 p-4">
                  <p className="font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{user?.email || user?.phone}</p>
                  <Badge className="mt-2" variant="secondary">Booking for yourself</Badge>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Select Patient *</Label>
                  <FormSelect
                    options={patients.map((p) => ({
                      value: p.id,
                      label: `${p.firstName} ${p.lastName} • ${p.phone || "No phone"}`,
                    }))}
                    value={form.patientId}
                    onValueChange={(v) => setField("patientId", v)}
                    placeholder="Choose patient"
                  />
                  {errors.patientId && <p className="text-xs text-destructive">{errors.patientId}</p>}
                  {selectedPatient && (
                    <div className="rounded-lg border p-3 text-sm text-muted-foreground">
                      {selectedPatient.gender} • DOB {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}
                      {selectedPatient.bloodGroup ? ` • ${selectedPatient.bloodGroup}` : ""}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Choose Doctor</h2>
                  <p className="text-sm text-muted-foreground">Filter by department and pick a specialist</p>
                </div>
                <div className="w-full max-w-xs space-y-2">
                  <Label>Department</Label>
                  <FormSelect
                    options={[{ value: "all", label: "All departments" }, ...departments]}
                    value={deptFilter}
                    onValueChange={setDeptFilter}
                    placeholder="All departments"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {filteredDoctors.map((doctor) => {
                  const selected = form.doctorId === doctor.id;
                  return (
                    <button
                      key={doctor.id}
                      type="button"
                      onClick={() => setField("doctorId", doctor.id)}
                      className={`rounded-xl border p-4 text-left transition hover:shadow-card-hover ${
                        selected ? "border-primary bg-primary/5 shadow-primary" : "bg-card"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold">
                            Dr. {doctor.user?.firstName} {doctor.user?.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {doctor.specialization || "General"} • {doctor.department?.name || "Department"}
                          </p>
                        </div>
                        {selected && <CheckCircle2 className="size-5 text-primary" />}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Badge variant="secondary">{doctor.available ? "Available" : "Busy"}</Badge>
                        {doctor.experience != null && <Badge variant="outline">{doctor.experience} yrs</Badge>}
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.doctorId && <p className="text-xs text-destructive">{errors.doctorId}</p>}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold">Date & Time Slot</h2>
                <p className="text-sm text-muted-foreground">Pick a convenient schedule</p>
              </div>

              <div className="space-y-2">
                <Label>Select Date *</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-7">
                  {availableDates.map((date) => {
                    const d = new Date(date);
                    const selected = form.appointmentDate === date;
                    return (
                      <button
                        key={date}
                        type="button"
                        onClick={() => setField("appointmentDate", date)}
                        className={`rounded-xl border px-2 py-3 text-center transition ${
                          selected ? "border-primary bg-primary text-white" : "hover:border-primary/40"
                        }`}
                      >
                        <p className="text-[11px] opacity-80">
                          {d.toLocaleDateString("en-GB", { weekday: "short" })}
                        </p>
                        <p className="text-sm font-semibold">
                          {d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                        </p>
                      </button>
                    );
                  })}
                </div>
                {errors.appointmentDate && <p className="text-xs text-destructive">{errors.appointmentDate}</p>}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Clock3 className="size-3.5" /> Select Time *
                </Label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                  {TIME_SLOTS.map((slot) => {
                    const selected = form.appointmentTime === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setField("appointmentTime", slot)}
                        className={`rounded-lg border px-2 py-2 text-sm font-medium transition ${
                          selected ? "border-primary bg-primary text-white" : "hover:border-primary/40"
                        }`}
                      >
                        {formatSlot(slot)}
                      </button>
                    );
                  })}
                </div>
                {errors.appointmentTime && <p className="text-xs text-destructive">{errors.appointmentTime}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Reason for visit</Label>
                  <Textarea
                    rows={3}
                    placeholder="e.g. Fever, follow-up, consultation"
                    value={form.reason}
                    onChange={(e) => setField("reason", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    rows={3}
                    placeholder="Optional notes for doctor"
                    value={form.notes}
                    onChange={(e) => setField("notes", e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-xl border bg-muted/40 p-4 text-sm">
                <p className="font-semibold mb-2">Booking summary</p>
                <p>Patient: {isPatient ? `${user?.firstName || ""} ${user?.lastName || ""}` : `${selectedPatient?.firstName || "-"} ${selectedPatient?.lastName || ""}`}</p>
                <p>Doctor: {selectedDoctor ? `Dr. ${selectedDoctor.user?.firstName} ${selectedDoctor.user?.lastName}` : "-"}</p>
                <p>
                  Slot: {form.appointmentDate || "-"} {form.appointmentTime ? `at ${formatSlot(form.appointmentTime)}` : ""}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            <Button type="button" variant="outline" onClick={goBack} disabled={step === 1 || loading}>
              <ChevronLeft className="mr-1 size-4" /> Back
            </Button>

            {step < 3 ? (
              <Button type="button" className="gradient-primary border-0" onClick={goNext}>
                Continue <ChevronRight className="ml-1 size-4" />
              </Button>
            ) : (
              <Button type="button" className="gradient-primary border-0" onClick={onSubmit} disabled={loading}>
                {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                Confirm Booking
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
