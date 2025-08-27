import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection unavailable" }, { status: 503 })
    }
    const { data, error } = await supabase.from("library_items").select("*").eq("id", params.id).single()

    if (error) {
      console.error("Error fetching library item:", error)
      return NextResponse.json({ error: "Library item not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in library GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection unavailable" }, { status: 503 })
    }
    const body = await request.json()
    const { title, description, category, type, file_url, thumbnail_url, file_size, is_free, tags } = body

    const { data, error } = await supabase
      .from("library_items")
      .update({
        title,
        description,
        category,
        type,
        file_url,
        thumbnail_url,
        file_size,
        is_free,
        tags,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating library item:", error)
      return NextResponse.json({ error: "Failed to update library item" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in library PUT:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection unavailable" }, { status: 503 })
    }
    const { error } = await supabase.from("library_items").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting library item:", error)
      return NextResponse.json({ error: "Failed to delete library item" }, { status: 500 })
    }

    return NextResponse.json({ message: "Library item deleted successfully" })
  } catch (error) {
    console.error("Error in library DELETE:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
