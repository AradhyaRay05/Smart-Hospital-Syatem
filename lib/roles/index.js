export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  RECEPTIONIST: "RECEPTIONIST",
  DOCTOR: "DOCTOR",
  PATIENT: "PATIENT",
};

export const ROLE_LABELS = {
  SUPER_ADMIN: "Super Administrator",
  ADMIN: "Administrator",
  RECEPTIONIST: "Receptionist",
  DOCTOR: "Doctor",
  PATIENT: "Patient",
};

export const SUPER_ADMIN_EMAIL = "aradhyaray05@gmail.com";

export const ALL_ROLES = Object.values(ROLES);

export function isValidRole(role) {
  return ALL_ROLES.includes(role);
}

export function getRoleLabel(role) {
  return ROLE_LABELS[role] || role;
}
