// src/components/users/RoleBadge.tsx
"use client"

import * as React from "react"
import { X } from "lucide-react"

interface RoleBadgeProps {
  roleName: string
  onRemove?: () => void
}

export default function RoleBadge({ roleName, onRemove }: RoleBadgeProps) {
  // Determine color theme based on role name for visual variety
  const getBadgeColors = (name: string) => {
    switch (name.toLowerCase()) {
      case "admin":
        return "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100/50"
      case "member":
        return "bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100/50"
      case "contractor":
        return "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100/50"
      case "billing viewer":
      case "billing":
        return "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/50"
      default:
        return "bg-gray-50 text-gray-700 border-gray-150 hover:bg-gray-100/50"
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-colors select-none ${getBadgeColors(
        roleName
      )}`}
    >
      {roleName}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation() // Prevent triggering card link navigation
            onRemove()
          }}
          className="rounded-full p-0.5 hover:bg-black/5 text-current transition-colors focus:outline-none focus:ring-1 focus:ring-current"
          aria-label={`Remove role ${roleName}`}
        >
          <X size={10} strokeWidth={2.5} />
        </button>
      )}
    </span>
  )
}
