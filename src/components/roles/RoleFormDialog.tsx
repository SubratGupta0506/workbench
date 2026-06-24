// src/components/roles/RoleFormDialog.tsx
"use client"

import * as React from "react"
import { Role } from "@/src/lib/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import PermissionsMatrix from "./PermissionsMatrix"

interface RoleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roleToEdit: Role | null
  onSave: (roleData: { name: string; description: string; permissions: string[] }) => void
}

export default function RoleFormDialog({
  open,
  onOpenChange,
  roleToEdit,
  onSave,
}: RoleFormDialogProps) {
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [selectedPermissions, setSelectedPermissions] = React.useState<string[]>([])
  const [error, setError] = React.useState("")

  // Reset/populate form when dialog opens or roleToEdit changes
  React.useEffect(() => {
    if (open) {
      if (roleToEdit) {
        setName(roleToEdit.name)
        setDescription(roleToEdit.description)
        setSelectedPermissions(roleToEdit.permissions || [])
      } else {
        setName("")
        setDescription("")
        setSelectedPermissions([])
      }
      setError("")
    }
  }, [open, roleToEdit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError("Role name cannot be empty")
      return
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      permissions: selectedPermissions,
    })
    
    onOpenChange(false)
  }

  const isEditMode = !!roleToEdit

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[680px] w-full max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden bg-[#18181b] text-white border border-zinc-800 shadow-xl rounded-xl">
        <DialogHeader className="px-6 py-5 border-b border-zinc-800">
          <DialogTitle className="text-base font-bold text-white leading-none">
            {isEditMode ? "Edit Role" : "Create Role"}
          </DialogTitle>
          <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
            {isEditMode
              ? "Modify the role properties and change access level permissions."
              : "Define a new access level role and configure its specific permissions."}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
          {/* Scrollable Form Content */}
          <div className="p-6 space-y-6 flex-1">
            <div className="space-y-4">
              {/* Role Name */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="role-name" className="text-xs font-semibold text-zinc-300">
                  Role Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="role-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (e.target.value.trim()) setError("")
                  }}
                  placeholder="e.g. Project Manager"
                  className={`h-9 text-xs px-3 bg-zinc-950 border text-white placeholder:text-zinc-650 ${
                    error ? "border-rose-500 focus-visible:ring-rose-550/20" : "border-zinc-800 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500"
                  } transition-shadow rounded-md`}
                />
                {error && <span className="text-[10px] text-rose-500 font-medium">{error}</span>}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="role-desc" className="text-xs font-semibold text-zinc-300">
                  Description
                </Label>
                <Input
                  id="role-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Can view, edit and create projects within their team"
                  className="h-9 text-xs px-3 bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-650 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-shadow rounded-md"
                />
              </div>
            </div>

            {/* Permissions Matrix */}
            <div className="border-t border-zinc-800 pt-6">
              <PermissionsMatrix
                selectedPermissions={selectedPermissions}
                onChange={setSelectedPermissions}
              />
            </div>
          </div>

          {/* Sticky Dialog Footer */}
          <DialogFooter className="px-6 py-4 bg-zinc-950/40 border-t border-zinc-800 flex items-center justify-between gap-4 sm:flex-row flex-col">
            <div className="text-xs text-zinc-400 font-medium self-start sm:self-center">
              <span className="text-indigo-400 font-semibold">{selectedPermissions.length}</span>{" "}
              {selectedPermissions.length === 1 ? "permission" : "permissions"} selected
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-8 text-xs font-semibold border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-750 hover:text-white rounded-md"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-8 text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-850 rounded-md px-4 shadow-sm"
              >
                {isEditMode ? "Save Changes" : "Create Role"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
