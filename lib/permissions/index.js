import { ROLES } from "@/lib/roles";

const C = "create";
const R = "read";
const U = "update";
const D = "del";
const OWN = "own";
const ALL = "all";

export const PERMISSIONS = {
  departments: {
    [ROLES.ADMIN]:       [C, R, U, D],
    [ROLES.RECEPTIONIST]: [R],
    [ROLES.DOCTOR]:      [],
    [ROLES.PATIENT]:     [R],
  },
  doctors: {
    [ROLES.ADMIN]:       [C, R, U, D],
    [ROLES.RECEPTIONIST]: [R],
    [ROLES.DOCTOR]:      [OWN],
    [ROLES.PATIENT]:     [R],
  },
  patients: {
    [ROLES.ADMIN]:       [R, U],
    [ROLES.RECEPTIONIST]: [C, R, U],
    [ROLES.DOCTOR]:      [R],
    [ROLES.PATIENT]:     [OWN],
  },
  appointments: {
    [ROLES.ADMIN]:       [C, R, U, D],
    [ROLES.RECEPTIONIST]: [C, R, U],
    [ROLES.DOCTOR]:      [C, R, U, OWN],
    [ROLES.PATIENT]:     [C, R, U, OWN],
  },
  medicalRecords: {
    [ROLES.ADMIN]:       [R],
    [ROLES.RECEPTIONIST]: [R],
    [ROLES.DOCTOR]:      [C, R, U],
    [ROLES.PATIENT]:     [R, OWN],
  },
  prescriptions: {
    [ROLES.ADMIN]:       [R],
    [ROLES.RECEPTIONIST]: [R],
    [ROLES.DOCTOR]:      [C, R, U],
    [ROLES.PATIENT]:     [R, OWN],
  },
  billing: {
    [ROLES.ADMIN]:       [C, R, U, D],
    [ROLES.RECEPTIONIST]: [C, R, U],
    [ROLES.DOCTOR]:      [],
    [ROLES.PATIENT]:     [R, OWN],
  },
  reports: {
    [ROLES.ADMIN]:       [ALL],
    [ROLES.RECEPTIONIST]: [],
    [ROLES.DOCTOR]:      [],
    [ROLES.PATIENT]:     [],
  },
  beds: {
    [ROLES.ADMIN]:       [C, R, U, D],
    [ROLES.RECEPTIONIST]: [R, U],
    [ROLES.DOCTOR]:      [R],
    [ROLES.PATIENT]:     [],
  },
  feedback: {
    [ROLES.ADMIN]:       [C, R, U, D],
    [ROLES.RECEPTIONIST]: [C, R, U],
    [ROLES.DOCTOR]:      [R, U],
    [ROLES.PATIENT]:     [C, R],
  },
};

export function hasPermission(module, role, action) {
  if (role === ROLES.SUPER_ADMIN) return true;
  const modulePerms = PERMISSIONS[module];
  if (!modulePerms) return false;
  const rolePerms = modulePerms[role];
  if (!rolePerms) return false;
  return rolePerms.includes(action) || rolePerms.includes(ALL);
}

export function canCreate(module, role) {
  return hasPermission(module, role, C);
}

export function canRead(module, role) {
  return hasPermission(module, role, R) || hasPermission(module, role, OWN);
}

export function canUpdate(module, role) {
  return hasPermission(module, role, U);
}

export function canDelete(module, role) {
  return hasPermission(module, role, D);
}

export function isOwnOnly(module, role) {
  const modulePerms = PERMISSIONS[module];
  if (!modulePerms) return false;
  const rolePerms = modulePerms[role];
  if (!rolePerms) return false;
  return rolePerms.includes(OWN) && !rolePerms.includes(R);
}

export function hasAnyPermission(module, role) {
  const modulePerms = PERMISSIONS[module];
  if (!modulePerms) return false;
  const rolePerms = modulePerms[role];
  return rolePerms && rolePerms.length > 0;
}
