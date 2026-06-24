// src/lib/store.ts
import { User, Role } from "./types"
import { mockRoles, mockUsers } from "./mockData"

// Using global bindings to prevent Next.js hot-reloading from wiping the store in development
declare global {
  var __users_store: User[] | undefined
  var __roles_store: Role[] | undefined
}

if (!global.__users_store) {
  global.__users_store = JSON.parse(JSON.stringify(mockUsers))
}
if (!global.__roles_store) {
  global.__roles_store = JSON.parse(JSON.stringify(mockRoles))
}

const users = global.__users_store as User[]
const roles = global.__roles_store as Role[]

// Roles CRUD operations
export function getRoles(): Role[] {
  return roles
}

export function addRole(roleData: Omit<Role, "id" | "createdAt">): Role {
  const newRole: Role = {
    id: String(Date.now()),
    name: roleData.name,
    description: roleData.description,
    permissions: roleData.permissions,
    createdAt: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  }
  roles.push(newRole)
  return newRole
}

export function updateRole(id: string, roleData: Partial<Omit<Role, "id" | "createdAt">>): Role | null {
  const roleIndex = roles.findIndex((r) => r.id === id)
  if (roleIndex === -1) return null

  const updatedRole = {
    ...roles[roleIndex],
    ...roleData,
  }
  roles[roleIndex] = updatedRole
  return updatedRole
}

export function deleteRole(id: string): boolean {
  const roleIndex = roles.findIndex((r) => r.id === id)
  if (roleIndex === -1) return false

  roles.splice(roleIndex, 1)

  // Clean up: remove this role ID from all users who had it assigned
  users.forEach((user) => {
    user.roleIds = user.roleIds.filter((roleId) => roleId !== id)
  })

  return true
}

// Users operations
export function getUsers(): User[] {
  return users
}

export function assignRoleToUser(userId: string, roleId: string): User | null {
  const user = users.find((u) => u.id === userId)
  if (!user) return null

  // Ensure role exists
  const roleExists = roles.some((r) => r.id === roleId)
  if (!roleExists) return null

  // Prevent duplicate assignments
  if (!user.roleIds.includes(roleId)) {
    user.roleIds.push(roleId)
  }

  return user
}

export function removeRoleFromUser(userId: string, roleId: string): User | null {
  const user = users.find((u) => u.id === userId)
  if (!user) return null

  user.roleIds = user.roleIds.filter((id) => id !== roleId)
  return user
}

export function updateUserProfile(
  userId: string,
  userData: Partial<Omit<User, "id" | "roleIds" | "avatar">>
): User | null {
  const userIndex = users.findIndex((u) => u.id === userId)
  if (userIndex === -1) return null

  // Calculate new avatar initials if name changes
  let avatarUpdate = {}
  if (userData.name) {
    const initials = userData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    avatarUpdate = { avatar: initials }
  }

  const updatedUser = {
    ...users[userIndex],
    ...userData,
    ...avatarUpdate,
  }
  users[userIndex] = updatedUser
  return updatedUser
}
