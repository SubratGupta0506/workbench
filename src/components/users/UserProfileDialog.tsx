// src/components/users/UserProfileDialog.tsx
"use client"

import * as React from "react"
import { User } from "@/src/lib/types"
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

interface UserProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
  onSave: (userData: {
    name: string
    email: string
    title: string
    location: string
    department: string
  }) => void
}

export default function UserProfileDialog({
  open,
  onOpenChange,
  user,
  onSave,
}: UserProfileDialogProps) {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [title, setTitle] = React.useState("")
  const [location, setLocation] = React.useState("")
  const [department, setDepartment] = React.useState("")
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  // Initialize fields when dialog opens or user changes
  React.useEffect(() => {
    if (open && user) {
      setName(user.name || "")
      setEmail(user.email || "")
      setTitle(user.title || "")
      setLocation(user.location || "")
      setDepartment(user.department || "")
      setErrors({})
    }
  }, [open, user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!email.trim()) {
      newErrors.email = "Email is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave({
      name: name.trim(),
      email: email.trim(),
      title: title.trim(),
      location: location.trim(),
      department: department.trim(),
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-[#18181b] text-white border border-zinc-800 shadow-xl rounded-xl p-0 overflow-hidden">
        <DialogHeader className="px-6 py-5 border-b border-zinc-800">
          <DialogTitle className="text-base font-bold text-white leading-none">
            Edit Profile
          </DialogTitle>
          <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
            Update personal information, location, and department for this user.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Name Field */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="user-name" className="text-xs font-semibold text-zinc-300">
              Full Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="user-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (e.target.value.trim()) setErrors((prev) => ({ ...prev, name: "" }))
              }}
              placeholder="Rahul Sharma"
              className={`h-9 text-xs px-3 bg-zinc-950 border ${
                errors.name ? "border-rose-500" : "border-zinc-800"
              } text-white focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 rounded-md`}
            />
            {errors.name && <span className="text-[10px] text-rose-500 font-semibold">{errors.name}</span>}
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="user-email" className="text-xs font-semibold text-zinc-300">
              Email Address <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="user-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (e.target.value.trim()) setErrors((prev) => ({ ...prev, email: "" }))
              }}
              placeholder="rahul@workbench.com"
              className={`h-9 text-xs px-3 bg-zinc-950 border ${
                errors.email ? "border-rose-500" : "border-zinc-800"
              } text-white focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 rounded-md`}
            />
            {errors.email && <span className="text-[10px] text-rose-500 font-semibold">{errors.email}</span>}
          </div>

          {/* Title Field */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="user-title" className="text-xs font-semibold text-zinc-300">
              Job Title
            </Label>
            <Input
              id="user-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lead Engineer"
              className="h-9 text-xs px-3 bg-zinc-950 border border-zinc-800 text-white focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 rounded-md"
            />
          </div>

          {/* Department Field */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="user-dept" className="text-xs font-semibold text-zinc-300">
              Department
            </Label>
            <Input
              id="user-dept"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Engineering"
              className="h-9 text-xs px-3 bg-zinc-950 border border-zinc-800 text-white focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 rounded-md"
            />
          </div>

          {/* Location Field */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="user-loc" className="text-xs font-semibold text-zinc-300">
              Location
            </Label>
            <Input
              id="user-loc"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bangalore, India"
              className="h-9 text-xs px-3 bg-zinc-950 border border-zinc-800 text-white focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 rounded-md"
            />
          </div>

          {/* Dialog Footer */}
          <DialogFooter className="border-t border-zinc-800 pt-4 mt-6 flex justify-end gap-2 bg-zinc-950/20 px-6 py-4 -mx-6 -mb-6">
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
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
