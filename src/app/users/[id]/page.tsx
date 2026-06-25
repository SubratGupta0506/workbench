// src/app/users/[id]/page.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { User, Role } from "@/src/lib/types"
import { PERMISSIONS_MATRIX } from "@/src/lib/mockData"
import Sidebar from "@/src/components/layout/Sidebar"
import Topbar from "@/src/components/layout/Topbar"
import RoleBadge from "@/src/components/users/RoleBadge"
import UserProfileDialog from "@/src/components/users/UserProfileDialog"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Check, X, Loader2 } from "lucide-react"

interface UserDetailPageProps {
  params: Promise<{ id: string }>
}

interface EffectivePermissionsPayload {
  user: User
  roles: Role[]
  permissions: string[]
  permissionGrants: Record<string, string[]>
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const resolvedParams = React.use(params)
  const userId = resolvedParams.id

  const [data, setData] = React.useState<EffectivePermissionsPayload | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [isUserDialogOpen, setIsUserDialogOpen] = React.useState(false)

  // Fetch effective permissions & user profile details
  const fetchPermissions = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/users/${userId}/permissions`)
      if (!res.ok) throw new Error("Failed to load user permissions data")

      const payload = await res.json()
      setData(payload)
    } catch (err) {
      toast.error("Error loading user profile details")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchPermissions()
  }, [userId])

  // Remove role handler calling API
  const handleRemoveRole = async (roleId: string, roleName: string) => {
    if (!data) return
    try {
      const res = await fetch(`/api/users/${userId}/roles?roleId=${roleId}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Removal failed")

      toast.success(`Removed role "${roleName}" from ${data.user.name}`)
      fetchPermissions() // Re-fetch permissions payload to update union matrix
    } catch (err) {
      toast.error(`Failed to remove role: ${roleName}`)
    }
  }

  const handleSaveUserProfile = async (userData: {
    name: string
    email: string
    title: string
    location: string
    department: string
  }) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      if (!res.ok) throw new Error("Update failed")

      toast.success("Profile updated successfully")
      fetchPermissions()
    } catch (err) {
      toast.error("Failed to update profile details")
    }
  }



  if (loading) {
    return (
      <div className="flex h-screen bg-[#09090b] overflow-hidden font-sans text-white">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar />
          <main className="flex-1 p-8 flex items-center justify-center">
            <Loader2 className="animate-spin text-indigo-500" size={24} />
            <span className="text-xs text-zinc-400 font-semibold ml-2">Resolving user permissions...</span>
          </main>
        </div>
      </div>
    )
  }

  if (!data || !data.user) {
    return (
      <div className="flex h-screen bg-[#09090b] overflow-hidden font-sans text-white">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar />
          <main className="flex-1 p-8 flex flex-col items-center justify-center space-y-4">
            <h2 className="text-sm font-bold text-white">User not found</h2>
            <Link href="/users" className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
              <ChevronLeft size={14} /> Back to Users
            </Link>
          </main>
        </div>
      </div>
    )
  }

  const { user, roles: assignedRoles, permissionGrants: permissionGrantsMap } = data
  const meta = {
    title: user.title || "Team Member",
    joinDate: user.joinDate || "Aug 7, 2024",
    location: user.location || "Monstalk, City",
    department: user.department || "SaaS Team",
  }

  // Columns: View | Create | Edit | Delete | Special Action
  const columns = [
    { label: "View", getAction: (res: string) => "view" },
    {
      label: "Create",
      getAction: (res: string) => (res === "Members" ? "invite" : "create"),
    },
    {
      label: "Edit",
      getAction: (res: string) =>
        res === "Members" ? "update_role" : res === "Billing" || res === "Settings" ? "update" : "edit",
    },
    {
      label: "Delete",
      getAction: (res: string) => (res === "Members" ? "remove" : "delete"),
    },
    {
      label: "Special Action",
      getAction: (res: string) =>
        res === "Projects"
          ? "archive"
          : res === "Tasks"
          ? "assign"
          : res === "Billing"
          ? "download_invoices"
          : null,
    },
  ]

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans text-foreground">
      <Toaster position="top-right" />

      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar Panel */}
        <Topbar />

        {/* Scrollable details view */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-background">
          
          {/* Back Nav Link */}
          <div className="flex flex-col gap-3">
            <Link
              href="/users"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={14} />
              Back to Users
            </Link>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">User Details</h1>
              <p className="text-xs text-muted-foreground font-medium">
                {user.name} / {meta.title}
              </p>
            </div>
          </div>

          {/* User Profile Header Card */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-yellow-500/10 text-yellow-500 font-bold text-xl rounded-xl flex items-center justify-center border border-yellow-500/20 select-none shadow-inner">
                {user.avatar}
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground tracking-tight leading-none">
                  {user.name}
                </h2>
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                    {meta.title}
                  </span>
                  {assignedRoles.map((role) => (
                    <RoleBadge
                      key={role.id}
                      roleName={role.name}
                      onRemove={() => handleRemoveRole(role.id, role.name)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Mock Actions */}
            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                onClick={() => setIsUserDialogOpen(true)}
                className="h-8 text-xs font-semibold border-border bg-card text-foreground hover:bg-muted rounded-lg"
              >
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Details & Matrix Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            
            {/* Left side Metadata panel */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-5 lg:col-span-1">
              <h3 className="text-xs font-bold text-foreground border-b border-border pb-2">Details</h3>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Join Date</span>
                  <span className="text-xs font-semibold text-foreground">{meta.joinDate}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Location</span>
                  <span className="text-xs font-semibold text-foreground">{meta.location}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Email</span>
                  <span className="text-xs font-semibold text-foreground">{user.email}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Department</span>
                  <span className="text-xs font-semibold text-foreground">{meta.department}</span>
                </div>
              </div>
            </div>

            {/* Right side Permissions Matrix Table */}
            <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden lg:col-span-3">
              <div className="px-6 py-4 border-b border-border bg-muted/20">
                <h3 className="text-xs font-bold text-foreground">Effective Permissions Matrix</h3>
              </div>
              <Table>
                <TableHeader className="bg-card border-b border-border">
                  <TableRow className="hover:bg-transparent border-b border-border">
                    <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-6 py-3.5 w-1/5">
                      Resources
                    </TableHead>
                    {columns.map((col) => (
                      <TableHead
                        key={col.label}
                        className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-4 py-3.5 text-center"
                      >
                        {col.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PERMISSIONS_MATRIX.map((resourceGroup) => {
                    const resourceName = resourceGroup.resource
                    const resourceKey = resourceName.toLowerCase()

                    return (
                      <TableRow
                        key={resourceName}
                        className="border-b border-border hover:bg-muted/30 transition-colors"
                      >
                        {/* Resource Name */}
                        <TableCell className="px-6 py-4 font-bold text-foreground text-xs w-1/5">
                          {resourceName}
                        </TableCell>

                        {/* Action cells */}
                        {columns.map((col) => {
                          const action = col.getAction(resourceName)
                          
                          if (!action) {
                            return (
                              <TableCell key={col.label} className="px-4 py-4 text-center text-muted-foreground/40 select-none">
                                &mdash;
                              </TableCell>
                            )
                          }

                          const permissionKey = `${resourceKey}.${action}`
                          const grantingRoles = permissionGrantsMap[permissionKey] || []
                          const isGranted = grantingRoles.length > 0

                          // Format action name (e.g. "download_invoices" -> "Download Invoices")
                          const actionLabel = action
                            .split("_")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")

                          return (
                            <TableCell key={col.label} className="px-4 py-3 text-center">
                              <div className="flex flex-col items-center justify-center space-y-1">
                                {isGranted ? (
                                  <div 
                                    className="flex flex-col items-center gap-1 group cursor-pointer"
                                    title={`Granted by: ${grantingRoles.join(", ")}`}
                                  >
                                    <div className="w-6 h-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-md flex items-center justify-center">
                                      <Check size={14} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[9px] text-emerald-500 dark:text-emerald-400 font-bold leading-tight">
                                      {actionLabel}
                                    </span>
                                    <span className="text-[8px] text-indigo-500 dark:text-indigo-400 font-semibold leading-none">
                                      {grantingRoles[0]}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center gap-1">
                                    <div className="w-6 h-6 bg-rose-500/10 border border-rose-500/25 text-rose-500 rounded-md flex items-center justify-center">
                                      <X size={14} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[9px] text-rose-500/60 font-medium leading-tight">
                                      {actionLabel}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
        
        {/* Footer Credit */}
        <footer className="bg-card border-t border-border py-4 text-center text-[10px] text-muted-foreground font-semibold">
          Workbench Admin Panel | &copy; Workbench 2026
        </footer>
        <UserProfileDialog
          open={isUserDialogOpen}
          onOpenChange={setIsUserDialogOpen}
          user={user}
          onSave={handleSaveUserProfile}
        />
      </div>
    </div>
  )
}
