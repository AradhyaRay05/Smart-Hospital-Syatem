# Smart Hospital Digitalization System (SHDS)

A modern, cloud-native hospital management platform built with Next.js, Clerk, Prisma, and Neon PostgreSQL.

## Overview

SHDS is a centralized digital healthcare platform that replaces manual hospital workflows with efficient digital processes. It supports four user roles (Administrator, Doctor, Receptionist, Patient) and covers the complete hospital workflow from patient registration to billing.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | JavaScript (ES6+) |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui |
| Authentication | Clerk |
| Database | Neon PostgreSQL |
| ORM | Prisma 7 |
| Forms | React Hook Form + Zod |
| Tables | TanStack Table |
| Icons | Lucide React |
| Notifications | Sonner |
| Deployment | Vercel |

## Features

- **Authentication**: Clerk-powered login, registration, session management, role-based access
- **Dashboard**: Live statistics, recent activity, quick actions
- **Departments**: CRUD with search, filter, pagination
- **Doctors**: Registration, department assignment, availability, profile
- **Patients**: Registration, medical history, search, profile
- **Appointments**: Booking, scheduling, status management, conflict prevention
- **Medical Records**: Clinical notes, diagnosis, treatment, linked to appointments
- **Prescriptions**: Dynamic medicine items, linked to medical records, printable
- **Billing**: Invoice generation, payment tracking, printable invoices

## Getting Started

### Prerequisites

- Node.js 20.9+
- npm
- Git

### Installation

```bash
git clone <repository-url>
cd smart-hospital-system
npm install
cp .env.example .env.local
# Edit .env.local with your credentials
npm run db:generate
npm run db:migrate
npm run dev
```

### Environment Variables

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"
```

### Cloud Service Setup

1. **Neon**: Create a project at [neon.tech](https://neon.tech) and copy the connection string
2. **Clerk**: Create an application at [clerk.com](https://clerk.com) and copy the API keys
3. **Vercel** (optional): Import from GitHub at [vercel.com](https://vercel.com)

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema changes
npm run db:studio    # Open Prisma Studio
```

## Project Structure

```
app/
├── (auth)/                    # Sign-in, sign-up pages
├── (dashboard)/               # Protected dashboard routes
│   ├── dashboard/             # Live dashboard with stats
│   ├── departments/           # Department management
│   ├── doctors/               # Doctor management
│   ├── patients/              # Patient management
│   ├── appointments/          # Appointment scheduling
│   ├── medical-records/       # Clinical records
│   ├── prescriptions/         # Prescription management
│   └── billing/               # Billing & invoicing
└── api/webhook/clerk/         # Clerk user sync

components/
├── layouts/                   # Sidebar, TopNav, Breadcrumb
├── shared/                    # Reusable components
├── tables/                    # DataTable component
└── ui/                        # shadcn/ui components

actions/                       # Server actions
lib/                           # Utilities, Prisma, validations
prisma/                        # Database schema & migrations
```

## User Roles

| Role | Description |
|------|-------------|
| Administrator | Full system access, manages hospital |
| Doctor | Clinical operations, patient care |
| Receptionist | Patient registration, appointments |
| Patient | View own records, book appointments |

## Database

- **Platform**: Neon (managed PostgreSQL)
- **ORM**: Prisma 7
- **Models**: User, Department, Doctor, Patient, Appointment, MedicalRecord, Prescription, PrescriptionItem, Bill

## Deployment

The application is configured for deployment on Vercel:

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy

Vercel automatically builds and deploys on every push to the main branch.

## Version 2 Roadmap

- Laboratory Management
- Pharmacy Management
- Inventory Management
- Bed Management
- Notification Center
- Analytics Dashboard
- Mobile Application
- AI Integration

## License

This project is developed as part of the Xeta Labs Internship Program.
