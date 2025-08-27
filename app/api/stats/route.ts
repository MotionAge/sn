import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function GET() {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return NextResponse.json({ error: "Database connection unavailable" }, { status: 503 })
  }

  try {
    // Get all stats in parallel
    const [membersResult, eventsResult, blogsResult, donationsResult] = await Promise.all([
      supabase.from("members").select("id", { count: "exact" }).eq("status", "approved"),
      supabase.from("events").select("id", { count: "exact" }).eq("status", "active"),
      supabase.from("blogs").select("id", { count: "exact" }).eq("status", "published"),
      supabase.from("donations").select("amount").eq("status", "completed"),
    ])

    const totalMembers = membersResult.count || 0
    const totalEvents = eventsResult.count || 0
    const totalBlogs = blogsResult.count || 0
    const totalDonations = donationsResult.data?.reduce((sum, donation) => sum + donation.amount, 0) || 0

    return NextResponse.json({
      success: true,
      data: {
        totalMembers,
        totalEvents,
        totalBlogs,
        totalDonations,
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
