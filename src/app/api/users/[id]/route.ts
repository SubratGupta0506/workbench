// src/app/api/users/[id]/route.ts
import { NextResponse } from "next/server"
import { updateUserProfile } from "@/src/lib/store"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const id = resolvedParams.id
    const body = await request.json()

    if (body.name !== undefined && !body.name.trim()) {
      return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 })
    }

    if (body.email !== undefined && !body.email.trim()) {
      return NextResponse.json({ error: "Email cannot be empty" }, { status: 400 })
    }

    const updatedUser = updateUserProfile(id, {
      name: body.name?.trim(),
      email: body.email?.trim(),
      title: body.title?.trim(),
      location: body.location?.trim(),
      department: body.department?.trim(),
    })

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 })
  }
}
