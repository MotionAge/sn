import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return NextResponse.json({ error: "Database connection unavailable" }, { status: 503 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "published"
    const limit = searchParams.get("limit")
    const category = searchParams.get("category")

    let query = supabase.from("blogs").select("*").eq("status", status).order("created_at", { ascending: false })

    if (category) {
      query = query.contains("categories", [category])
    }

    if (limit) {
      query = query.limit(Number.parseInt(limit))
    }

    const { data, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
