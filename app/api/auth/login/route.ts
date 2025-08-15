import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()
    console.log("Login attempt:", { username }) // Debug log

    // Hardcoded credentials validation
    if (username === "admin" && password === "admin123") {
      return NextResponse.json({ success: true })
    }

    console.log("Invalid credentials")
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}