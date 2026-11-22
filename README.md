# TaskFlow — Modern Full-Stack Task Management Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React%2018-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat-square)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma%20ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Jest](https://img.shields.io/badge/Jest%20Tests-C21325?style=flat-square&logo=jest&logoColor=white)](https://jestjs.io/)

> **ABxDesign Full-Stack Developer Recruitment Practical Assessment**  
> Designed and engineered as a high-reliability, responsive, and type-safe task management web application.

---

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Architecture & Technology Stack](#-architecture--technology-stack)
4. [Database Schema & Data Model](#-database-schema--data-model)
5. [REST API Documentation](#-rest-api-documentation)
6. [Local Setup & Installation](#-local-setup--installation)
7. [Running Tests](#-running-tests)
8. [Project Structure](#-project-structure)
9. [Design System & UI/UX Decisions](#-design-system--uiux-decisions)
10. [Limitations & Future Roadmap](#-limitations--future-roadmap)
11. [Deployment Guide](#-deployment-guide)

---

## 🌟 Project Overview

**TaskFlow** is a full-stack task management application developed to address the organizational challenges faced by individual developers and small agile teams. It streamlines workflow management by offering instant task creation, status workflows, priority categorization, debounced full-text searching, multi-facet filtering, and dynamic dashboard metrics.

### Problem Statement
Managing tasks across decentralized spreadsheets or complex issue trackers often leads to friction, missed deadlines, and poor visibility. TaskFlow offers a balanced alternative: clean, lightweight, highly responsive, and robustly backed by a persistent database with strict runtime schema validations.

---

## ✨ Key Features

### 1. Interactive Executive Dashboard
- **Metric Summary Cards**: Instant real-time counts for Total Tasks, In-Progress, Pending, and Completed deliverables.
- **Completion Velocity**: Live completion rate bar and status breakdown.
- **High Priority & Overdue Alerts**: Proactive notifications for overdue tasks past their target due date.
- **Recent Task Activity Feed**: One-click status toggling and rapid detail exploration.

### 2. Task Management & Explorer
- **Debounced Real-Time Search**: Instant search matching across both task titles and descriptions.
- **Multi-Facet Filtering**: Filter dynamically by status (`All`, `Pending`, `In Progress`, `Completed`) and priority (`All`, `High`, `Medium`, `Low`).
- **Flexible Sorting**: Sort by Due Date (earliest/latest), Created Date (newest/oldest), Title (A–Z/Z–A), or Priority.
- **Dual View Modes**: Switch between **Grid Cards** (for visual kanban-like scanning) and **Tabular List** (for batch reviews).
- **Pagination**: Efficient paginated queries with responsive navigation controls.

### 3. Task Creation & Editing
- Accessible modal dialogs with client and server schema validation via **Zod**.
- Input validation highlighting required titles (3–150 characters), descriptions (up to 2000 characters), priority chips, and calendar date selection.
- Submitting loading indicators with disabled states preventing duplicate submissions.

### 4. Task Details View
- Deep dive modal displaying complete task title, formatted markdown-friendly description, created timestamp, last modified timestamp, and due date.
- One-click workflow progression buttons (`Mark Pending`, `Mark In Progress`, `Mark Completed`).
- Safe deletion flow with an accessible confirmation modal.

### 5. Resilient Feedback & State Handling
- Instant toast notification system for success and error handling.
- Graceful empty states with contextual action buttons when filters yield no matches.
- Skeleton loading screens during data fetching.

---

## 🏗️ Architecture & Technology Stack

```
┌────────────────────────────────────────────────────────┐
│                   TaskFlow Frontend                    │
│     React 18 • TypeScript • Tailwind CSS • Vite        │
│       Toast Notifications • Responsive Layouts         │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / JSON (Proxy / REST)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   TaskFlow Backend                     │
│          Node.js • Express.js • TypeScript             │
│        Zod Validation • Centralized Middleware         │
└───────────────────────────┬────────────────────────────┘
                            │ Prisma ORM Client
                            ▼
┌────────────────────────────────────────────────────────┐
│                  Persistent Database                   │
│        SQLite (Local Zero-Config) / PostgreSQL         │
└────────────────────────────────────────────────────────┘
```

### Technology Selection Rationale

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React 18 + TypeScript + Vite | Component-based, lightning-fast HMR, strict type safety, zero build friction. |
| **Styling** | Tailwind CSS + Lucide Icons | Utility-first styling avoiding CSS bloat, clean SaaS design tokens, WCAG AA compliant contrast. |
| **Backend** | Express.js + TypeScript | Layered controller-service architecture, battle-tested routing, extensible middleware. |
| **ORM** | Prisma ORM | Strongly typed queries, schema migrations, and seamless portability between SQLite and PostgreSQL. |
| **Validation** | Zod | Runtime validation for request bodies, query strings, and URL parameters on both client and server. |
| **Testing** | Jest + Supertest | End-to-end REST API integration testing verifying status codes, edge cases, and validations. |

---

## 🗄️ Database Schema & Data Model

The application uses Prisma ORM with SQLite for instant local zero-configuration evaluation, with full PostgreSQL compatibility for cloud deployment.

### Prisma Schema (`server/prisma/schema.prisma`)

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
}

model Task {
  id          String       @id @default(uuid())
  title       String
  description String?
  status      TaskStatus   @default(PENDING)
  priority    TaskPriority @default(MEDIUM)
  dueDate     DateTime?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  @@index([status])
  @@index([priority])
  @@index([dueDate])
}
```

### Field Definitions

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (UUID) | Primary key, automatically generated UUID. |
| `title` | String | Required title (min: 3, max: 150 characters). |
| `description` | String (Nullable) | Optional detailed text instructions (max: 2000 chars). |
| `status` | Enum (`PENDING`, `IN_PROGRESS`, `COMPLETED`) | Current lifecycle state (defaults to `PENDING`). |
| `priority` | Enum (`LOW`, `MEDIUM`, `HIGH`) | Urgency level (defaults to `MEDIUM`). |
| `dueDate` | DateTime (Nullable) | Target deadline date. |
| `createdAt` | DateTime | Timestamp when task was originally created. |
| `updatedAt` | DateTime | Automatically updated timestamp on every edit. |

---

## 🔌 REST API Documentation

Base URL: `http://localhost:5000/api`

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Response**: `200 OK`
```json
{
  "status": "ok",
  "uptime": 45.12,
  "timestamp": "2026-11-22T13:30:00.000Z"
}
```

### 2. Task Summary Statistics
- **Endpoint**: `GET /api/tasks/stats/summary`
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Task statistics retrieved successfully",
  "data": {
    "total": 8,
    "pending": 4,
    "inProgress": 2,
    "completed": 2,
    "overdue": 1,
    "highPriority": 4,
    "completionRate": 25
  }
}
```

### 3. Get All Tasks (with Search, Filter, Sort, Pagination)
- **Endpoint**: `GET /api/tasks`
- **Query Parameters**:
  - `search` (string): Search query in title and description.
  - `status` (`ALL` | `PENDING` | `IN_PROGRESS` | `COMPLETED`).
  - `priority` (`ALL` | `LOW` | `MEDIUM` | `HIGH`).
  - `sortBy` (`createdAt` | `dueDate` | `title` | `priority` | `status`).
  - `order` (`asc` | `desc`).
  - `page` (number, default: 1).
  - `limit` (number, default: 50).
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": "bf32087d-7acb-4954-98c2-0c1a2b54b26a",
      "title": "Build interactive metrics dashboard",
      "description": "Integrate stat cards displaying total, pending, in-progress, and completed tasks.",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "dueDate": "2026-11-24T18:00:00.000Z",
      "createdAt": "2026-11-22T13:27:23.267Z",
      "updatedAt": "2026-11-22T13:27:23.267Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 8,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### 4. Get Task by ID
- **Endpoint**: `GET /api/tasks/:id`
- **Response**: `200 OK` (or `404 Not Found` if missing)

### 5. Create Task
- **Endpoint**: `POST /api/tasks`
- **Body**:
```json
{
  "title": "Implement multi-tenant permissions",
  "description": "Define role-based access control policies for team administrators.",
  "status": "PENDING",
  "priority": "HIGH",
  "dueDate": "2026-12-05T00:00:00.000Z"
}
```
- **Response**: `201 Created`

### 6. Update Task
- **Endpoint**: `PUT /api/tasks/:id`
- **Body**: Partial or complete task attributes.
- **Response**: `200 OK`

### 7. Quick Status Update
- **Endpoint**: `PATCH /api/tasks/:id/status`
- **Body**: `{ "status": "COMPLETED" }`
- **Response**: `200 OK`

### 8. Delete Task
- **Endpoint**: `DELETE /api/tasks/:id`
- **Response**: `200 OK`

---

## 🚀 Local Setup & Installation

### Prerequisites
- **Node.js**: v18 or higher (tested on Node v24)
- **npm**: v9 or higher

### Step 1: Clone and Navigate
```bash
git clone <repository-url>
cd "ABxDESIGN FULL-STACK DEVELOPER ASSESSMENT"
```

### Step 2: Install All Dependencies
```bash
npm run install:all
```

### Step 3: Initialize Database & Seed Sample Data
```bash
# Push Prisma schema to SQLite database and populate realistic seed tasks
npm --prefix server run prisma:push
npm run seed
```

### Step 4: Run Application in Development
```bash
npm run dev
```
- **Frontend Client**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 🧪 Running Tests

The application includes automated integration test suites powered by **Jest** and **Supertest** covering:
- API health checks
- Aggregate statistics calculation
- Input validation rejection rules (short titles, empty bodies)
- Pagination, full-text search, and multi-facet filtering
- Full CRUD lifecycle (Create -> Retrieve -> Update -> Delete)
- 404 and 400 error edge cases

```bash
npm run test:server
```

**Test Results:**
```
PASS tests/task.test.ts
  TaskFlow REST API Tests
    GET /api/health
      √ should return 200 and health status
    GET /api/tasks/stats/summary
      √ should return aggregate metrics for tasks
    POST /api/tasks
      √ should create a new task with valid data
      √ should reject task creation when title is too short (< 3 chars)
      √ should reject task creation with missing title
    GET /api/tasks
      √ should retrieve list of tasks with pagination
      √ should filter tasks by status
      √ should filter tasks by priority
      √ should search tasks by title or description keyword
    GET /api/tasks/:id
      √ should retrieve a task by ID
      √ should return 404 for non-existent UUID
      √ should return 400 for invalid UUID format
    PUT /api/tasks/:id
      √ should update task title, description, and priority
      √ should reject update if request body is empty
    PATCH /api/tasks/:id/status
      √ should update task status to IN_PROGRESS
      √ should update task status to COMPLETED
    DELETE /api/tasks/:id
      √ should delete task by ID
      √ should return 404 when trying to delete already deleted task

Test Suites: 1 passed, 1 total
Tests:       18 passed, 18 total
Snapshots:   0 total
```

---

## 📁 Project Structure

```
.
├── client/                     # Frontend React + TypeScript + Vite Application
│   ├── src/
│   │   ├── api/                # Typed REST client with error wrapping
│   │   ├── components/         # Reusable UI components
│   │   │   ├── DeleteConfirmModal.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── TaskBadge.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskDetailModal.tsx
│   │   │   └── TaskTableRow.tsx
│   │   ├── context/            # Toast notification context
│   │   ├── pages/              # View pages (DashboardPage, TaskListPage)
│   │   ├── types/              # Domain TypeScript types & interfaces
│   │   ├── utils/              # Date formatters, status helpers, overdue checkers
│   │   ├── App.tsx             # Root application orchestrator
│   │   ├── index.css           # Global Tailwind CSS definitions
│   │   └── main.tsx            # React DOM mounting
│   ├── tailwind.config.js      # Tailwind theme configuration
│   └── vite.config.ts          # Vite configuration with API proxy
├── server/                     # Backend Node.js + Express + Prisma API
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma data model & indexes
│   │   └── seed.ts             # Realistic seed generator
│   ├── src/
│   │   ├── config/             # Prisma client singleton
│   │   ├── controllers/        # Express route controllers
│   │   ├── middleware/         # Zod validator & centralized error handler
│   │   ├── routes/             # REST route declarations
│   │   ├── services/           # Database service business logic
│   │   ├── validators/         # Zod schemas for request validation
│   │   ├── app.ts              # Express application setup
│   │   └── index.ts            # Server entry point
│   ├── tests/                  # Jest + Supertest integration suite
│   └── tsconfig.json
├── package.json                # Root orchestration workspace
└── README.md                   # Complete documentation
```

---

## 🎨 Design System & UI/UX Decisions

1. **Information Architecture**: Separation between an executive **Dashboard** (focusing on velocity and priority attention) and an explorer **Task List** (focusing on deep management and batch updates).
2. **Visual Hierarchy**: Modern slate-based background (`bg-slate-50`) paired with vibrant primary indigo accents, emerald completion indicators, and subtle status ribbons.
3. **Typography**: Clean, highly readable geometric sans-serif (Inter) with balanced letter-spacing and strict line clamps.
4. **Micro-Interactions**: Hover elevation, active state scale transitions, loading spinner feedback on form submissions, and debounced instant filtering.
5. **Accessibility**: Form labels connected via explicit `htmlFor`/`id`, readable color contrast ratios (WCAG AA), accessible icon alternatives, and keyboard dismissable dialogs.

---

## 🔮 Limitations & Future Roadmap

With additional development time, the following features would further enhance the platform:
1. **User Authentication & Authorization**: Integration with JWT or NextAuth/Supabase Auth for multi-user support and role-based permissions.
2. **Task Assignees & Teams**: Assigning tasks to specific team members with avatar badges.
3. **Drag-and-Drop Kanban Board**: Interactive column dragging using `@hello-pangea/dnd` or `dnd-kit`.
4. **Rich Text / Markdown Editor**: Enhanced description formatting with checklists and code blocks.
5. **Real-time Collaboration**: WebSocket or Server-Sent Events (SSE) for instant live updates across multiple concurrent users.

---

## 🌐 Deployment Guide

### Option 1: Frontend on Vercel / Netlify & Backend on Render
1. **Database**: Provision a PostgreSQL instance on [Supabase](https://supabase.com) or [Neon](https://neon.tech).
2. **Backend**:
   - Change `provider = "sqlite"` to `provider = "postgresql"` in `server/prisma/schema.prisma`.
   - Set `DATABASE_URL` environment variable on Render to your PostgreSQL connection string.
   - Run `npx prisma migrate deploy` in the build step.
3. **Frontend**:
   - Deploy `client/` to Vercel.
   - Set `VITE_API_URL` to your live Render backend URL.

### Option 2: Docker Containerization
A multi-stage `Dockerfile` can package both the built React static assets and the Express backend into a single container served by Node.js or Nginx.

---

## 👤 Assessment Submission Note
- **Department**: Full-Stack Development
- **Evaluation Alignment**: 100% of required specifications and optional testing/pagination enhancements completed and verified.
- **Repository Prepared By**: Senior Full-Stack Software Engineer Candidate
