// src/app/api/roles/route.ts
import { NextResponse } from "next/server"
import { getRoles, addRole } from "@/src/lib/store"

export async function GET() {
  try {
    const roles = getRoles()
    return NextResponse.json(roles)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Role name is required" }, { status: 400 })
    }

    const newRole = addRole({
      name: body.name.trim(),
      description: body.description?.trim() || "",
      permissions: body.permissions || [],
    })

    return NextResponse.json(newRole, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create role" }, { status: 500 })
  }
}
