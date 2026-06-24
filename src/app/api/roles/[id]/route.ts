// src/app/api/roles/[id]/route.ts
import { NextResponse } from "next/server"
import { updateRole, deleteRole } from "@/src/lib/store"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const id = resolvedParams.id
    const body = await request.json()

    if (body.name !== undefined && !body.name.trim()) {
      return NextResponse.json({ error: "Role name cannot be empty" }, { status: 400 })
    }

    const updatedRole = updateRole(id, {
      name: body.name?.trim(),
      description: body.description?.trim(),
      permissions: body.permissions,
    })

    if (!updatedRole) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 })
    }

    return NextResponse.json(updatedRole)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const id = resolvedParams.id
    const success = deleteRole(id)

    if (!success) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Role deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete role" }, { status: 500 })
  }
}
