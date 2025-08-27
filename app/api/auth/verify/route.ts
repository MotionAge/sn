import { type NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    const user = await adminAuth.verifyCredentials(username, password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user,
      message: "Credentials verified",
    })
  } catch (error) {
    console.error("Verify API error:", error)

    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
