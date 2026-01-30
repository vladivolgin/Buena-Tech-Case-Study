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
