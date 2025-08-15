import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page_id = searchParams.get("page_id")
    const category = searchParams.get("category")

    let query = supabase.from("faqs").select("*").eq("is_active", true).order("order_index", { ascending: true })

    if (page_id) {
      query = query.eq("page_id", page_id)
    }

    if (category) {
      query = query.eq("category", category)
    }

    const { data: faqs, error } = await query

    if (error) {
      console.error("Error fetching FAQs:", error)
      return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 })
    }

    return NextResponse.json(faqs)
  } catch (error) {
    console.error("Error in faqs GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question_en, question_ne, answer_en, answer_ne, page_id, category, order_index, is_active } = body

    // Validate required fields
    if (!question_en || !answer_en || !page_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("faqs")
      .insert([
        {
          question_en,
          question_ne,
          answer_en,
          answer_ne,
          page_id,
          category,
          order_index: order_index || 0,
          is_active: is_active !== false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating FAQ:", error)
      return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error in faqs POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
