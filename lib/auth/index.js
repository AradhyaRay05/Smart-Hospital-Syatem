import { getAuthPayload, setAuthCookie, clearAuthCookie } from "./jwt";
import { prisma } from "@/lib/prisma";
import { enforceSuperAdmin } from "./super-admin";

export async function getCurrentUser() {
  const payload = await getAuthPayload();
  if (!payload) return null;

  try {
    let user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { patient: true, doctor: true },
    });
    user = await enforceSuperAdmin(prisma, user);
    return user;
  } catch (error) {
    console.error("getCurrentUser DB error:", error.message || error);
    return null;
  }
}

export async function getCurrentUserRole() {
  const user = await getCurrentUser();
  return user?.role || null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireRole(...roles) {
  const user = await requireAuth();
  if (!roles.includes(user.role)) throw new Error("Forbidden");
  return user;
}

export async function ensureUser() {
  const payload = await getAuthPayload();
  if (!payload) return null;

  try {
    let user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { patient: true, doctor: true },
    });

    if (!user) return null;

    if (user.role === "PATIENT" && !user.patient) {
      await prisma.patient.create({
        data: {
          userId: user.id,
          firstName: user.firstName || "Patient",
          lastName: user.lastName || "",
          gender: "OTHER",
          dateOfBirth: new Date("2000-01-01"),
          phone: "0000000000",
        },
      });
      user = await prisma.user.findUnique({
        where: { id: user.id },
        include: { patient: true, doctor: true },
      });
    }

    return user;
  } catch (error) {
    console.error("ensureUser DB error:", error.message || error);
    return null;
  }
}

export async function authenticateUser(emailInput, password) {
  const bcrypt = await import("bcryptjs");
  const email = emailInput?.toLowerCase()?.trim();
  let user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });

  if (!user || !user.password) return null;

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;

  user = await enforceSuperAdmin(prisma, user);
  await setAuthCookie(user.id, user.email, user.role, user.profileComplete !== false);
  return user;
}

export async function registerUser(data) {
  const bcrypt = await import("bcryptjs");
  const { isSuperAdminEmail } = await import("./super-admin");

  const email = data.email?.toLowerCase()?.trim();
  const existing = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });
  if (existing) return { success: false, message: "Email already registered" };

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const isSuperAdmin = isSuperAdminEmail(data.email);
  const role = isSuperAdmin ? "SUPER_ADMIN" : data.role || "PATIENT";
  const phone = data.phone ? String(data.phone).replace(/\D/g, "") : null;

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      phone,
      phoneVerified: false,
      role,
      profileComplete: true,
      city: data.city || null,
    },
  });

  if (user.role === "PATIENT") {
    await prisma.patient.create({
      data: {
        userId: user.id,
        firstName: data.firstName || "Patient",
        lastName: data.lastName || "",
        gender: data.gender || "OTHER",
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : new Date("2000-01-01"),
        phone: phone || "0000000000",
        address: data.city || data.address || null,
        bloodGroup: data.bloodGroup || null,
        emergencyContact: data.emergencyContact || null,
      },
    });
  }

  await setAuthCookie(user.id, user.email, user.role, user.profileComplete);
  return {
    success: true,
    message: "Registration successful",
    user,
    needsProfile: user.role === "PATIENT" && !user.profileComplete,
  };
}

export { setAuthCookie, clearAuthCookie };
