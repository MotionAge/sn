import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection not available" }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const membershipType = searchParams.get("membershipType") || ""

    const offset = (page - 1) * limit

    let query = supabase.from("members").select(`
        *,
        donations:donations(count),
        events:event_registrations(count)
      `)

    // Add search filter
    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,member_id.ilike.%${search}%`,
      )
    }

    // Add status filter
    if (status) {
      query = query.eq("status", status)
    }

    // Add membership type filter
    if (membershipType) {
      query = query.eq("membership_type", membershipType)
    }

    // Get total count
    const { count } = await supabase.from("members").select("*", { count: "exact", head: true })

    // Get paginated results
    const { data: members, error } = await query
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching members:", error)
      return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
    }

    return NextResponse.json({
      members: members || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Error in members API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection not available" }, { status: 503 })
    }

    const memberData = await request.json()

    // Validate required fields
    const requiredFields = ["full_name", "email", "phone", "membership_type"]
    for (const field of requiredFields) {
      if (!memberData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Check if email already exists
    const { data: existingMember } = await supabase
      .from("members")
      .select("email")
      .eq("email", memberData.email)
      .single()

    if (existingMember) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    // Insert new member
    const { data: member, error } = await supabase
      .from("members")
      .insert([
        {
          ...memberData,
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating member:", error)
      return NextResponse.json({ error: "Failed to create member" }, { status: 500 })
    }

    return NextResponse.json({ member }, { status: 201 })
  } catch (error) {
    console.error("Error in members POST API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection not available" }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get("id")

    if (!memberId) {
      return NextResponse.json({ error: "Member ID is required" }, { status: 400 })
    }

    const updateData = await request.json()

    // Update member
    const { data: member, error } = await supabase
      .from("members")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", memberId)
      .select()
      .single()

    if (error) {
      console.error("Error updating member:", error)
      return NextResponse.json({ error: "Failed to update member" }, { status: 500 })
    }

    // If status changed to approved, send welcome email and generate certificate
    if (updateData.status === "approved") {
      try {
        // Send welcome email
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            template: "membership_welcome",
            to: member.email,
            data: {
              memberName: member.full_name,
              memberId: member.member_id,
              membershipType: member.membership_type,
            },
          }),
        })

        // Generate membership certificate
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/pdf/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "membership_certificate",
            data: {
              memberName: member.full_name,
              memberId: member.member_id,
              membershipType: member.membership_type,
              issueDate: new Date().toLocaleDateString(),
            },
          }),
        })
      } catch (emailError) {
        console.error("Error sending welcome email/certificate:", emailError)
        // Don't fail the main operation if email fails
      }
    }

    return NextResponse.json({ member })
  } catch (error) {
    console.error("Error in members PUT API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
