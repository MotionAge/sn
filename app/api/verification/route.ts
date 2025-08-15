import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Try to determine the type of query and search accordingly
    let result = null
    const type = ""

    // Check if it's a member ID (starts with M)
    if (query.startsWith("M")) {
      const { data } = await supabase.from("members").select("*").eq("member_id", query).single()

      if (data) {
        result = { type: "member", found: true, data }
      }
    }
    // Check if it's a certificate (starts with CERT)
    else if (query.startsWith("CERT")) {
      const { data } = await supabase.from("certificate_logs").select("*").eq("certificate_id", query).single()

      if (data) {
        result = { type: "certificate", found: true, data }
      }
    }
    // Check if it's a donation ID (starts with D)
    else if (query.startsWith("D")) {
      const { data } = await supabase.from("donations").select("*").eq("donation_id", query).single()

      if (data) {
        result = { type: "donation", found: true, data }
      }
    }
    // Check if it's a receipt (starts with REC)
    else if (query.startsWith("REC")) {
      const { data } = await supabase.from("donations").select("*").eq("receipt_number", query).single()

      if (data) {
        result = { type: "receipt", found: true, data }
      }
    }
    // If no specific pattern, search across all tables
    else {
      // Search members by email or phone
      const { data: memberData } = await supabase
        .from("members")
        .select("*")
        .or(`email.eq.${query},phone.eq.${query}`)
        .single()

      if (memberData) {
        result = { type: "member", found: true, data: memberData }
      } else {
        // Search by verification code
        const { data: certData } = await supabase
          .from("certificate_logs")
          .select("*")
          .eq("verification_code", query)
          .single()

        if (certData) {
          result = { type: "certificate", found: true, data: certData }
        }
      }
    }

    if (!result) {
      result = {
        type: "unknown",
        found: false,
        message: "No records found for the provided query. Please check the ID and try again.",
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
