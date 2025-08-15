import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { question_en, question_ne, answer_en, answer_ne, page_id, category, order_index, is_active } = body

    const { data, error } = await supabase
      .from("faqs")
      .update({
        question_en,
        question_ne,
        answer_en,
        answer_ne,
        page_id,
        category,
        order_index,
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating FAQ:", error)
      return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in faqs PUT:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabase.from("faqs").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting FAQ:", error)
      return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 })
    }

    return NextResponse.json({ message: "FAQ deleted successfully" })
  } catch (error) {
    console.error("Error in faqs DELETE:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
