// src/components/roles/PermissionsMatrix.tsx
"use client"

import * as React from "react"
import { PERMISSIONS_MATRIX } from "@/src/lib/mockData"

interface PermissionsMatrixProps {
  selectedPermissions: string[]
  onChange: (permissions: string[]) => void
}

export default function PermissionsMatrix({
  selectedPermissions,
  onChange,
}: PermissionsMatrixProps) {
  // Helper to check if a permission is selected
  const isSelected = (permissionKey: string) => {
    return selectedPermissions.includes(permissionKey)
  }

  // Toggle single permission
  const handleTogglePermission = (permissionKey: string) => {
    if (isSelected(permissionKey)) {
      onChange(selectedPermissions.filter((p) => p !== permissionKey))
    } else {
      onChange([...selectedPermissions, permissionKey])
    }
  }

  // Toggle all permissions for a resource
  const handleToggleResourceAll = (
    resourceKey: string,
    actions: string[],
    checked: boolean
  ) => {
    const resourcePermissionKeys = actions.map((act) => `${resourceKey}.${act}`)
    if (checked) {
      // Add all resource permission keys that aren't already selected
      const newPermissions = [...selectedPermissions]
      resourcePermissionKeys.forEach((key) => {
        if (!newPermissions.includes(key)) {
          newPermissions.push(key)
        }
      })
      onChange(newPermissions)
    } else {
      // Remove all resource permission keys
      onChange(selectedPermissions.filter((p) => !resourcePermissionKeys.includes(p)))
    }
  }

  // Capitalize and format action labels (e.g. "update_role" -> "Update Role")
  const formatActionLabel = (action: string) => {
    return action
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-white">Permissions</h3>
        <p className="text-xs text-zinc-450">
          Select the permissions to assign to this role.
        </p>
      </div>

      <div className="space-y-5 border border-zinc-800 rounded-lg p-5 bg-zinc-950/40">
        {PERMISSIONS_MATRIX.map((resourceGroup) => {
          const resourceName = resourceGroup.resource
          const resourceKey = resourceName.toLowerCase()
          const actions = resourceGroup.actions
          const resourcePermissionKeys = actions.map((act) => `${resourceKey}.${act}`)

          // Check if all actions are checked
          const allChecked = resourcePermissionKeys.every((key) =>
            selectedPermissions.includes(key)
          )

          // Check if some (but not all) actions are checked
          const someChecked =
            !allChecked &&
            resourcePermissionKeys.some((key) => selectedPermissions.includes(key))

          // Indeterminate ref effect
          return (
            <ResourceRow
              key={resourceName}
              resourceName={resourceName}
              resourceKey={resourceKey}
              actions={actions}
              allChecked={allChecked}
              someChecked={someChecked}
              selectedPermissions={selectedPermissions}
              onToggleAll={(checked) =>
                handleToggleResourceAll(resourceKey, actions, checked)
              }
              onTogglePermission={handleTogglePermission}
              formatActionLabel={formatActionLabel}
            />
          )
        })}
      </div>
    </div>
  )
}

interface ResourceRowProps {
  resourceName: string
  resourceKey: string
  actions: string[]
  allChecked: boolean
  someChecked: boolean
  selectedPermissions: string[]
  onToggleAll: (checked: boolean) => void
  onTogglePermission: (permissionKey: string) => void
  formatActionLabel: (action: string) => string
}

function ResourceRow({
  resourceName,
  resourceKey,
  actions,
  allChecked,
  someChecked,
  selectedPermissions,
  onToggleAll,
  onTogglePermission,
  formatActionLabel,
}: ResourceRowProps) {
  const selectAllRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someChecked
    }
  }, [someChecked])

  return (
    <div className="border-b border-zinc-800/60 last:border-b-0 pb-4 last:pb-0">
      {/* Resource Header */}
      <div className="flex items-center justify-between py-1 mb-2">
        <span className="text-xs font-semibold text-zinc-200">{resourceName}</span>
        <label className={`flex items-center gap-1.5 cursor-pointer text-xs font-medium select-none transition-colors ${
          allChecked || someChecked
            ? "text-emerald-400 font-semibold"
            : "text-zinc-400 hover:text-white"
        }`}>
          <input
            ref={selectAllRef}
            type="checkbox"
            checked={allChecked}
            onChange={(e) => onToggleAll(e.target.checked)}
            className="accent-emerald-600 w-3.5 h-3.5 rounded text-emerald-500 focus:ring-emerald-500 border-zinc-700 cursor-pointer bg-zinc-900"
          />
          Select All
        </label>
      </div>

      {/* Actions row */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 pl-1">
        {actions.map((action) => {
          const permissionKey = `${resourceKey}.${action}`
          const isChecked = selectedPermissions.includes(permissionKey)

          return (
            <label
              key={action}
              className={`flex items-center gap-1.5 cursor-pointer text-xs select-none py-0.5 px-1.5 rounded transition-colors ${
                isChecked
                  ? "text-emerald-400 bg-emerald-500/10 font-semibold border border-emerald-500/20"
                  : "text-zinc-400 hover:text-white border border-transparent"
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onTogglePermission(permissionKey)}
                className="accent-emerald-600 w-3.5 h-3.5 rounded text-emerald-500 focus:ring-emerald-500 border-zinc-700 cursor-pointer bg-zinc-900"
              />
              {formatActionLabel(action)}
            </label>
          )
        })}
      </div>
    </div>
  )
}
