import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection not available" }, { status: 503 })
    }

    // Rest of your code here...
    
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    // fallback if it's not an Error object
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 })
  }
}
