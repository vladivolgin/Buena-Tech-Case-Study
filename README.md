# Buena-Tech-Case-Study

# Property Management Dashboard

This repository contains a full-stack property management prototype built with **Next.js (App Router)** and **NestJS**, using **PostgreSQL** as the database and **Prisma ORM** for data access.

The project demonstrates a clean and scalable approach to building a **Property Management Dashboard** with a **draft-based creation flow**, a **multi-step wizard**, and a clear **Property → Buildings → Units** domain model.

The main focus of the project is **architecture, data flow correctness, and predictable UX**, rather than visual polish or feature completeness.

---

## 📌 Project Goals

The primary goals of this project are:

- Design a clear and extensible **real estate domain model**
- Implement a **draft-first creation flow** for complex entities
- Build a **stable dashboard UI** with a multi-step wizard
- Avoid common frontend pitfalls:
  - silent form submit failures
  - hidden HTML validation bugs
  - unclear source-of-truth for data
- Demonstrate production-ready patterns in:
  - NestJS + Prisma
  - Next.js App Router
  - complex form workflows

---

## 🧱 Domain Model
Property
├─ Buildings (1..n)
│   └─ Units (0..n)

### Property
Represents a managed real estate object.

- Can exist in `draft` or `active` state
- Has a management type (`WEG` or `MV`)
- Stores business-level fields:
  - name
  - manager
  - accountant
  - purpose

### Building
Represents a physical building belonging to a property.

- Address-based entity
- Ordered within a property
- Acts as a parent for units

### Unit
Represents an individual unit (apartment, office, parking, etc.).

- Belongs to exactly one building
- Has physical and legal attributes (size, rooms, co-ownership share)

---

## 🗄 Database Overview (PostgreSQL)

The database runs via **Docker** and is designed for a draft-based workflow.

### Properties Table
```sql
properties
- id (uuid, PK)
- unique_number (unique)
- name
- management_type (enum: WEG | MV)
- purpose
- manager_id
- accountant_id
- manager_name
- accountant_name
- teilungserklaerung_file_path
- status (draft | active)
- created_at
- updated_at
```
### BuildingsTable
```sql
buildings
- id (uuid, PK)
- property_id (FK → properties.id)
- street
- house_number
- postal_code
- city
- construction_year
- order_index
- created_at
- updated_at
```
Units Table
```sql
units
- id (PK)
- building_id (FK → buildings.id)
- number
- type (enum: Apartment | Office | Garden | Parking)
- floor
- entrance
- size_sqm
- co_ownership_share
- construction_year
- rooms
- created_at
- updated_at
```

## 🔑 Key Characteristics

This project is built around a set of deliberate architectural and UX decisions aimed at creating a stable and predictable system.

### Draft‑First Workflow
- Properties can exist in a `draft` state
- Drafts allow users to incrementally fill complex data
- No implicit activation — state transitions are explicit

### Single Source of Truth
- Core business fields (`name`, `managementType`, `manager`, `accountant`)
  are stored and read from the backend
- The UI never relies on hardcoded fallbacks once data is provided
- Prevents data divergence between frontend state and database

### Stable Form Handling
- Native HTML validation is fully disabled in wizard forms
- All validation is handled explicitly in JavaScript
- Eliminates silent submit failures in multi-step workflows

### Predictable Navigation
- Submit logic exists only in client components
- Redirects happen strictly after successful `await` of API calls
- No hidden side effects (`useEffect`, server actions, etc.)

### Intentional Scope Control
- No delete flow for properties (removed due to instability at this stage)
- No backend aggregation logic yet
- Focus is on correctness, not feature quantity

---

## 🛠 Tech Stack

### Frontend
- **Next.js (App Router)** — routing, layouts, and data fetching
- **React** — component-based UI
- **TypeScript** — strict typing across the app
- **Chakra UI v3** — accessible, composable UI components

### Backend
- **Node.js** — runtime
- **NestJS** — modular backend framework
- **PostgreSQL** — relational database
- **Prisma ORM** — type-safe database access
- **bcrypt** — password hashing

### Infrastructure
- **Docker / Docker Compose** — local database setup
- **Prisma Migrations** — schema versioning and consistency

---

## 🔧 Backend Architecture

The backend follows a **modular NestJS architecture** with a strong emphasis on
type safety and separation of concerns.

### Core Principles
- Each domain is isolated in its own module
- Prisma is injected via a dedicated `PrismaModule`
- DTOs are strictly separated from entities
- Enums are used consistently for domain concepts
### Backend Structure
```text
backend/
├─ prisma/
│  ├─ schema.prisma
│  ├─ migrations/
│  └─ generated/
├─ src/
│  ├─ app.module.ts
│  ├─ main.ts
│  ├─ prisma/
│  │  ├─ prisma.module.ts
│  │  └─ prisma.service.ts
│  ├─ database/
│  │  ├─ database.module.ts
│  │  └─ seed.sql
│  ├─ properties/
│  │  ├─ dto/
│  │  ├─ properties.controller.ts
│  │  ├─ properties.service.ts
│  │  └─ properties.module.ts
│  ├─ buildings/
│  │  ├─ buildings.controller.ts
│  │  └─ buildings.module.ts
│  ├─ users/
│  │  ├─ dto/
│  │  ├─ users.controller.ts
│  │  ├─ users.service.ts
│  │  └─ users.module.ts
│  └─ health/
│     ├─ health.controller.ts
│     └─ health.module.ts
└─ docker-compose.yml
```

## 🖥 Frontend Overview

The frontend is a **Next.js (App Router)** application responsible for
displaying the Property Dashboard and handling the property creation wizard.

Its main responsibilities are:
- displaying properties and their current state
- guiding the user through a multi-step creation flow
- sending validated data to the backend
- handling navigation and redirects

The frontend does not contain business logic or hidden state —
the backend is the single source of truth.

---

## 📁 Frontend Structure
```text
front/
├─ app/
│  ├─ dashboard/
│  │  ├─ page.tsx
│  │  └─ layout.tsx
│  ├─ properties/
│  │  ├─ create/
│  │  │  └─ page.tsx
│  │  └─ id/
│  │     └─ wizard/
│  │        └─ page.tsx
│  └─ layout.tsx
├─ components/
│  ├─ property/
│  │  ├─ PropertyList.tsx
│  │  ├─ PropertyListItem.tsx
│  │  ├─ PropertyDetailsDialog.tsx
│  │  └─ CreatePropertyButton.tsx
│  ├─ wizard/
│  │  ├─ WizardLayout.tsx
│  │  ├─ WizardForm.tsx
│  │  └─ steps/
│  │     ├─ GeneralInfoStep.tsx
│  │     ├─ BuildingsStep.tsx
│  │     └─ UnitsStep.tsx
│  └─ ui/
│     ├─ provider.tsx
│     ├─ toaster.tsx
│     └─ tooltip.tsx
├─ dto/
├─ models/
├─ services/
└─ public/
```

---

## ✅ What the Frontend Does

- Renders a **property dashboard** with card-based layout
- Displays property status (`draft` / `active`) and management type (`WEG` / `MV`)
- Opens a **property preview dialog** on card click
- Provides entry points to continue or complete a property wizard
- Implements a **multi-step property creation wizard**:
  1. General Info
  2. Buildings
  3. Units
- Validates and submits user input to the backend
- Redirects the user after successful operations

---

## ⚠️ Key Notes

- The frontend disables native HTML validation in wizard forms
- All submit logic runs in client components
- Redirects occur only after successful API calls
- No business logic or aggregation is handled on the frontend

The frontend is intentionally kept **simple, predictable, and stable**.

### Modules Overview

- **PropertiesModule**
  - Draft creation and update logic
  - Core business entity
- **BuildingsModule**
  - Buildings belonging to a property
  - Ordered within a property
- **UnitsModule**
  - Units belonging to buildings
  - Physical and legal attributes
- **UsersModule**
  - Basic user management
  - Password hashing
- **PrismaModule**
  - Centralized Prisma client
- **DatabaseModule**
  - Database initialization and seeding
- **HealthModule**
  - Health check endpoint

### API Design

The backend exposes a simple REST API:
```text
GET    /properties
POST   /properties
GET    /properties/:id
PATCH  /properties/:id
```

Currently the backend exposes endpoints for listing and creating properties, which is enough to power the Property Dashboard and start the creation wizard.
The remaining endpoints for buildings and units follow the same REST structure and can be added incrementally


## ▶️ Local Development Setup

This section describes how to run the project locally for development.

---

### ✅ Prerequisites

Make sure the following tools are installed on your machine:

- **Node.js** `>= 18`
- **npm** or **yarn**
- **Docker**
- **Docker Compose**

---

### 🗄 1. Start PostgreSQL (Docker)

The project uses a local PostgreSQL database running in Docker.

From the root of the repository:
```bash
docker-compose up -d
```
## Backend Setup (NestJS + Prisma)

```bash
cd backend
```
Install dependencies:
```bash
npm install
```
Generate Prisma Client:
```bash
npx prisma generate
```
Run database migrations:
```bash
npx prisma migrate dev
```
(Optional) Seed the database with demo data:
```bash
psql < ./src/database/seed.sql
```
Start the backend in development mode:
```bash
npm run start:dev
```
Backend will be available at:
http://localhost:3000

## Frontend Setup (Next.js)
Open a new terminal and navigate to the frontend folder:
```bash
cd front
```
Install dependencies:
```bash
npm install
```
Start the frontend development server:
```bash
npm run dev
```
Frontend will be available at:
http://localhost:3001

🔍 Health Check
You can verify that the backend is running by opening:
``bash
GET http://localhost:3000/health
``
A successful response confirms that the API and database connection
are working correctly.
