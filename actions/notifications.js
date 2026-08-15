"use server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export async function getUserNotifications() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, data: [] };
    }

    const notifications = [];

    if (user.role === "PATIENT") {
      const patient = user.patient || await prisma.patient.findUnique({ where: { userId: user.id } });
      if (patient) {
        // 1. Patient's Appointments
        const appointments = await prisma.appointment.findMany({
          where: { patientId: patient.id },
          include: { doctor: { include: { user: true, department: true } } },
          orderBy: { createdAt: "desc" },
          take: 5,
        });

        for (const apt of appointments) {
          notifications.push({
            id: `apt-${apt.id}`,
            title: `Appointment ${apt.status.toLowerCase()}`,
            desc: `With Dr. ${apt.doctor?.user?.firstName || ""} ${apt.doctor?.user?.lastName || ""} (${apt.doctor?.department?.name || "General"}) on ${format(new Date(apt.dateTime), "MMM d, h:mm a")}`,
            time: format(new Date(apt.createdAt), "MMM d"),
            unread: apt.status === "SCHEDULED",
            href: "/appointments",
            type: "appointment",
          });
        }

        // 2. Patient's Prescriptions
        const prescriptions = await prisma.prescription.findMany({
          where: { medicalRecord: { patientId: patient.id } },
          include: { doctor: { include: { user: true } } },
          orderBy: { createdAt: "desc" },
          take: 5,
        });

        for (const rx of prescriptions) {
          notifications.push({
            id: `rx-${rx.id}`,
            title: "New Prescription Issued",
            desc: `Prescribed by Dr. ${rx.doctor?.user?.firstName || ""} ${rx.doctor?.user?.lastName || ""}`,
            time: format(new Date(rx.createdAt), "MMM d"),
            unread: true,
            href: `/prescriptions/${rx.id}`,
            type: "prescription",
          });
        }

        // 3. Patient's Bills
        const bills = await prisma.bill.findMany({
          where: { patientId: patient.id },
          orderBy: { createdAt: "desc" },
          take: 5,
        });

        for (const b of bills) {
          notifications.push({
            id: `bill-${b.id}`,
            title: `Invoice ${b.paymentStatus === "PAID" ? "Paid" : "Issued"}`,
            desc: `Amount: ₹${b.totalAmount.toFixed(2)} — Status: ${b.paymentStatus}`,
            time: format(new Date(b.createdAt), "MMM d"),
            unread: b.paymentStatus === "PENDING",
            href: `/billing/${b.id}`,
            type: "billing",
          });
        }
      }
    } else if (user.role === "DOCTOR") {
      const doctor = user.doctor || await prisma.doctor.findUnique({ where: { userId: user.id } });
      if (doctor) {
        // 1. Doctor's Assigned Appointments
        const appointments = await prisma.appointment.findMany({
          where: { doctorId: doctor.id },
          include: { patient: true },
          orderBy: { dateTime: "desc" },
          take: 8,
        });

        for (const apt of appointments) {
          notifications.push({
            id: `doc-apt-${apt.id}`,
            title: `Appointment ${apt.status.toLowerCase()}`,
            desc: `Patient ${apt.patient.firstName} ${apt.patient.lastName} — ${format(new Date(apt.dateTime), "MMM d, h:mm a")}`,
            time: format(new Date(apt.createdAt), "MMM d"),
            unread: apt.status === "SCHEDULED",
            href: "/appointments",
            type: "appointment",
          });
        }

        // 2. Doctor's Assigned Complaints
        const complaints = await prisma.complaint.findMany({
          where: { assignedToId: user.id },
          orderBy: { createdAt: "desc" },
          take: 5,
        });

        for (const c of complaints) {
          notifications.push({
            id: `doc-cmp-${c.id}`,
            title: `Grievance Ticket ${c.ticketId}`,
            desc: `Subject: ${c.subject} (${c.status})`,
            time: format(new Date(c.createdAt), "MMM d"),
            unread: c.status !== "RESOLVED",
            href: "/feedback/staff",
            type: "feedback",
          });
        }
      }
    } else {
      // ADMIN, SUPER_ADMIN, RECEPTIONIST - Hospital-wide notifications
      const recentApts = await prisma.appointment.findMany({
        include: { patient: true, doctor: { include: { user: true } } },
        orderBy: { createdAt: "desc" },
        take: 4,
      });

      for (const apt of recentApts) {
        notifications.push({
          id: `adm-apt-${apt.id}`,
          title: "New Appointment Booked",
          desc: `Patient ${apt.patient.firstName} ${apt.patient.lastName} with Dr. ${apt.doctor.user.firstName} ${apt.doctor.user.lastName}`,
          time: format(new Date(apt.createdAt), "MMM d"),
          unread: true,
          href: "/appointments",
          type: "appointment",
        });
      }

      const recentBills = await prisma.bill.findMany({
        include: { patient: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      });

      for (const b of recentBills) {
        notifications.push({
          id: `adm-bill-${b.id}`,
          title: `Invoice ${b.paymentStatus}`,
          desc: `₹${b.totalAmount.toFixed(2)} for ${b.patient.firstName} ${b.patient.lastName}`,
          time: format(new Date(b.createdAt), "MMM d"),
          unread: false,
          href: `/billing/${b.id}`,
          type: "billing",
        });
      }
    }

    // Sort by timestamp if available or keep top list
    return { success: true, data: notifications.slice(0, 10) };
  } catch (error) {
    console.error("getUserNotifications error:", error);
    return { success: false, data: [] };
  }
}
