import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    let query = supabase.from("projects").select("*").order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }

    const { data: projects, error } = await query.range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching projects:", error)
      return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
    }

    // Get total count for pagination
    const { count } = await supabase.from("projects").select("*", { count: "exact", head: true })

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Error in projects GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      image_url,
      goal_amount,
      raised_amount,
      currency,
      start_date,
      end_date,
      location,
      beneficiaries,
      status,
      category,
    } = body

    // Validate required fields
    if (!title || !description || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          title,
          description,
          image_url,
          goal_amount,
          raised_amount: raised_amount || 0,
          currency: currency || "NPR",
          start_date,
          end_date,
          location,
          beneficiaries: beneficiaries || 0,
          status: status || "ongoing",
          category,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating project:", error)
      return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error in projects POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
