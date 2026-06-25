// src/lib/mockData.ts
import { Role, User } from "./types"

export const PERMISSIONS_MATRIX = [
  { resource: "Projects", actions: ["view","create","edit","delete","archive"] },
  { resource: "Tasks", actions: ["view","create","edit","delete","assign"] },
  { resource: "Members", actions: ["view","invite","remove","update_role"] },
  { resource: "Billing", actions: ["view","update","download_invoices"] },
  { resource: "Settings", actions: ["view","update"] },
]

export const mockRoles: Role[] = [
  {
    id: "1",
    name: "Admin",
    description: "Full system access",
    permissions: [
      "projects.view","projects.create","projects.edit",
      "projects.delete","projects.archive",
      "tasks.view","tasks.create","tasks.edit",
      "tasks.delete","tasks.assign",
      "members.view","members.invite",
      "members.remove","members.update_role",
      "billing.view","billing.update","billing.download_invoices",
      "settings.view","settings.update"
    ],
    createdAt: "Jan 12, 2024"
  },
  {
    id: "2",
    name: "Member",
    description: "Standard team access",
    permissions: [
      "projects.view","projects.create","projects.edit",
      "tasks.view","tasks.create","tasks.edit","tasks.assign",
      "members.view"
    ],
    createdAt: "Jan 12, 2024"
  },
  {
    id: "3",
    name: "Contractor",
    description: "Read-only project access",
    permissions: ["projects.view","tasks.view"],
    createdAt: "Feb 3, 2024"
  },
  {
    id: "4",
    name: "Billing Viewer",
    description: "Billing access only",
    permissions: ["billing.view","billing.update","billing.download_invoices"],
    createdAt: "Mar 7, 2024"
  }
]

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    email: "rahul@workbench.com",
    avatar: "RS",
    roleIds: ["1", "4"], // Admin + Billing Viewer
    title: "SaaS Administrator",
    joinDate: "Jan 12, 2024",
    location: "Mumbai, India",
    department: "Management"
  },
  {
    id: "2",
    name: "Priya Nair",
    email: "priya@workbench.com",
    avatar: "PN",
    roleIds: ["2"], // Member
    title: "Lead Engineer",
    joinDate: "Jan 12, 2024",
    location: "Bangalore, India",
    department: "Engineering"
  },
  {
    id: "3",
    name: "Kiran Rao",
    email: "kiran@workbench.com",
    avatar: "KR",
    roleIds: ["3"], // Contractor
    title: "Operations Lead",
    joinDate: "Feb 3, 2524",
    location: "Hyderabad, India",
    department: "Operations"
  },
  {
    id: "4",
    name: "Anjali Mehta",
    email: "anjali@workbench.com",
    avatar: "AM",
    roleIds: ["1"], // Admin
    title: "Product Designer",
    joinDate: "Mar 7, 2024",
    location: "Delhi, India",
    department: "Design"
  }
]