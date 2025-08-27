import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase" // ✅ use your helper

export async function GET() {
  try {
    const supabase = createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not initialized" }, { status: 500 })
    }

    // Get pending members
    const { data: pendingMembers } = await supabase
      .from("members")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false })

    // Get pending donations
    const { data: pendingDonations } = await supabase
      .from("donations")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false })

    // Get pending event registrations
    const { data: pendingRegistrations } = await supabase
      .from("event_registrations")
      .select(`
        *,
        events (title, title_nepali)
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: false })

    return NextResponse.json({
      members: pendingMembers || [],
      donations: pendingDonations || [],
      registrations: pendingRegistrations || [],
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not initialized" }, { status: 500 })
    }

    const { type, id, action, reason } = await request.json()

    const approvalData = {
      status: action === "approve" ? "approved" : "rejected",
      approved_by: "admin", // In real app, get from session
      approved_date: new Date().toISOString(),
      rejection_reason: action === "reject" ? reason : null,
    }

    let result
    let certificateData = null

    switch (type) {
      case "member":
        result = await supabase.from("members").update(approvalData).eq("member_id", id).select()

        if (action === "approve" && result.data?.[0]) {
          // Generate certificate
          const member = result.data[0]
          const certificateId = `CERT-M-${Date.now()}`

          certificateData = {
            certificate_id: certificateId,
            member_id: member.member_id,
            member_name: member.full_name,
            certificate_type: "membership",
            issue_date: new Date().toISOString().split("T")[0],
            valid_until: member.membership_type === "lifetime" ? null : member.expiry_date,
            status: "active",
            verification_code: `SDB-${Date.now()}-M-VERIFY`,
            generated_by: "admin",
          }

          await supabase.from("certificate_logs").insert([certificateData])

          // Update member with certificate number
          await supabase.from("members").update({ certificate_number: certificateId }).eq("member_id", id)
        }
        break

      case "donation":
        result = await supabase.from("donations").update(approvalData).eq("donation_id", id).select()

        if (action === "approve" && result.data?.[0]) {
          // Generate receipt
          const donation = result.data[0]
          const receiptId = `REC-D-${Date.now()}`

          certificateData = {
            certificate_id: receiptId,
            member_id: null,
            member_name: donation.donor_name,
            certificate_type: "donation_receipt",
            issue_date: new Date().toISOString().split("T")[0],
            valid_until: null,
            status: "active",
            verification_code: `SDB-${Date.now()}-D-VERIFY`,
            generated_by: "admin",
          }

          await supabase.from("certificate_logs").insert([certificateData])

          // Update donation with receipt number
          await supabase.from("donations").update({ receipt_number: receiptId }).eq("donation_id", id)
        }
        break

      case "registration":
        result = await supabase.from("event_registrations").update(approvalData).eq("registration_id", id).select()
        break

      default:
        return NextResponse.json({ error: "Invalid approval type" }, { status: 400 })
    }

    if (result?.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: result?.data?.[0],
      certificate: certificateData,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
