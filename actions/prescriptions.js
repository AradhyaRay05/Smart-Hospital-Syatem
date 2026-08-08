"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { guardAction } from "@/lib/guards";

export async function createPrescription(data) {
  try {
    const { user } = await guardAction("prescriptions", "create");

    const medicalRecord = await prisma.medicalRecord.findUnique({ where: { id: data.medicalRecordId } });
    if (!medicalRecord) return { success: false, message: "Medical record not found" };

    const prescription = await prisma.prescription.create({
      data: {
        medicalRecordId: data.medicalRecordId,
        doctorId: medicalRecord.doctorId,
        instructions: data.instructions || null,
        items: { create: data.items.map((item) => ({ medicineName: item.medicineName, dosage: item.dosage, frequency: item.frequency, duration: item.duration, instructions: item.instructions || null })) },
      },
      include: { items: true, doctor: { include: { user: true } }, medicalRecord: { include: { patient: true } } },
    });

    revalidatePath("/prescriptions");
    revalidatePath("/medical-records");
    revalidatePath("/dashboard");
    return { success: true, message: "Prescription created successfully", data: prescription };
  } catch (error) {
    if (error.message === "Unauthorized") return { success: false, message: "Unauthorized" };
    if (error.message === "Forbidden") return { success: false, message: "You do not have permission to create prescriptions" };
    if (error.message === "Service temporarily unavailable") return { success: false, message: "Database connection error. Please try again." };
    console.error("Create prescription error:", error);
    return { success: false, message: `Failed to create prescription: ${error.message}` };
  }
}

export async function updatePrescription(id, data) {
  try {
    const { user } = await guardAction("prescriptions", "update");

    await prisma.prescriptionItem.deleteMany({ where: { prescriptionId: id } });

    const prescription = await prisma.prescription.update({
      where: { id },
      data: {
        instructions: data.instructions,
        items: { create: data.items.map((item) => ({ medicineName: item.medicineName, dosage: item.dosage, frequency: item.frequency, duration: item.duration, instructions: item.instructions || null })) },
      },
      include: { items: true, doctor: { include: { user: true } }, medicalRecord: { include: { patient: true } } },
    });

    revalidatePath("/prescriptions");
    return { success: true, message: "Prescription updated successfully", data: prescription };
  } catch (error) {
    if (error.message === "Unauthorized") return { success: false, message: "Unauthorized" };
    if (error.message === "Forbidden") return { success: false, message: "You do not have permission to update prescriptions" };
    if (error.message === "Service temporarily unavailable") return { success: false, message: "Database connection error. Please try again." };
    console.error("Update prescription error:", error);
    return { success: false, message: "Failed to update prescription" };
  }
}

export async function getPrescriptions({ search, patientId, doctorId, page = 1, limit = 10 } = {}) {
  try {
    const { user, role } = await guardAction("prescriptions", "read");

    const where = {};

    if (role === "DOCTOR") {
      const doctor = await prisma.doctor.findUnique({ where: { userId: user.id } });
      if (doctor) where.doctorId = doctor.id;
    } else if (role === "PATIENT") {
      const patient = await prisma.patient.findUnique({ where: { userId: user.id } });
      if (patient) where.medicalRecord = { patientId: patient.id };
    } else {
      if (search) {
        where.OR = [
          { medicalRecord: { patient: { firstName: { contains: search, mode: "insensitive" } } } },
          { medicalRecord: { patient: { lastName: { contains: search, mode: "insensitive" } } } },
          { items: { some: { medicineName: { contains: search, mode: "insensitive" } } } },
        ];
      }
      if (patientId) where.medicalRecord = { patientId };
      if (doctorId) where.doctorId = doctorId;
    }

    const [prescriptions, total] = await Promise.all([
      prisma.prescription.findMany({
        where,
        include: { items: true, doctor: { include: { user: true } }, medicalRecord: { include: { patient: true, appointment: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.prescription.count({ where }),
    ]);

    return { success: true, data: prescriptions, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  } catch (error) {
    if (error.message === "Unauthorized") return { success: false, message: "Unauthorized" };
    if (error.message === "Forbidden") return { success: false, message: "Access denied" };
    if (error.message === "Service temporarily unavailable") return { success: false, message: "Database connection error. Please try again." };
    console.error("Get prescriptions error:", error);
    return { success: false, message: "Failed to fetch prescriptions" };
  }
}

export async function getPrescriptionById(id) {
  try {
    const { user, role } = await guardAction("prescriptions", "read");

    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: { items: true, doctor: { include: { user: true, department: true } }, medicalRecord: { include: { patient: true, appointment: true } } },
    });

    if (!prescription) return { success: false, message: "Prescription not found" };

    if (role === "PATIENT") {
      const patient = await prisma.patient.findUnique({ where: { userId: user.id } });
      if (!patient || prescription.medicalRecord?.patientId !== patient.id) return { success: false, message: "Access denied" };
    }

    return { success: true, data: prescription };
  } catch (error) {
    if (error.message === "Unauthorized") return { success: false, message: "Unauthorized" };
    if (error.message === "Forbidden") return { success: false, message: "Access denied" };
    if (error.message === "Service temporarily unavailable") return { success: false, message: "Database connection error. Please try again." };
    console.error("Get prescription error:", error);
    return { success: false, message: "Failed to fetch prescription" };
  }
}
