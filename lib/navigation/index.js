import { ROLES } from "@/lib/roles";
import {
  LayoutDashboard,
  Users,
  UserCog,
  CalendarDays,
  FileText,
  Pill,
  IndianRupee,
  Building2,
  Settings,
  Calendar,
  KeyRound,
  BedDouble,
  MessageSquareWarning,
} from "lucide-react";

const adminNavigation = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Hospital",
    items: [
      { title: "Departments", href: "/departments", icon: Building2 },
      { title: "Doctors", href: "/doctors", icon: UserCog },
      { title: "Patients", href: "/patients", icon: Users },
      { title: "Bed Management", href: "/beds", icon: BedDouble },
      { title: "Feedback & Grievances", href: "/feedback/manage", icon: MessageSquareWarning },
    ],
  },
  {
    label: "Clinical",
    items: [
      { title: "Appointments", href: "/appointments", icon: CalendarDays },
      { title: "Medical Records", href: "/medical-records", icon: FileText },
      { title: "Prescriptions", href: "/prescriptions", icon: Pill },
    ],
  },
  {
    label: "Finance",
    items: [
      { title: "Billing", href: "/billing", icon: IndianRupee },
    ],
  },
  {
    label: "Administration",
    items: [
      { title: "Registration Codes", href: "/admin/registration-codes", icon: KeyRound },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

const receptionistNavigation = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Front Desk",
    items: [
      { title: "Patients", href: "/patients", icon: Users },
      { title: "Appointments", href: "/appointments", icon: CalendarDays },
      { title: "Billing", href: "/billing", icon: IndianRupee },
      { title: "Bed Management", href: "/beds", icon: BedDouble },
      { title: "Feedback & Grievances", href: "/feedback/manage", icon: MessageSquareWarning },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

const doctorNavigation = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Clinical",
    items: [
      { title: "My Appointments", href: "/appointments", icon: CalendarDays },
      { title: "Medical Records", href: "/medical-records", icon: FileText },
      { title: "Prescriptions", href: "/prescriptions", icon: Pill },
      { title: "Department Grievances", href: "/feedback/manage", icon: MessageSquareWarning },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Profile", href: "/profile", icon: Settings },
    ],
  },
];

const patientNavigation = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "My Health",
    items: [
      { title: "Book Appointment", href: "/appointments/new", icon: Calendar },
      { title: "My Appointments", href: "/appointments", icon: CalendarDays },
      { title: "Medical History", href: "/medical-records", icon: FileText },
      { title: "Prescriptions", href: "/prescriptions", icon: Pill },
      { title: "Bills", href: "/billing", icon: IndianRupee },
      { title: "Submit Feedback", href: "/feedback", icon: MessageSquareWarning },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Profile", href: "/profile", icon: Settings },
    ],
  },
];

const navigationByRole = {
  [ROLES.SUPER_ADMIN]: adminNavigation,
  [ROLES.ADMIN]: adminNavigation,
  [ROLES.RECEPTIONIST]: receptionistNavigation,
  [ROLES.DOCTOR]: doctorNavigation,
  [ROLES.PATIENT]: patientNavigation,
};

export function getNavigationForRole(role) {
  return navigationByRole[role] || [];
}
