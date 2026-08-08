import { SUPER_ADMIN_EMAIL, ROLES } from "@/lib/roles";

export async function enforceSuperAdmin(prisma, user) {
  if (!user) return user;
  if (user.email?.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) return user;
  if (user.role === ROLES.SUPER_ADMIN) return user;

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { role: ROLES.SUPER_ADMIN, profileComplete: true },
    include: { patient: true, doctor: true },
  });
  return updated;
}

export function isSuperAdminEmail(email) {
  return email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}
