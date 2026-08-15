# Smart Hospital Digitalization System (SHDS)

A state-of-the-art, enterprise-grade digital healthcare platform built with **Next.js 16 (App Router & Turbopack)**, **Supabase PostgreSQL**, **Prisma 7 ORM**, **Zod**, **Resend**, and **Tailwind CSS 4**.

---

## 🌟 Overview

**Smart Hospital Digitalization System (SHDS)** transforms traditional hospital management into a seamless, automated, and secure digital experience. Designed for high efficiency and intuitive patient care, SHDS supports **5 Granular Roles** (*Super Admin*, *Department Admin*, *Doctor*, *Receptionist*, *Patient*) and digitizes the full medical lifecycle from appointment scheduling to bed allocation, prescription issuing, grievance tracking, and invoice payment.

---

## 📚 Documentation

- **[Developer Guide](Developer_Guide.md)** — Comprehensive step-by-step developer onboarding, database setup, project architecture, and feature implementation handbook.

---

## 🛠 Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router + Turbopack) | Server Components, Server Actions & Route Handlers |
| **Database** | Supabase PostgreSQL | Scalable, high-performance cloud PostgreSQL |
| **ORM & Driver** | Prisma 7 + `@prisma/adapter-pg` | Type-safe database client and migration manager |
| **Styling** | Tailwind CSS 4 + `tw-animate-css` | Modern glassmorphism, responsive UI tokens & dark mode |
| **UI Components** | Radix UI / shadcn/ui + Lucide Icons | Accessible, high-contrast UI design system |
| **Authentication** | Custom JWT + Google OAuth + OTP | Secure HTTP-only cookies, password hashing (`bcryptjs`) |
| **Email Delivery** | Resend API | Password reset flows & automated system emails |
| **Validation** | Zod + React Hook Form | Type-safe runtime input validation & error feedback |
| **Data Tables** | TanStack Table v8 | Dynamic sorting, filtering, searching & pagination |
| **Notifications** | Sonner + Custom Event Dispatcher | Real-time toasts & persistent bell notifications |

---

## ✨ Key Features

### 🔐 Authentication & Role-Based Access Control (RBAC)
- **Secure Authentication**: Custom JWT authentication with HTTP-only cookie storage (`proxy.js` route protection).
- **Google OAuth Integration**: One-click Google Sign-In with automated account linking.
- **OTP Verification & Resend Password Reset**: Email verification codes and single-use password reset tokens with automated expiration.
- **5 Granular Roles**:
  - `SUPER_ADMIN`: Complete system oversight, global analytics, registration code generation.
  - `ADMIN`: Department-level management, grievance escalation, staff oversight.
  - `DOCTOR`: Clinical care, patient consultation notes, prescription issuance.
  - `RECEPTIONIST`: Patient registration, appointment booking, billing payments.
  - `PATIENT`: Appointment booking, medical record access, billing history, feedback submission.

### 📅 Appointment Scheduling
- **3-Step Interactive Booking Wizard**: Step-by-step patient selection, doctor selection, and date/time schedule selection.
- **Categorized Time Slots**: Organized into **Morning**, **Afternoon**, and **Evening** slot groups.
- **Past Time Guard**: Past time slots on the current day are automatically disabled, greyed out, and guarded server-side to prevent double/past bookings.

### 🛏 Bed & Ward Management
- Live bed availability tracking across General, Semi-Private, Private, ICU, and NICU wards.
- Automated bed status logs (`VACANT`, `OCCUPIED`, `RESERVED`, `NEEDS_CLEANING`).

### 📋 Grievances & Feedback System
- Public Kiosk & authenticated feedback submission with SLA deadline tracking.
- Automated multi-level escalation workflow for unresolved complaints (`LEVEL_1_DEPT_HEAD` to `LEVEL_3_SUPER_ADMIN`).

### 🩺 Clinical Records & Prescriptions
- Comprehensive medical records linked to patient consultation history.
- Printable digital prescriptions with multi-medicine item management.

### 💳 Billing & Printable Invoices
- Automatic invoice generation for consultations and additional charges.
- Payment tracking (`CASH`, `CARD`, `UPI`) with crisp, high-contrast printable PDF invoices (`@media print` color adjustments).

### 🔔 Targeted Real-Time Notifications
- Bell notification drawer with instant event dispatching for appointments, bills, prescriptions, and grievances.
- `localStorage` read-state persistence to prevent duplicate notification alerts.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.9.0 or higher
- **Package Manager**: `npm` (v10+)
- **Database**: Supabase PostgreSQL project

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AradhyaRay05/Smart-Hospital-Syatem.git
   cd smart-hospital-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   # Supabase Database Connections
   DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

   # Authentication Secrets
   JWT_SECRET="your-secure-jwt-secret"
   JWT_ALGORITHM="HS256"
   JWT_EXPIRES_IN_MINUTES="12506"

   # Google OAuth Credentials
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Resend Email Configuration
   RESEND_API_KEY="re_your_resend_api_key"
   RESEND_FROM_EMAIL="Smart Hospital Digitalisation System <no-reply@yourdomain.com>"
   PASSWORD_RESET_TOKEN_EXPIRES_MINUTES="5"

   # App Configuration
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   SUPER_ADMIN_EMAIL="admin@shds.com"
   ```

4. **Initialize Database & Generate Prisma Client**:
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `next dev` | Start development server with Turbopack |
| `npm run build` | `next build` | Build production application bundle |
| `npm run start` | `next start` | Launch production server |
| `npm run lint` | `next lint` | Run ESLint static code analysis |
| `npm run db:push` | `npx prisma db push` | Push Prisma schema directly to Supabase DB |
| `npm run db:generate` | `npx prisma generate` | Rebuild type-safe Prisma Client |
| `npm run db:studio` | `npx prisma studio` | Launch visual database GUI in browser |

---

## 📂 Project Architecture

```
smart-hospital-system/
├── actions/                   # Next.js Server Actions (Auth, Appointments, Billing, etc.)
├── app/                       # Next.js 16 App Router Routes
│   ├── (auth)/                # Sign-In, Sign-Up, Forgot & Reset Password pages
│   ├── (dashboard)/           # Protected Dashboard layout & feature modules
│   │   ├── appointments/      # Appointment booking & calendar management
│   │   ├── beds/              # Ward & Bed allocation
│   │   ├── billing/           # Invoice generation & payment tracking
│   │   ├── departments/       # Department CRUD
│   │   ├── doctors/           # Doctor profiles & availability
│   │   ├── feedback/          # Grievance kiosk & staff management dashboard
│   │   ├── medical-records/   # Patient clinical records
│   │   ├── patients/          # Patient onboarding & medical history
│   │   └── prescriptions/     # Prescription management
│   ├── api/                   # OAuth Callbacks & Webhook endpoints
│   └── globals.css            # Tailwind 4 CSS tokens & @media print styles
├── components/                # Reusable UI Components & Feature Modals
│   ├── feedback/              # Grievance forms & management components
│   ├── layouts/               # TopNav, Sidebar, Footer layout components
│   ├── shared/                # PageHeader, FormSelect, StatCard components
│   ├── tables/                # TanStack DataTable component
│   └── ui/                    # shadcn/ui primitive components
├── lib/                       # Core utilities (Auth JWT, Prisma Client, Guards, Resend)
├── prisma/                    # Prisma Schema (`schema.prisma`) & migrations
├── proxy.js                   # Next.js Edge Middleware for Route Protection
├── requirements.txt           # Project dependency manifest
├── Developer_Guide.md         # Comprehensive Developer Onboarding Guide
└── README.md                  # System Documentation
```

---

## 📄 License

Developed as part of the **Xeta Labs Internship Program**. All rights reserved.
