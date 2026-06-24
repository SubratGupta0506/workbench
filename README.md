# 🏗️ Workbench — Role & Permission Builder

## 🔗 Live Demo — [workbench-topaz.vercel.app](https://workbench-topaz.vercel.app)

> A SaaS admin dashboard that lets team admins create **custom roles**, assign **granular permissions**, and manage **user access** — all through a clean, modern UI with zero code changes.

---

## 📋 Table of Contents

1. [What Is This?](#-what-is-this)
2. [Quick Start](#-quick-start)
3. [Full User Flow](#-full-user-flow)
   - [Home Page](#1-home-page---)
   - [Roles Management](#2-roles-management---)
   - [Users Management](#3-users-management---)
   - [User Detail & Permissions](#4-user-detail--effective-permissions---)
4. [Reviewer Guide](#-reviewer-guide-start-here)
5. [Tech Stack](#-tech-stack)
6. [Project Structure](#-project-structure)

---

## 🎯 What Is This?

**Workbench** solves a common SaaS problem: every team has different access needs, but most platforms offer only fixed roles (Owner, Admin, Member, Viewer).

With Workbench, a team admin can:

- ✅ Create any custom role with any name (e.g. "Contractor", "Project Lead", "Billing Only")
- ✅ Toggle exactly which actions that role can take — per resource, per action
- ✅ Assign multiple roles to a single user
- ✅ Instantly see a user's **effective merged permissions** from all their roles

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open in your browser
http://localhost:3000
```

> No database setup needed. The app uses an in-memory store seeded with mock users and roles so you can explore immediately.

---

## 🗺️ Full User Flow

### 1. Home Page — `/`

**What you see:** A polished dashboard landing page with an overview of what Workbench does and quick navigation to the two core sections — Roles and Users.

**What to do:**
- Read the product summary to understand the context
- Use the top navigation bar to move between **Roles** and **Users**
- Toggle between **Dark / Light mode** using the button in the top-right corner

---

### 2. Roles Management — `/roles`

**What you see:** A card-based list of all existing roles. Each card shows the role name, description, number of permissions, and action buttons.

#### Creating a New Role

1. Click the **"+ Create Role"** button in the top-right
2. A modal dialog opens
3. Enter a **Role Name** (e.g. `"Contractor"`)
4. Enter an optional **Description** (e.g. `"Can view projects but cannot edit or delete"`)
5. In the **Permissions Matrix**, you will see 5 resource groups:
   - Projects · Users · Billing · Reports · Settings
6. Each resource has 4 action toggles: **View · Create · Edit · Delete**
7. Check individual permissions OR click **"Select All"** on a resource row to grant all 4 actions at once
8. Click **"Create Role"** — the new role appears instantly in the list

#### Editing a Role

1. On any role card, click the **pencil (edit) icon**
2. The same modal opens pre-filled with the current name, description, and permissions
3. Make your changes and click **"Save Changes"**

#### Deleting a Role

1. On any role card, click the **trash (delete) icon**
2. The role is removed immediately

> **Note:** The 4 default system roles (Owner, Admin, Member, Viewer) can be edited and deleted just like custom roles.

---

### 3. Users Management — `/users`

**What you see:** A searchable, filterable table of all users with their name, email, avatar, assigned roles, and a status badge.

#### Browsing Users

- The table shows all users with their **role badges** displayed inline
- Use the **search bar** to filter users by name or email
- Use the **role filter dropdown** to show only users with a specific role

#### Editing a User Profile

1. Click on a user row or the **edit icon** to open the **User Profile Dialog**
2. Update the user's **Name**, **Email**, or **Avatar URL**
3. Click **"Save Changes"**

#### Assigning / Removing Roles

1. Open the User Profile Dialog for any user
2. In the **"Assigned Roles"** section, you see all currently assigned roles
3. Click **"+ Add Role"** and select from the available roles dropdown
4. To remove a role, click the **× icon** next to the role badge
5. Changes save instantly

#### Viewing a User's Profile Page

- Click the **"View Profile →"** button on any user row
- This takes you to the full user detail page at `/users/[id]`

---

### 4. User Detail & Effective Permissions — `/users/[id]`

**What you see:** A dedicated page for a single user showing their profile, all assigned roles, and — most importantly — their **computed effective permissions**.

#### Understanding Effective Permissions

When a user has **multiple roles**, their permissions are merged using **Additive Union**:

> If *any* of their roles grants a permission, the user has it.

**Example:**

| Role | Permissions |
|---|---|
| Project Editor | `projects.view` + `projects.edit` |
| Report Viewer | `reports.view` |
| **Effective (Union)** | `projects.view` + `projects.edit` + `reports.view` |

#### What to Try Here

1. Navigate to any user — e.g. **Alice** — who has 2 or more roles assigned
2. Scroll down to see the **Effective Permissions** table
3. Each resource is shown as a row, and each action (`view`, `create`, `edit`, `delete`) shows a ✅ or ✗
4. Go back, add a second role to the same user, return — watch the permissions update in real-time

---

## 👀 Reviewer Guide (Start Here)

**If you are reviewing this project**, here is the most efficient path to evaluate all features in under 5 minutes:

### Step 1 — Run the app
```bash
npm install && npm run dev
# Open: http://localhost:3000
```

### Step 2 — Create a custom role
1. Go to **`/roles`**
2. Click **"+ Create Role"**
3. Name it `"Contractor"`
4. Grant only: `projects.view` and `reports.view`
5. Click **"Create Role"** → confirm it appears in the list

### Step 3 — Assign it to a user
1. Go to **`/users`**
2. Click any user (e.g. **Bob**)
3. In the dialog, click **"+ Add Role"** → select `"Contractor"`
4. Also keep any existing role on the user

### Step 4 — Check effective permissions
1. Click **"View Profile →"** for Bob
2. On `/users/[id]`, scroll to the **Effective Permissions** section
3. Confirm it shows the **union** of all assigned roles' permissions

### Step 5 — Edit and verify
1. Go back to **`/roles`** → edit the `"Contractor"` role → add `projects.edit`
2. Return to Bob's profile page → confirm `projects.edit` now shows as ✅

> This flow exercises: Role CRUD → Permission Matrix → User Role Assignment → Permission Resolution Engine — all core requirements.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| State | Node.js global in-memory store |
| Rendering | React Server + Client Components |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── roles/page.tsx        # Roles management
│   ├── users/page.tsx        # Users list
│   ├── users/[id]/page.tsx   # User detail + effective permissions
│   └── api/                  # REST API route handlers
│       ├── roles/            # GET, POST, PUT, DELETE /api/roles
│       └── users/            # GET, PUT + role assignment + permissions
├── components/
│   ├── layout/Topbar.tsx     # Navigation bar
│   ├── roles/
│   │   ├── RoleFormDialog.tsx    # Create/Edit role modal
│   │   └── PermissionsMatrix.tsx # Permission toggle grid
│   └── users/
│       ├── UserProfileDialog.tsx        # Edit user + assign roles
│       ├── RoleBadge.tsx                # Role display pill
│       └── EffectivePermissionsTable.tsx # Merged permissions view
└── lib/
    ├── types.ts        # User, Role, Permission interfaces
    ├── permissions.ts  # Permission key definitions
    ├── mockData.ts     # Seed data
    └── store.ts        # In-memory server state
```

For full technical details, see [Architecture.md](./Architecture.md).

---

*Built with Next.js · TypeScript · Tailwind CSS*
