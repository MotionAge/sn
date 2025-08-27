import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function GET() {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return NextResponse.json({ error: "Database connection unavailable" }, { status: 503 })
  }

  try {
    // Get total donations amount
    const { data: donationsData, error: donationsError } = await supabase
      .from("donations")
      .select("amount")
      .eq("status", "completed")

    if (donationsError) {
      console.error("Error fetching donations:", donationsError)
      return NextResponse.json({ error: "Failed to fetch donation stats" }, { status: 500 })
    }

    // Get unique donors count
    const { data: donorsData, error: donorsError } = await supabase
      .from("donations")
      .select("donor_email")
      .eq("status", "completed")

    if (donorsError) {
      console.error("Error fetching donors:", donorsError)
      return NextResponse.json({ error: "Failed to fetch donor stats" }, { status: 500 })
    }

    // Get active projects count
    const { data: projectsData, error: projectsError } = await supabase
      .from("projects")
      .select("id")
      .eq("status", "active")

    if (projectsError) {
      console.error("Error fetching projects:", projectsError)
      return NextResponse.json({ error: "Failed to fetch project stats" }, { status: 500 })
    }

    const totalDonations = donationsData?.reduce((sum, donation) => sum + donation.amount, 0) || 0
    const uniqueDonors = new Set(donorsData?.map((d) => d.donor_email) || []).size
    const activeProjects = projectsData?.length || 0

    return NextResponse.json({
      success: true,
      data: {
        totalDonations,
        totalDonors: uniqueDonors,
        activeProjects,
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
