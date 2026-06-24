// src/lib/types.ts

export interface Permission {
  resource: string
  action: string
  key: string // e.g. "projects.view"
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[] // array of keys like "projects.view"
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string // initials like "RS"
  roleIds: string[]
  title?: string
  joinDate?: string
  location?: string
  department?: string
}