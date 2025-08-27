import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Since we don't use sessions, logout is just a success response
    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    console.error("Logout API error:", error)

    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
