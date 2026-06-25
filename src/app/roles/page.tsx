// src/app/roles/page.tsx
"use client"

import * as React from "react"
import { Role, User } from "@/src/lib/types"
import { PERMISSIONS_MATRIX } from "@/src/lib/mockData"
import Sidebar from "@/src/components/layout/Sidebar"
import Topbar from "@/src/components/layout/Topbar"
import RoleFormDialog from "@/src/components/roles/RoleFormDialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table"
import {
  Shield,
  Users,
  Key,
  Plus,
  Search,
  Pencil,
  Trash2,
  AlertCircle,
  Loader2,
} from "lucide-react"

export default function RolesPage() {
  const [roles, setRoles] = React.useState<Role[]>([])
  const [users, setUsers] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [roleToEdit, setRoleToEdit] = React.useState<Role | null>(null)

  // Delete Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [roleToDelete, setRoleToDelete] = React.useState<{ id: string; name: string } | null>(null)

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
      toast.error("Error fetching data from API")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  // Calculate total defined permissions
  const totalDefinedPermissions = React.useMemo(() => {
    return PERMISSIONS_MATRIX.reduce((acc, resource) => acc + resource.actions.length, 0)
  }, [])

  // Filter roles based on search
  const filteredRoles = React.useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) return roles
    return roles.filter(
      (role) =>
          role.name.toLowerCase().includes(term) ||
          role.description.toLowerCase().includes(term)
    )
  }, [roles, searchTerm])

  const handleCreateClick = () => {
    setRoleToEdit(null)
    setIsDialogOpen(true)
  }

  const handleEditClick = (role: Role) => {
    setRoleToEdit(role)
    setIsDialogOpen(true)
  }

  // Delete role handler
  const handleDeleteClick = (roleId: string, roleName: string) => {
    setRoleToDelete({ id: roleId, name: roleName })
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return
    const { id, name } = roleToDelete

    try {
      const res = await fetch(`/api/roles/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Deletion failed")

      toast.success(`Role "${name}" deleted successfully`)
      setIsDeleteDialogOpen(false)
      setRoleToDelete(null)
      fetchData() // Refresh server state
    } catch (err) {
      toast.error(`Failed to delete role: ${name}`)
    }
  }

  // Save/Update role callback
  const handleSaveRole = async (roleData: { name: string; description: string; permissions: string[] }) => {
    try {
      if (roleToEdit) {
        // Edit Mode: PUT
        const res = await fetch(`/api/roles/${roleToEdit.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(roleData),
        })

        if (!res.ok) throw new Error("Update failed")
        toast.success(`Role "${roleData.name}" updated successfully`)
      } else {
        // Create Mode: POST
        const res = await fetch("/api/roles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(roleData),
        })

        if (!res.ok) throw new Error("Creation failed")
        toast.success(`Role "${roleData.name}" created successfully`)
      }
      setIsDialogOpen(false)
      fetchData() // Refresh list from server
    } catch (err) {
      toast.error("Failed to save role details")
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans text-foreground">
      <Toaster position="top-right" />

      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar navigation panel */}
        <Topbar />

        {/* Scrollable page body */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-background">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Roles</h1>
              <p className="text-sm text-muted-foreground font-medium">
                Manage access levels and permissions for your team.
              </p>
            </div>
            <Button
              onClick={handleCreateClick}
              disabled={loading}
              className="bg-indigo-600 text-white hover:bg-indigo-750 active:bg-indigo-800 h-9 text-xs px-4 font-semibold rounded-md shadow-sm flex items-center gap-1.5 self-start sm:self-center transition-colors"
            >
              <Plus size={15} strokeWidth={2.5} />
              Create role
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="animate-spin text-indigo-500" size={24} />
              <span className="text-xs text-muted-foreground font-semibold ml-2">Loading roles data...</span>
            </div>
          ) : (
            <>
              {/* Stats Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Stat Card 1: Total Roles */}
                <div className="bg-card border border-border rounded-lg p-5 shadow-xs flex items-center gap-4 transition-all hover:border-border/80">
                  <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center border border-indigo-500/20">
                    <Shield size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-foreground leading-tight">
                      {roles.length}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
                      Total Roles
                    </span>
                  </div>
                </div>

                {/* Stat Card 2: Total Users */}
                <div className="bg-card border border-border rounded-lg p-5 shadow-xs flex items-center gap-4 transition-all hover:border-border/80">
                  <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center border border-blue-500/20">
                    <Users size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-foreground leading-tight">
                      {users.length}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
                      Total Users
                    </span>
                  </div>
                </div>

                {/* Stat Card 3: Total Permissions */}
                <div className="bg-card border border-border rounded-lg p-5 shadow-xs flex items-center gap-4 transition-all hover:border-border/80">
                  <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center border border-emerald-500/20">
                    <Key size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-foreground leading-tight">
                      {totalDefinedPermissions}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
                      Total Permissions
                    </span>
                  </div>
                </div>
              </div>

              {/* Search Bar Section */}
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  type="text"
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 text-xs bg-card border border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 rounded-lg transition-all"
                />
              </div>

              {/* Roles Table Board */}
              <div className="bg-card border border-border rounded-lg shadow-xs overflow-hidden">
                {filteredRoles.length > 0 ? (
                  <Table>
                    <TableHeader className="bg-card border-b border-border">
                      <TableRow className="hover:bg-transparent border-b border-border">
                        <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-6 py-3.5">
                          Role
                        </TableHead>
                        <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-6 py-3.5">
                          Description
                        </TableHead>
                        <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-6 py-3.5">
                          Permissions
                        </TableHead>
                        <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-6 py-3.5">
                          Created
                        </TableHead>
                        <TableHead className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-6 py-3.5 text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRoles.map((role) => (
                        <TableRow
                          key={role.id}
                          className="border-b border-border hover:bg-muted/40 transition-colors"
                        >
                          {/* Role Name */}
                          <TableCell className="px-6 py-4 font-bold text-foreground text-xs">
                            {role.name}
                          </TableCell>
                          
                          {/* Description */}
                          <TableCell className="px-6 py-4 text-xs text-muted-foreground font-medium whitespace-normal max-w-md">
                            {role.description || <span className="italic text-muted-foreground/60">No description provided</span>}
                          </TableCell>

                          {/* Permissions Count Badge */}
                          <TableCell className="px-6 py-4">
                            <Badge
                              variant="outline"
                              className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/25 font-semibold text-[10px] py-0.5 px-2 rounded-full"
                            >
                              {role.permissions?.length || 0}{" "}
                              {(role.permissions?.length || 0) === 1 ? "permission" : "permissions"}
                            </Badge>
                          </TableCell>

                          {/* Created Date */}
                          <TableCell className="px-6 py-4 text-xs text-muted-foreground font-semibold">
                            {role.createdAt}
                          </TableCell>

                          {/* Actions Buttons */}
                          <TableCell className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleEditClick(role)}
                                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                                title="Edit Role"
                              >
                                <Pencil size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleDeleteClick(role.id, role.name)}
                                className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-md"
                                title="Delete Role"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  /* Table Empty State */
                  <div className="flex flex-col items-center justify-center text-center p-12 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground">
                      <AlertCircle size={22} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-semibold text-foreground">No roles found</h3>
                      <p className="text-[11px] text-muted-foreground max-w-xs">
                        We couldn&apos;t find any roles matching &quot;{searchTerm}&quot;. Try adjusting your search query.
                      </p>
                    </div>
                    {searchTerm && (
                      <Button
                        variant="outline"
                        onClick={() => setSearchTerm("")}
                        className="h-8 text-xs font-medium border-border bg-card hover:bg-muted text-foreground"
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Form Modal Dialog */}
          <RoleFormDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            roleToEdit={roleToEdit}
            onSave={handleSaveRole}
          />

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <AlertCircle className="text-rose-500" size={18} />
                  Confirm Deletion
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-2">
                  Are you sure you want to delete the role <span className="font-bold text-foreground">"{roleToDelete?.name}"</span>? This action is permanent and cannot be undone. It will automatically unassign this role from all assigned users.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="text-xs border border-border bg-card text-foreground hover:bg-muted"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmDelete}
                  className="text-xs bg-rose-600 text-white hover:bg-rose-700 font-semibold"
                >
                  Delete Role
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
        
        {/* Footer Credit */}
        <footer className="bg-card border-t border-border py-4 text-center text-[10px] text-muted-foreground font-semibold">
          Designed by Subrat | &copy; Workbench 2026
        </footer>
      </div>
    </div>
  )
}
