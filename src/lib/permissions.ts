// src/lib/permissions.ts
import { getUsers, getRoles } from "./store"
import { Role, User } from "./types"

export interface EffectivePermissionsResult {
  user: User
  roles: Role[]
  permissions: string[]
  permissionGrants: Record<string, string[]> // e.g. { "projects.view": ["Admin", "Member"] }
}

export function resolveEffectivePermissions(userId: string): EffectivePermissionsResult | null {
  const users = getUsers()
  const roles = getRoles()

  const user = users.find((u) => u.id === userId)
  if (!user) return null

  // Find all roles assigned to this user
  const userRoles = user.roleIds
    .map((id) => roles.find((r) => r.id === id))
    .filter((r): r is Role => !!r)

  const permissionGrants: Record<string, string[]> = {}

  // Merge permissions using UNION logic (if any role grants it, the user has it)
  userRoles.forEach((role) => {
    if (role.permissions) {
      role.permissions.forEach((permissionKey) => {
        if (!permissionGrants[permissionKey]) {
          permissionGrants[permissionKey] = []
        }
        permissionGrants[permissionKey].push(role.name)
      })
    }
  })

  // Get the list of all unique granted permissions
  const permissions = Object.keys(permissionGrants)

  return {
    user,
    roles: userRoles,
    permissions,
    permissionGrants,
  }
}
