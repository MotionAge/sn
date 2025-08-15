import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
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

    const { data, error } = await supabase
      .from("global_presence")
      .update({
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
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating global presence:", error)
      return NextResponse.json({ error: "Failed to update global presence" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in global-presence PUT:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabase.from("global_presence").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting global presence:", error)
      return NextResponse.json({ error: "Failed to delete global presence" }, { status: 500 })
    }

    return NextResponse.json({ message: "Global presence deleted successfully" })
  } catch (error) {
    console.error("Error in global-presence DELETE:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
