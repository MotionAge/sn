import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection unavailable" }, { status: 503 })
    }
    const { data: branches, error } = await supabase
      .from("global_presence")
      .select("*")
      .order("country", { ascending: true })

    if (error) {
      console.error("Error fetching global presence:", error)
      return NextResponse.json({ error: "Failed to fetch global presence" }, { status: 500 })
    }

    return NextResponse.json(branches)
  } catch (error) {
    console.error("Error in global-presence GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection unavailable" }, { status: 503 })
    }
    const body = await request.json()
    const {
      country,
      city,
      address,
      contact_person,
      phone,
      email,
      established_date,
      member_count,
      status,
      coordinates,
    } = body

    // Validate required fields
    if (!country || !city || !contact_person || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("global_presence")
      .insert([
        {
          country,
          city,
          address,
          contact_person,
          phone,
          email,
          established_date,
          member_count: member_count || 0,
          status: status || "active",
          coordinates,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating global presence:", error)
      return NextResponse.json({ error: "Failed to create global presence" }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error in global-presence POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
