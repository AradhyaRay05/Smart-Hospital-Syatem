"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { guardAction } from "@/lib/guards";

export async function getBedDashboardData() {
  try {
    await guardAction("beds", "read");

    const wards = await prisma.ward.findMany({
      include: {
        department: { select: { id: true, name: true } },
        beds: {
          include: {
            patient: { select: { id: true, firstName: true, lastName: true } },
            updatedBy: { select: { id: true, firstName: true, lastName: true } },
          },
          orderBy: { bedNumber: "asc" },
        },
      },
      orderBy: [{ floor: "asc" }, { name: "asc" }],
    });

    // Compute summary stats
    const allBeds = wards.flatMap((w) => w.beds);
    const stats = {
      total: allBeds.length,
      vacant: allBeds.filter((b) => b.status === "VACANT").length,
      occupied: allBeds.filter((b) => b.status === "OCCUPIED").length,
      reserved: allBeds.filter((b) => b.status === "RESERVED").length,
      needsCleaning: allBeds.filter((b) => b.status === "NEEDS_CLEANING").length,
    };

    // Group by floor
    const floors = {};
    for (const ward of wards) {
      if (!floors[ward.floor]) {
        floors[ward.floor] = [];
      }
      floors[ward.floor].push(ward);
    }

    return {
      success: true,
      data: { floors, stats, wards },
    };
  } catch (error) {
    if (error.message === "Unauthorized") return { success: false, message: "Unauthorized" };
    if (error.message === "Forbidden") return { success: false, message: "Access denied" };
    if (error.message === "Service temporarily unavailable") return { success: false, message: "Database connection error. Please try again." };
    console.error("Get bed dashboard error:", error);
    return { success: false, message: "Failed to fetch bed data" };
  }
}

export async function getDepartmentsForWard() {
  try {
    await guardAction("beds", "read");
    const departments = await prisma.department.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return { success: true, data: departments };
  } catch {
    return { success: false, data: [] };
  }
}

export async function updateBedStatus(bedId, data) {
  try {
    const { user } = await guardAction("beds", "update");

    const bed = await prisma.bed.findUnique({ where: { id: bedId } });
    if (!bed) {
      return { success: false, message: "Bed not found" };
    }

    const previousStatus = bed.status;
    const newStatus = data.status;

    // If marking as occupied, patientId should be provided
    const patientId = newStatus === "OCCUPIED" ? (data.patientId || null) : null;

    // Update the bed
    const updatedBed = await prisma.bed.update({
      where: { id: bedId },
      data: {
        status: newStatus,
        patientId,
        notes: data.notes || null,
        statusUpdatedAt: new Date(),
        updatedById: user.id,
      },
    });

    // Create audit log
    await prisma.bedStatusLog.create({
      data: {
        bedId,
        previousStatus,
        newStatus,
        changedById: user.id,
        notes: data.notes || null,
      },
    });

    revalidatePath("/beds");
    revalidatePath("/dashboard");

    const needsCleaningAlert = newStatus === "NEEDS_CLEANING";

    return {
      success: true,
      message: `Bed status updated to ${newStatus.replace("_", " ").toLowerCase()}`,
      data: updatedBed,
      needsCleaningAlert,
    };
  } catch (error) {
    if (error.message === "Unauthorized") return { success: false, message: "Unauthorized" };
    if (error.message === "Forbidden") return { success: false, message: "You do not have permission to update bed status" };
    if (error.message === "Service temporarily unavailable") return { success: false, message: "Database connection error. Please try again." };
    console.error("Update bed status error:", error);
    return { success: false, message: "Failed to update bed status" };
  }
}

export async function getAvailablePatients() {
  try {
    await guardAction("beds", "read");

    const patients = await prisma.patient.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
      },
      orderBy: { firstName: "asc" },
      take: 200,
    });

    return { success: true, data: patients };
  } catch (error) {
    if (error.message === "Unauthorized") return { success: false, message: "Unauthorized" };
    if (error.message === "Forbidden") return { success: false, message: "Access denied" };
    console.error("Get available patients error:", error);
    return { success: false, message: "Failed to fetch patients" };
  }
}

export async function seedBedData() {
  try {
    await guardAction("beds", "create");

    // Check if data already exists
    const existingWards = await prisma.ward.count();
    if (existingWards > 0) {
      return { success: false, message: "Bed data already exists. Delete existing wards first." };
    }

    // Get existing departments
    const departments = await prisma.department.findMany({
      where: { status: "ACTIVE" },
      take: 6,
    });

    if (departments.length === 0) {
      return { success: false, message: "No active departments found. Create departments first." };
    }

    const genderWards = ["MALE", "FEMALE", "MIXED"];
    const bedTypes = ["GENERAL", "SEMI_PRIVATE", "PRIVATE", "ICU", "EMERGENCY", "MATERNITY"];
    const statuses = ["VACANT", "OCCUPIED", "RESERVED", "NEEDS_CLEANING"];

    const wardData = [];
    let wardIndex = 0;

    // Create wards across 3 floors
    for (let floor = 1; floor <= 3; floor++) {
      const deptsForFloor = departments.slice(
        ((floor - 1) * 2) % departments.length,
        ((floor - 1) * 2 + 2) % departments.length || departments.length
      );

      // Ensure we always get at least 1 department
      const floorDepts = deptsForFloor.length > 0 ? deptsForFloor : [departments[0]];

      for (const dept of floorDepts) {
        const gender = genderWards[wardIndex % genderWards.length];
        wardData.push({
          name: `${dept.name} Ward ${String.fromCharCode(65 + wardIndex)}`,
          floor,
          departmentId: dept.id,
          genderWard: gender,
        });
        wardIndex++;
      }
    }

    // Create wards and beds
    for (const wd of wardData) {
      const ward = await prisma.ward.create({ data: wd });

      const bedCount = 6 + Math.floor(Math.random() * 7); // 6–12 beds
      for (let i = 1; i <= bedCount; i++) {
        const bedType = bedTypes[Math.floor(Math.random() * bedTypes.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        await prisma.bed.create({
          data: {
            bedNumber: `${String.fromCharCode(65 + wardData.indexOf(wd))}${String(i).padStart(2, "0")}`,
            wardId: ward.id,
            bedType,
            status,
            notes: status === "NEEDS_CLEANING" ? "Patient discharged, awaiting housekeeping" : null,
          },
        });
      }
    }

    revalidatePath("/beds");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Seeded ${wardData.length} wards with beds across 3 floors`,
    };
  } catch (error) {
    if (error.message === "Unauthorized") return { success: false, message: "Unauthorized" };
    if (error.message === "Forbidden") return { success: false, message: "Only admins can seed bed data" };
    if (error.message === "Service temporarily unavailable") return { success: false, message: "Database connection error. Please try again." };
    console.error("Seed bed data error:", error);
    return { success: false, message: "Failed to seed bed data" };
  }
}

export async function createWard(data) {
  try {
    await guardAction("beds", "create");

    const existing = await prisma.ward.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      return { success: false, message: "Ward with this name already exists" };
    }

    const ward = await prisma.ward.create({
      data: {
        name: data.name,
        floor: data.floor,
        departmentId: data.departmentId,
        genderWard: data.genderWard || "MIXED",
      },
    });

    revalidatePath("/beds");
    return { success: true, message: "Ward created successfully", data: ward };
  } catch (error) {
    if (error.message === "Unauthorized") return { success: false, message: "Unauthorized" };
    if (error.message === "Forbidden") return { success: false, message: "You do not have permission to create wards" };
    if (error.message === "Service temporarily unavailable") return { success: false, message: "Database connection error. Please try again." };
    console.error("Create ward error:", error);
    return { success: false, message: "Failed to create ward" };
  }
}

export async function createBed(data) {
  try {
    await guardAction("beds", "create");

    const existing = await prisma.bed.findFirst({
      where: {
        wardId: data.wardId,
        bedNumber: data.bedNumber.trim(),
      },
    });

    if (existing) {
      return { success: false, message: "A bed with this number already exists in this ward" };
    }

    const bed = await prisma.bed.create({
      data: {
        bedNumber: data.bedNumber.trim(),
        wardId: data.wardId,
        bedType: data.bedType || "GENERAL",
        status: data.status || "VACANT",
        notes: data.notes || null,
      },
    });

    revalidatePath("/beds");
    revalidatePath("/dashboard");

    return { success: true, message: "Bed created successfully", data: bed };
  } catch (error) {
    if (error.message === "Unauthorized") return { success: false, message: "Unauthorized" };
    if (error.message === "Forbidden") return { success: false, message: "You do not have permission to create beds" };
    if (error.message === "Service temporarily unavailable") return { success: false, message: "Database connection error. Please try again." };
    console.error("Create bed error:", error);
    return { success: false, message: "Failed to create bed" };
  }
}

export async function deleteAllBedData() {
  try {
    await guardAction("beds", "delete");

    await prisma.bedStatusLog.deleteMany({});
    await prisma.bed.deleteMany({});
    await prisma.ward.deleteMany({});

    revalidatePath("/beds");
    revalidatePath("/dashboard");

    return { success: true, message: "All bed data deleted successfully" };
  } catch (error) {
    if (error.message === "Unauthorized") return { success: false, message: "Unauthorized" };
    if (error.message === "Forbidden") return { success: false, message: "Only admins can delete bed data" };
    if (error.message === "Service temporarily unavailable") return { success: false, message: "Database connection error. Please try again." };
    console.error("Delete all bed data error:", error);
    return { success: false, message: "Failed to delete bed data" };
  }
}
