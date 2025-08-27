import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getSupabaseClient()

    if (!supabase) {
      return NextResponse.json(
        {
          success: false,
          error: "Database connection unavailable",
          data: [],
        },
        { status: 503 },
      )
    }

    const { data: slides, error } = await supabase
      .from("carousel_slides")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching carousel slides:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch carousel slides",
          data: [],
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: slides || [],
    })
  } catch (error) {
    console.error("Carousel slides API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        data: [],
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseClient()

    if (!supabase) {
      return NextResponse.json({ success: false, error: "Database connection unavailable" }, { status: 503 })
    }

    const body = await request.json()
    const {
      title_en,
      title_ne,
      description_en,
      description_ne,
      image_url,
      cta_text_en,
      cta_text_ne,
      cta_link,
      display_order,
      is_active = true,
    } = body

    const { data, error } = await supabase
      .from("carousel_slides")
      .insert([
        {
          title_en,
          title_ne,
          description_en,
          description_ne,
          image_url,
          cta_text_en,
          cta_text_ne,
          cta_link,
          display_order,
          is_active,
        },
      ])
      .select()

    if (error) {
      console.error("Error creating carousel slide:", error)
      return NextResponse.json({ success: false, error: "Failed to create carousel slide" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: data[0],
    })
  } catch (error) {
    console.error("Carousel slides POST API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
