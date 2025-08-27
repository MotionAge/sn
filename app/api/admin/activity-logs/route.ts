import { type NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/admin-auth"

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const currentUser = await adminAuth.getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Only super_admin and admin can view all logs
    if (!["super_admin", "admin"].includes(currentUser.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const adminId = searchParams.get("admin_id") || undefined

    const result = await adminAuth.getActivityLogs(adminId, limit, offset)

    return NextResponse.json({
      success: true,
      data: result.data,
      count: result.count,
      pagination: {
        limit,
        offset,
        total: result.count,
      },
    })
  } catch (error) {
    console.error("Activity logs error:", error)
    return NextResponse.json({ error: "Failed to fetch activity logs" }, { status: 500 })
  }
}
