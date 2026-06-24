// src/app/api/users/route.ts
import { NextResponse } from "next/server"
import { getUsers } from "@/src/lib/store"

export async function GET() {
  try {
    const users = getUsers()
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
