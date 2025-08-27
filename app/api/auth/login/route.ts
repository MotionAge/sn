import { type NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Login API called")
    
    const body = await request.json()
    const { username, password } = body

    console.log("📝 Request body:", { 
      username, 
      passwordProvided: !!password,
      passwordLength: password?.length 
    })

    if (!username || !password) {
      console.error("❌ Missing credentials")
      return NextResponse.json({ 
        error: "Username and password are required" 
      }, { status: 400 })
    }

    // Get client IP and user agent
    const ipAddress = request.headers.get("x-forwarded-for") || 
                     request.headers.get("x-real-ip") || 
                     "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    console.log("🌐 Request info:", { ipAddress, userAgent })

    console.log("🔐 Attempting login...")
    const result = await adminAuth.login(username, password, ipAddress, userAgent)

    console.log("✅ Login successful, returning response")
    
    return NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        role: result.user.role,
        is_active: result.user.is_active
      }, // Don't return password_hash in response
      message: "Login successful",
    })
  } catch (error) {
    console.error("❌ Login API error:", error)

    // Log the full error for debugging
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }

    const errorMessage = error instanceof Error ? error.message : "Login failed"

    return NextResponse.json({ 
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 401 })
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}