// src/app/api/users/[id]/permissions/route.ts
import { NextResponse } from "next/server"
import { resolveEffectivePermissions } from "@/src/lib/permissions"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const userId = resolvedParams.id
    const result = resolveEffectivePermissions(userId)

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to resolve effective permissions" }, { status: 500 })
  }
}
