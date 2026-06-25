// src/app/users/page.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { User, Role } from "@/src/lib/types"
import Sidebar from "@/src/components/layout/Sidebar"
import Topbar from "@/src/components/layout/Topbar"
import RoleBadge from "@/src/components/users/RoleBadge"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { UserPlus, Shield, Mail, Loader2, ArrowRight } from "lucide-react"

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>([])
  const [roles, setRoles] = React.useState<Role[]>([])
  const [loading, setLoading] = React.useState(true)

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true)
      const [rolesRes, usersRes] = await Promise.all([
        fetch("/api/roles"),
        fetch("/api/users"),
      ])
      
      if (!rolesRes.ok || !usersRes.ok) throw new Error("Failed to load data")

      const [rolesData, usersData] = await Promise.all([
        rolesRes.json(),
        usersRes.json(),
      ])

      setRoles(rolesData)
      setUsers(usersData)
    } catch (err) {
      toast.error("Error fetching users or roles")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  // Remove role ID from a user via API
  const handleRemoveRole = async (userId: string, roleId: string, userName: string, roleName: string) => {
    try {
      const res = await fetch(`/api/users/${userId}/roles?roleId=${roleId}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Removal failed")

      toast.success(`Removed role "${roleName}" from ${userName}`)
      fetchData() // Refresh server state
    } catch (err) {
      toast.error(`Failed to remove role: ${roleName}`)
    }
  }

  // Assign role ID to a user via API
  const handleAssignRole = async (userId: string, roleId: string, userName: string, roleName: string) => {
    try {
      const res = await fetch(`/api/users/${userId}/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId }),
      })

      if (!res.ok) throw new Error("Assignment failed")

      toast.success(`Assigned role "${roleName}" to ${userName}`)
      fetchData() // Refresh server state
    } catch (err) {
      toast.error(`Failed to assign role: ${roleName}`)
    }
  }

  // Get dynamic meta detail title
  const getUserTitle = (userName: string) => {
    switch (userName) {
      case "Rahul Sharma": return "SaaS Administrator"
      case "Priya Nair": return "Lead Engineer"
      case "Kiran Rao": return "Operations Lead"
      case "Anjali Mehta": return "Product Designer"
      default: return "Team Member"
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans text-foreground">
      <Toaster position="top-right" />

      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar Panel */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-background">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Users</h1>
            <p className="text-sm text-muted-foreground font-medium">
              Manage team members and configure their system roles.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="animate-spin text-indigo-500" size={24} />
              <span className="text-xs text-muted-foreground font-semibold ml-2">Loading users data...</span>
            </div>
          ) : (
            /* Users Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => {
                // Find role objects assigned to the user
                const assignedRoles = user.roleIds
                  .map((id) => roles.find((r) => r.id === id))
                  .filter((r): r is Role => !!r)

                // Find roles NOT assigned to the user (for dropdown menu selection)
                const unassignedRoles = roles.filter((r) => !user.roleIds.includes(r.id))
                const userTitle = getUserTitle(user.name)

                return (
                  <div
                    key={user.id}
                    className="bg-card border border-border rounded-xl p-6 shadow-xs flex flex-col justify-between hover:border-border/80 transition-all relative group"
                  >
                    {/* Link wrapper for navigation to user details page */}
                    <Link
                      href={`/users/${user.id}`}
                      className="absolute inset-0 z-0 rounded-xl cursor-pointer"
                      aria-label={`View details of ${user.name}`}
                    />

                    {/* Card Content wrapper to keep links clickable */}
                    <div className="relative z-10 space-y-6 pointer-events-none">
                      {/* User Profile Info */}
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12 border border-border shadow-xs shrink-0 bg-yellow-500/10">
                          <AvatarFallback className="bg-yellow-500/10 text-yellow-500 font-bold text-base select-none border border-yellow-500/20 rounded-lg w-full h-full flex items-center justify-center">
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <h2 className="text-sm font-bold text-foreground leading-snug truncate">
                            {user.name}
                          </h2>
                          <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-semibold mb-1">
                            {userTitle}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-medium truncate flex items-center gap-1 mt-0.5">
                            <Mail size={11} className="shrink-0" />
                            {user.email}
                          </span>
                        </div>
                      </div>

                      {/* Roles Badges Section */}
                      <div className="space-y-2 pointer-events-auto">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Assigned Roles
                        </span>
                        <div className="flex flex-wrap gap-1.5 min-h-[24px]">
                          {assignedRoles.length > 0 ? (
                            assignedRoles.map((role) => (
                              <RoleBadge
                                key={role.id}
                                roleName={role.name}
                                onRemove={() =>
                                  handleRemoveRole(user.id, role.id, user.name, role.name)
                                }
                              />
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground/60 italic font-medium select-none">
                              No roles assigned
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Dropdown triggers / Actions in card footer */}
                    <div className="relative z-10 border-t border-border pt-4 mt-6 flex items-center justify-between pointer-events-auto">
                      <Link
                        href={`/users/${user.id}`}
                        className="text-[11px] font-semibold text-indigo-500 dark:text-indigo-400 hover:text-indigo-650 dark:hover:text-indigo-300 transition-colors flex items-center gap-1"
                      >
                        View permissions
                        <ArrowRight size={12} />
                      </Link>

                      {/* Assign Role Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="xs"
                            className="h-7 text-[10px] font-semibold border border-border bg-card hover:bg-muted text-foreground rounded-md gap-1"
                          >
                            <UserPlus size={11} />
                            Assign role
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-card border border-border shadow-md rounded-lg p-1">
                          <DropdownMenuLabel className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider px-2.5 py-1.5">
                            Select Role
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-border" />
                          {unassignedRoles.length > 0 ? (
                            unassignedRoles.map((role) => (
                              <DropdownMenuItem
                                key={role.id}
                                onClick={() =>
                                  handleAssignRole(user.id, role.id, user.name, role.name)
                                }
                                className="text-xs text-foreground hover:bg-muted px-2.5 py-1.5 rounded-md cursor-pointer flex items-center gap-2"
                              >
                                <Shield size={12} className="text-muted-foreground group-hover:text-indigo-400" />
                                {role.name}
                              </DropdownMenuItem>
                            ))
                          ) : (
                            <div className="text-[10px] text-muted-foreground italic p-3 text-center">
                              All roles assigned
                            </div>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>

        {/* Footer Credit */}
        <footer className="bg-card border-t border-border py-4 text-center text-[10px] text-muted-foreground font-semibold">
          Workbench Admin Panel | &copy; Workbench 2026
        </footer>
      </div>
    </div>
  )
}
