# Workbench Architecture

This document outlines the architectural decisions, technology stack, and permission resolution design implemented for **Workbench**—a custom Role-Based Access Control (RBAC) admin dashboard.

---

## 🛠️ Technology Stack Decisions

### 1. Frontend & Backend: Next.js (App Router)
* **Unified Stack**: Using Next.js enables a cohesive codebase where the frontend components and backend API routes live together. This satisfies the requirement of TypeScript on both sides without the overhead of maintaining separate dev environments.
* **Serverless Route Handlers**: API endpoints are built using Next.js Route Handlers (`src/app/api/...`), providing a clean, RESTful contract for fetching and mutating data.
* **TypeScript Throughout**: Strong typing across components (`src/components/...`), backend endpoints, types (`src/lib/types.ts`), and operations.

### 2. Styling: Tailwind CSS & Lucide Icons
* **Tailwind CSS**: Offers rapid styling with a highly customized dark theme (`Zinc-950` background, custom borders, transitions, and hover-states) matching modern SaaS design patterns.
* **Lucide React**: Provides clean, professional SVG icons that elevate the visual interface.

### 3. Data Persistence: Server In-Memory State
* **In-Memory Store**: As permitted by the constraints (*"in-memory is totally fine, no database required"*), all active state resides in server RAM ([store.ts](file:///c:/Users/hksub/Desktop/workbench/src/lib/store.ts)).
* **Dev Server Preservation**: In Next.js, hot-reloading often wipes global variables. We preserve the state across live-reloads by attaching it to the Node `global` namespace (`global.__users_store` / `global.__roles_store`), ensuring your edits persist seamlessly as you test.

---

## 🔐 Permission Overlap Strategy

### Multi-Role Permission Resolution (Additive Union)
When a user is assigned **multiple roles**, their effective permissions are resolved using an **Additive Union** approach:
* **Rule**: If **any** of the user's assigned roles contains a specific permission, the user gets that permission.
* **Reasoning**: In enterprise RBAC, permissions are typically additive. If a user is both a *Billing Admin* (who can edit Billing) and a *Project Viewer* (who can view Projects), they should have the permissions of both roles. Subtracting or overriding permissions usually introduces complexity that makes permission auditing confusing for admins.

#### Resolution Algorithm
The resolution is computed on-demand via the `/api/users/[id]/permissions` endpoint:
```typescript
export function getMergedPermissionsForUser(user: User, rolesList: Role[]): string[] {
  const userRoles = rolesList.filter(role => user.roleIds.includes(role.id));
  const allPermissions = userRoles.flatMap(role => role.permissions);
  // De-duplicate the array of permission keys (e.g. "projects.view")
  return Array.from(new Set(allPermissions));
}
```

---

## 📁 Directory Structure
* `src/app/` - Next.js page routing and dynamic route segments.
* `src/app/api/` - RESTful backend API routes.
* `src/components/` - Highly polished modular UI components (Topbar, Roles, Users).
* `src/lib/` - Shared types, mock data, permission resolution algorithms, and store state management.
