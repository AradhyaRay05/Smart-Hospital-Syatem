# 🛠 SHDS Developer Guide: Step-by-Step Development Handbook

Welcome to the **Smart Hospital Digitalization System (SHDS)** Developer Guide. This document provides a step-by-step walkthrough for setting up your environment, understanding the architecture, and extending or building new features within the SHDS codebase.

---

## 📌 Table of Contents
1. [Development Environment Setup](#1-development-environment-setup)
2. [Database Setup & Supabase Integration](#2-database-setup--supabase-integration)
3. [Core Architectural Concepts](#3-core-architectural-concepts)
4. [Directory & File Conventions](#4-directory--file-conventions)
5. [Step-by-Step Feature Implementation Guide](#5-step-by-step-feature-implementation-guide)
6. [Authentication & Security Protocols](#6-authentication--security-protocols)
7. [Testing, Linting & Verification](#7-testing-linting--verification)
8. [Deployment Workflow](#8-deployment-workflow)

---

## 1. Development Environment Setup

### 1.1 Prerequisites
Ensure your local development machine has the following tools installed:
- **Node.js**: `v20.9.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm**: `v10.0.0` or higher
- **Git**: `v2.40` or higher
- **IDE**: Visual Studio Code (Recommended Extensions: *ESLint*, *Tailwind CSS IntelliSense*, *Prisma*)

### 1.2 Initial Repository Setup
```bash
# 1. Clone the repository
git clone https://github.com/AradhyaRay05/Smart-Hospital-Syatem.git
cd smart-hospital-system

# 2. Install npm dependencies
npm install

# 3. Copy sample environment file
cp .env.example .env
```

---

## 2. Database Setup & Supabase Integration

SHDS uses **Supabase PostgreSQL** managed via **Prisma 7 ORM** with `@prisma/adapter-pg`.

### 2.1 Supabase Connection Strings
Open `.env` and fill in your Supabase connection strings from your Supabase project (*Settings -> Database*):

```env
# Transaction Pooler URL (Port 6543) - Used for app runtime queries
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct Connection URL (Port 5432) - Required for Prisma schema push & migrations
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

> **Note on Special Characters**: If your database password contains special characters like `@`, `%`, `#`, or `$`, ensure you percent-encode them (e.g., `@` becomes `%40`). Do NOT wrap passwords in literal brackets `[]`.

### 2.2 Prisma Commands
```bash
# Push schema changes to Supabase
npm run db:push

# Generate type-safe Prisma Client (outputs to app/generated/prisma)
npm run db:generate

# Open visual database explorer
npm run db:studio
```

---

## 3. Core Architectural Concepts

### 3.1 Next.js 16 App Router & Server Actions
SHDS uses Next.js Server Actions (`actions/`) for data mutations and fetching instead of REST endpoints:
- **Client Components** (`"use client"`) handle UI rendering, user input, and state.
- **Server Actions** (`"use server"`) execute securely on the server with direct database access via Prisma.

### 3.2 Security & Action Guards (`lib/guards.js`)
All Server Actions MUST wrap execution inside `guardAction()` to enforce Role-Based Access Control (RBAC):

```javascript
import { guardAction } from "@/lib/guards";
import { prisma } from "@/lib/prisma";

export async function createMedicalRecord(data) {
  // Enforce resource permission (e.g., medical_records -> create)
  const { user, role } = await guardAction("medical_records", "create");

  // Perform business logic & DB operations
  const record = await prisma.medicalRecord.create({ data });
  return { success: true, data: record };
}
```

### 3.3 Route Middleware Protection (`proxy.js`)
`proxy.js` acts as Edge Middleware intercepting incoming HTTP requests:
- Public paths (`/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`, `/feedback`) are allowed unauthenticated.
- Protected dashboard routes (`/dashboard`, `/appointments`, `/billing`, etc.) check for a valid `auth_token` JWT cookie. Unauthenticated requests are automatically redirected to `/sign-in`.

---

## 4. Directory & File Conventions

| Path | Description |
| :--- | :--- |
| `actions/` | Next.js Server Actions grouped by domain (`appointments.js`, `billing.js`, `feedback.js`, etc.). |
| `app/(auth)/` | Public authentication pages (`sign-in/`, `sign-up/`, `forgot-password/`, `reset-password/`). |
| `app/(dashboard)/` | Main application dashboard layout and feature routes. |
| `components/layouts/` | Core layout elements: `<TopNav />`, `<Sidebar />`, `<Footer />`. |
| `components/shared/` | Shared UI elements: `<PageHeader />`, `<FormSelect />`, `<StatCard />`. |
| `components/tables/` | TanStack `<DataTable />` reusable pagination and sorting wrapper. |
| `components/ui/` | Primitive UI components (`button.jsx`, `card.jsx`, `dialog.jsx`, `input.jsx`). |
| `lib/auth/` | JWT token generation, verification, and cookie utilities. |
| `lib/prisma.js` | Prisma Client singleton using `@prisma/adapter-pg` and `pg.Pool`. |
| `lib/email.js` | Resend API email delivery helpers. |

---

## 5. Step-by-Step Feature Implementation Guide

When adding a new feature (e.g., **Pharmacy Management**), follow this standard 5-step workflow:

### Step 1: Define the Data Model in `prisma/schema.prisma`
Add your model definition with proper relations, indexes, and timestamp fields:

```prisma
model Medicine {
  id          String   @id @default(cuid())
  name        String
  category    String
  stock       Int      @default(0)
  unitPrice   Float
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Run schema update commands:
```bash
npm run db:push
npm run db:generate
```

### Step 2: Create Zod Validation Schemas
Define runtime validation schemas to parse and validate incoming form data:

```javascript
import { z } from "zod";

export const medicineSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.string().min(1, "Category is required"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  unitPrice: z.coerce.number().min(0, "Price must be positive"),
});
```

### Step 3: Implement Server Actions (`actions/pharmacy.js`)
Build type-safe Server Actions guarded by `guardAction`:

```javascript
"use server";

import { prisma } from "@/lib/prisma";
import { guardAction } from "@/lib/guards";
import { revalidatePath } from "next/cache";

export async function addMedicine(rawData) {
  try {
    const { user } = await guardAction("pharmacy", "create");

    const medicine = await prisma.medicine.create({ data: rawData });

    revalidatePath("/pharmacy");
    return { success: true, message: "Medicine added successfully", data: medicine };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
```

### Step 4: Build the Frontend Page & UI Component
Create the page under `app/(dashboard)/pharmacy/page.jsx` using `PageHeader`, `DataTable`, and `sonner` toasts:

```jsx
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PharmacyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pharmacy Inventory"
        description="Manage hospital medicines and stock levels"
        breadcrumbs={[{ label: "Pharmacy" }]}
      />
      {/* UI Table & Action Modals */}
    </div>
  );
}
```

### Step 5: Add Real-Time Notification Dispatchers (Optional)
If your action produces an alert or notification, dispatch the custom refresh event:

```javascript
if (result.success) {
  toast.success(result.message);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("refresh-notifications"));
  }
}
```

---

## 6. Authentication & Security Protocols

- **Password Hashing**: Always hash passwords using `bcryptjs` before database insertion (`bcrypt.hash(password, 10)`).
- **JWT Cookies**: JWT tokens contain `{ id, email, role }` and are stored in HTTP-only cookies (`auth_token`).
- **Resend Email Tokens**: Password reset tokens expire in 5 minutes and are marked `used: true` upon consumption.

---

## 7. Testing, Linting & Verification

Before submitting code, ensure the following verification steps pass cleanly:

```bash
# 1. Run ESLint code checks
npm run lint

# 2. Test development build with Turbopack
npm run dev

# 3. Test production build
npm run build
```

---

## 8. Deployment Workflow

1. **GitHub Push**: Push your verified commits to the `main` branch:
   ```bash
   git add .
   git commit -m "feat: Add pharmacy inventory module"
   git push origin main
   ```
2. **Vercel Integration**: Vercel automatically detects the push and triggers a production build.
3. **Environment Variables**: Ensure all variables from `.env` are configured in your Vercel Project Settings (*Settings -> Environment Variables*).

---

Happy Coding! 🚀 If you encounter issues, refer to `README.md` or contact the SHDS core team.
