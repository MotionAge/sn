import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection unavailable" }, { status: 503 })
    }
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    let query = supabase.from("library_items").select("*").order("created_at", { ascending: false })

    if (category) {
      query = query.eq("category", category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data: items, error } = await query.range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching library items:", error)
      return NextResponse.json({ error: "Failed to fetch library items" }, { status: 500 })
    }

    // Get total count for pagination
    const { count } = await supabase.from("library_items").select("*", { count: "exact", head: true })

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Error in library GET:", error)
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
    const { title, description, category, type, file_url, thumbnail_url, file_size, is_free, tags } = body

    // Validate required fields
    if (!title || !description || !category || !type || !file_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("library_items")
      .insert([
        {
          title,
          description,
          category,
          type,
          file_url,
          thumbnail_url,
          file_size,
          is_free: is_free || false,
          tags: tags || [],
          download_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating library item:", error)
      return NextResponse.json({ error: "Failed to create library item" }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error in library POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
