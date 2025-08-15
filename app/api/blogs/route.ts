import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const status = searchParams.get("status") || "published"
    const countOnly = searchParams.get("count") === "true"

    const supabase = createServerSupabaseClient()

    let query = supabase.from("blogs").select("*", { count: "exact" })

    // Apply filters
    if (search) {
      query = query.or(
        `title_en.ilike.%${search}%,title_ne.ilike.%${search}%,content_en.ilike.%${search}%,content_ne.ilike.%${search}%`,
      )
    }

    if (category) {
      query = query.contains("categories", [category])
    }

    if (status) {
      query = query.eq("status", status)
    }

    if (countOnly) {
      const { count, error } = await query
      if (error) throw error
      return NextResponse.json({ success: true, count })
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query.range(from, to).order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("blogs")
      .insert([
        {
          ...body,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 })
  }
}
