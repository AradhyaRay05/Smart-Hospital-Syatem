import { prisma } from "@/lib/prisma";
import { ensureUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users, UserCog, CalendarDays, DollarSign, Calendar, FileText, Pill, Receipt,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  let user = null;
  let role = "PATIENT";

  try {
    user = await ensureUser();
    if (user) role = user.role;
  } catch (e) {
    console.error("Dashboard user lookup failed:", e.message);
  }

  if (role === "PATIENT" || !user) {
    return <PatientDashboard user={user} />;
  }
  if (role === "DOCTOR") {
    return <DoctorDashboard user={user} />;
  }
  return <AdminDashboard user={user} />;
}

async function AdminDashboard({ user }) {
  let patientCount = 0, doctorCount = 0, departmentCount = 0, todayAppointments = 0, pendingAppointments = 0, totalRevenue = 0, recentAppointments = [], recentPatients = [], recentPrescriptions = [];

  const results = await Promise.allSettled([
    prisma.patient.count(), prisma.doctor.count(), prisma.department.count(),
    prisma.appointment.count({ where: { appointmentDate: { gte: new Date(new Date().setHours(0,0,0,0)), lt: new Date(new Date().setDate(new Date().getDate()+1)) }, status: "SCHEDULED" } }),
    prisma.appointment.count({ where: { status: "SCHEDULED" } }),
    prisma.bill.aggregate({ _sum: { totalAmount: true }, where: { paymentStatus: "PAID" } }),
    prisma.appointment.findMany({ where: { status: "SCHEDULED" }, include: { doctor: { include: { user: true, department: true } }, patient: true }, orderBy: { appointmentDate: "asc" }, take: 5 }),
    prisma.patient.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.prescription.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { items: true, doctor: { include: { user: true } }, medicalRecord: { include: { patient: true } } } }),
  ]);

  const get = (i, fb) => results[i].status === "fulfilled" ? results[i].value : fb;
  patientCount = get(0, 0); doctorCount = get(1, 0); departmentCount = get(2, 0);
  todayAppointments = get(3, 0); pendingAppointments = get(4, 0);
  totalRevenue = get(5, { _sum: { totalAmount: 0 } })?._sum?.totalAmount || 0;
  recentAppointments = get(6, []); recentPatients = get(7, []); recentPrescriptions = get(8, []);

  const stats = [
    { title: "Total Patients", value: String(patientCount), description: "Registered patients", icon: Users },
    { title: "Total Doctors", value: String(doctorCount), description: "Active doctors", icon: UserCog },
    { title: "Today", value: String(todayAppointments), description: `${pendingAppointments} pending total`, icon: CalendarDays },
    { title: "Revenue", value: `$${totalRevenue.toFixed(0)}`, description: "From paid bills", icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Welcome back{user?.firstName ? `, ${user.firstName}` : ""}</h1><p className="text-muted-foreground">Hospital operations overview.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{stats.map((s) => <StatCard key={s.title} {...s} />)}</div>
      <div className="grid gap-4 sm:grid-cols-4">
        {[{ title: "Register Patient", href: "/patients/new", icon: Users }, { title: "Book Appointment", href: "/appointments/new", icon: Calendar }, { title: "Medical Record", href: "/medical-records/new", icon: FileText }, { title: "Generate Bill", href: "/billing/new", icon: DollarSign }].map((a) => (
          <Link key={a.title} href={a.href}><div className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50"><a.icon className="size-4 text-primary" /><span className="text-sm font-medium">{a.title}</span></div></Link>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-base">Upcoming Appointments</CardTitle></CardHeader><CardContent>
          {recentAppointments.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No upcoming appointments.</p> : <div className="space-y-3">{recentAppointments.map((apt) => <Link key={apt.id} href={`/appointments/${apt.id}`} className="block"><div className="flex items-center justify-between rounded-lg border p-2.5 text-sm hover:bg-muted/50"><div><p className="font-medium">{apt.patient.firstName} {apt.patient.lastName}</p><p className="text-xs text-muted-foreground">Dr. {apt.doctor.user.firstName} {apt.doctor.user.lastName}</p></div><Badge className="text-xs">{apt.appointmentTime}</Badge></div></Link>)}</div>}
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Recent Patients</CardTitle></CardHeader><CardContent>
          {recentPatients.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No patients yet.</p> : <div className="space-y-3">{recentPatients.map((p) => <Link key={p.id} href={`/patients/${p.id}`} className="block"><div className="flex items-center justify-between rounded-lg border p-2.5 text-sm hover:bg-muted/50"><div><p className="font-medium">{p.firstName} {p.lastName}</p><p className="text-xs text-muted-foreground">{p.phone}</p></div><Badge variant="secondary" className="text-xs">{p.gender}</Badge></div></Link>)}</div>}
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Latest Prescriptions</CardTitle></CardHeader><CardContent>
          {recentPrescriptions.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No prescriptions yet.</p> : <div className="space-y-3">{recentPrescriptions.map((rx) => <Link key={rx.id} href={`/prescriptions/${rx.id}`} className="block"><div className="rounded-lg border p-2.5 text-sm hover:bg-muted/50"><div className="flex items-center justify-between"><p className="font-medium">{rx.medicalRecord?.patient?.firstName} {rx.medicalRecord?.patient?.lastName}</p><Badge variant="secondary" className="text-xs">{rx.items.length} med(s)</Badge></div><p className="text-xs text-muted-foreground mt-0.5">Dr. {rx.doctor.user.firstName} {rx.doctor.user.lastName}</p></div></Link>)}</div>}
        </CardContent></Card>
      </div>
    </div>
  );
}

async function DoctorDashboard({ user }) {
  let doctor = null;
  try { doctor = await prisma.doctor.findUnique({ where: { userId: user.id }, include: { department: true } }); } catch (e) {}

  let todayAppointments = [], upcomingAppointments = [], recentPatients = [];

  if (doctor) {
    const today = new Date(); today.setHours(0,0,0,0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate()+1);

    const results = await Promise.allSettled([
      prisma.appointment.findMany({ where: { doctorId: doctor.id, appointmentDate: { gte: today, lt: tomorrow }, status: "SCHEDULED" }, include: { patient: true }, orderBy: { appointmentTime: "asc" } }),
      prisma.appointment.findMany({ where: { doctorId: doctor.id, status: "SCHEDULED", appointmentDate: { gte: tomorrow } }, include: { patient: true }, orderBy: { appointmentDate: "asc" }, take: 5 }),
      prisma.patient.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

    todayAppointments = results[0].status === "fulfilled" ? results[0].value : [];
    upcomingAppointments = results[1].status === "fulfilled" ? results[1].value : [];
    recentPatients = results[2].status === "fulfilled" ? results[2].value : [];
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Dr. {user?.firstName} {user?.lastName}</h1><p className="text-muted-foreground">{doctor?.department?.name} &bull; {doctor?.specialization}</p></div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Today's Appointments" value={String(todayAppointments.length)} description="Scheduled for today" icon={CalendarDays} />
        <StatCard title="Upcoming" value={String(upcomingAppointments.length)} description="Future appointments" icon={Calendar} />
        <StatCard title="Available" value={doctor?.available ? "Yes" : "No"} description="Availability status" icon={UserCog} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card><CardHeader><CardTitle className="text-base">Today's Schedule</CardTitle></CardHeader><CardContent>
          {todayAppointments.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No appointments today.</p> : <div className="space-y-3">{todayAppointments.map((apt) => <div key={apt.id} className="flex items-center justify-between rounded-lg border p-2.5 text-sm"><div><p className="font-medium">{apt.patient.firstName} {apt.patient.lastName}</p>{apt.reason && <p className="text-xs text-muted-foreground">{apt.reason}</p>}</div><Badge className="text-xs">{apt.appointmentTime}</Badge></div>)}</div>}
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Upcoming Appointments</CardTitle></CardHeader><CardContent>
          {upcomingAppointments.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No upcoming appointments.</p> : <div className="space-y-3">{upcomingAppointments.map((apt) => <div key={apt.id} className="flex items-center justify-between rounded-lg border p-2.5 text-sm"><div><p className="font-medium">{apt.patient.firstName} {apt.patient.lastName}</p></div><Badge variant="secondary" className="text-xs">{new Date(apt.appointmentDate).toLocaleDateString()}</Badge></div>)}</div>}
        </CardContent></Card>
      </div>
    </div>
  );
}

async function PatientDashboard({ user }) {
  let patient = user?.patient || null;
  let upcomingAppointments = [], recentRecords = [], latestPrescription = null, unpaidBills = [];

  if (patient) {
    const results = await Promise.allSettled([
      prisma.appointment.findMany({ where: { patientId: patient.id, status: "SCHEDULED" }, include: { doctor: { include: { user: true, department: true } } }, orderBy: { appointmentDate: "asc" }, take: 5 }),
      prisma.medicalRecord.findMany({ where: { patientId: patient.id }, include: { doctor: { include: { user: true } } }, orderBy: { createdAt: "desc" }, take: 3 }),
      prisma.prescription.findFirst({ where: { medicalRecord: { patientId: patient.id } }, include: { items: true, doctor: { include: { user: true } } }, orderBy: { createdAt: "desc" } }),
      prisma.bill.findMany({ where: { patientId: patient.id, paymentStatus: "PENDING" }, orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

    upcomingAppointments = results[0].status === "fulfilled" ? results[0].value : [];
    recentRecords = results[1].status === "fulfilled" ? results[1].value : [];
    latestPrescription = results[2].status === "fulfilled" ? results[2].value : null;
    unpaidBills = results[3].status === "fulfilled" ? results[3].value : [];
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Welcome{user?.firstName ? `, ${user.firstName}` : ""}</h1><p className="text-muted-foreground">Your health dashboard.</p></div>

      {!patient ? (
        <Card><CardContent className="p-8 text-center"><p className="text-muted-foreground mb-4">Complete your patient profile to get started.</p><Link href="/patients/new"><Button>Register as Patient</Button></Link></CardContent></Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Upcoming" value={String(upcomingAppointments.length)} description="Appointments scheduled" icon={CalendarDays} />
            <StatCard title="Records" value={String(recentRecords.length)} description="Medical records" icon={FileText} />
            <StatCard title="Prescriptions" value={latestPrescription ? "1" : "0"} description="Latest prescription" icon={Pill} />
            <StatCard title="Unpaid Bills" value={String(unpaidBills.length)} description="Pending payments" icon={Receipt} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Link href="/appointments/new"><div className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50"><Calendar className="size-4 text-primary" /><span className="text-sm font-medium">Book Appointment</span></div></Link>
            <Link href="/medical-records"><div className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50"><FileText className="size-4 text-primary" /><span className="text-sm font-medium">Medical History</span></div></Link>
            <Link href="/billing"><div className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50"><Receipt className="size-4 text-primary" /><span className="text-sm font-medium">View Bills</span></div></Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card><CardHeader><CardTitle className="text-base">Upcoming Appointments</CardTitle></CardHeader><CardContent>
              {upcomingAppointments.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No upcoming appointments. <Link href="/appointments/new" className="text-primary underline">Book one now</Link>.</p> : <div className="space-y-3">{upcomingAppointments.map((apt) => <div key={apt.id} className="flex items-center justify-between rounded-lg border p-2.5 text-sm"><div><p className="font-medium">Dr. {apt.doctor.user.firstName} {apt.doctor.user.lastName}</p><p className="text-xs text-muted-foreground">{apt.doctor.department.name}</p></div><Badge className="text-xs">{new Date(apt.appointmentDate).toLocaleDateString()}</Badge></div>)}</div>}
            </CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">Recent Medical Records</CardTitle></CardHeader><CardContent>
              {recentRecords.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No medical records yet.</p> : <div className="space-y-3">{recentRecords.map((r) => <Link key={r.id} href={`/medical-records/${r.id}`} className="block"><div className="rounded-lg border p-2.5 text-sm hover:bg-muted/50"><p className="font-medium">{r.diagnosis || "No diagnosis"}</p><p className="text-xs text-muted-foreground">Dr. {r.doctor.user.firstName} {r.doctor.user.lastName}</p></div></Link>)}</div>}
            </CardContent></Card>
          </div>

          {latestPrescription && (
            <Card><CardHeader><CardTitle className="text-base">Latest Prescription</CardTitle></CardHeader><CardContent>
              <div className="rounded-lg border p-4"><div className="flex items-center justify-between mb-2"><p className="font-medium">Dr. {latestPrescription.doctor.user.firstName} {latestPrescription.doctor.user.lastName}</p><Badge variant="secondary">{latestPrescription.items.length} med(s)</Badge></div><div className="space-y-1">{latestPrescription.items.map((item) => <div key={item.id} className="flex justify-between text-sm"><span className="font-medium">{item.medicineName}</span><span className="text-muted-foreground">{item.dosage} &bull; {item.frequency}</span></div>)}</div></div>
            </CardContent></Card>
          )}
        </>
      )}
    </div>
  );
}
