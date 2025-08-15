import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status") || ""
    const countOnly = searchParams.get("count") === "true"

    const supabase = createServerSupabaseClient()

    let query = supabase.from("donations").select("*", { count: "exact" })

    if (status) {
      query = query.eq("status", status)
    }

    if (countOnly) {
      // Get total amount instead of count for donations
      const { data, error } = await supabase.from("donations").select("amount").eq("status", "completed")

      if (error) throw error

      const totalAmount = data?.reduce((sum, donation) => sum + (donation.amount || 0), 0) || 0
      return NextResponse.json({ success: true, totalAmount, count: data?.length || 0 })
    }

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
    console.error("Error fetching donations:", error)
    return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("donations")
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
    console.error("Error creating donation:", error)
    return NextResponse.json({ error: "Failed to create donation" }, { status: 500 })
  }
}
