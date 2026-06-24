// src/app/api/users/[id]/roles/route.ts
import { NextResponse } from "next/server"
import { assignRoleToUser, removeRoleFromUser } from "@/src/lib/store"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const userId = resolvedParams.id
    const body = await request.json()
    const roleId = body.roleId

    if (!roleId) {
      return NextResponse.json({ error: "Role ID is required" }, { status: 400 })
    }

    const updatedUser = assignRoleToUser(userId, roleId)
    if (!updatedUser) {
      return NextResponse.json({ error: "User or Role not found" }, { status: 404 })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    return NextResponse.json({ error: "Failed to assign role" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const userId = resolvedParams.id

    // Try reading roleId from URL search parameters first
    const { searchParams } = new URL(request.url)
    let roleId = searchParams.get("roleId")

    // Fallback: try reading from body if not present in query
    if (!roleId) {
      try {
        const body = await request.json()
        roleId = body.roleId
      } catch (e) {
        // Body is optional if query parameter is provided
      }
    }

    if (!roleId) {
      return NextResponse.json({ error: "Role ID is required" }, { status: 400 })
    }

    const updatedUser = removeRoleFromUser(userId, roleId)
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove role" }, { status: 500 })
  }
}
