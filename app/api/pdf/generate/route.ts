import { type NextRequest, NextResponse } from "next/server"
import { pdfGenerator } from "@/lib/pdf-generator"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (!type || !data) {
      return NextResponse.json({ error: "Type and data are required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    let result: { pdfUrl: string; pdfBytes: Uint8Array }

    switch (type) {
      case "certificate":
        if (!data.serialNumber || !data.certificateType || !data.recipientName) {
          return NextResponse.json(
            { error: "serialNumber, certificateType, and recipientName are required for certificates" },
            { status: 400 },
          )
        }

        result = await pdfGenerator.generateCertificate({
          recipientName: data.recipientName,
          certificateType: data.certificateType,
          serialNumber: data.serialNumber,
          issueDate: data.issueDate ? new Date(data.issueDate) : new Date(),
          membershipType: data.membershipType,
          donationAmount: data.donationAmount,
          eventName: data.eventName,
          achievementTitle: data.achievementTitle,
          validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
        })

        // Save certificate record to database
        const { error: certError } = await supabase.from("certificates").insert({
          certificate_id: data.serialNumber,
          certificate_type: data.certificateType,
          recipient_name: data.recipientName,
          title: `${data.certificateType} Certificate`,
          description: `Certificate issued for ${data.recipientName}`,
          issue_date: data.issueDate || new Date().toISOString().split("T")[0],
          valid_until: data.validUntil || null,
          pdf_url: result.pdfUrl,
          verification_code: data.verificationCode || Math.random().toString(36).substring(2, 15),
          member_id: data.memberId || null,
          event_id: data.eventId || null,
          donation_id: data.donationId || null,
        })

        if (certError) {
          console.error("Error saving certificate:", certError)
        }

        break

      case "donation-receipt":
        if (!data.receiptNumber || !data.donorName || !data.amount) {
          return NextResponse.json(
            { error: "receiptNumber, donorName, and amount are required for donation receipts" },
            { status: 400 },
          )
        }

        result = await pdfGenerator.generateDonationReceipt({
          receiptNumber: data.receiptNumber,
          donorName: data.donorName,
          amount: data.amount,
          currency: data.currency || "NPR",
          donationDate: data.donationDate ? new Date(data.donationDate) : new Date(),
          paymentMethod: data.paymentMethod || "Online",
          purpose: data.purpose,
          transactionId: data.transactionId,
        })

        // Update donation record with receipt URL
        if (data.donationId) {
          const { error: donationError } = await supabase
            .from("donations")
            .update({ receipt_url: result.pdfUrl })
            .eq("id", data.donationId)

          if (donationError) {
            console.error("Error updating donation with receipt URL:", donationError)
          }
        }

        break

      case "membership-receipt":
        if (!data.memberId) {
          return NextResponse.json({ error: "memberId is required for membership receipts" }, { status: 400 })
        }

        // Get member data
        const { data: memberData, error: memberError } = await supabase
          .from("members")
          .select("*")
          .eq("id", data.memberId)
          .single()

        if (memberError || !memberData) {
          return NextResponse.json({ error: "Member not found" }, { status: 404 })
        }

        result = await pdfGenerator.generateMembershipReceipt(memberData)

        // Update member record with receipt URL
        const { error: updateError } = await supabase
          .from("members")
          .update({ receipt_url: result.pdfUrl })
          .eq("id", data.memberId)

        if (updateError) {
          console.error("Error updating member with receipt URL:", updateError)
        }

        break

      case "event-receipt":
        if (!data.registrationId) {
          return NextResponse.json({ error: "registrationId is required for event receipts" }, { status: 400 })
        }

        // Get registration and event data
        const { data: registrationData, error: regError } = await supabase
          .from("event_registrations")
          .select(`
            *,
            events (*)
          `)
          .eq("id", data.registrationId)
          .single()

        if (regError || !registrationData) {
          return NextResponse.json({ error: "Registration not found" }, { status: 404 })
        }

        result = await pdfGenerator.generateEventReceipt(registrationData, registrationData.events)

        break

      default:
        return NextResponse.json({ error: "Invalid PDF type" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      pdfUrl: result.pdfUrl,
      message: "PDF generated successfully",
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET endpoint to retrieve PDF generation options
export async function GET() {
  try {
    return NextResponse.json({
      supportedTypes: [
        {
          type: "certificate",
          description: "Generate membership, donation, event participation, or achievement certificates",
          requiredFields: ["serialNumber", "certificateType", "recipientName"],
          optionalFields: [
            "issueDate",
            "membershipType",
            "donationAmount",
            "eventName",
            "achievementTitle",
            "validUntil",
          ],
          certificateTypes: ["membership", "donation", "event_participation", "achievement"],
        },
        {
          type: "donation-receipt",
          description: "Generate donation receipts with tax information",
          requiredFields: ["receiptNumber", "donorName", "amount"],
          optionalFields: ["currency", "donationDate", "paymentMethod", "purpose", "transactionId"],
        },
        {
          type: "membership-receipt",
          description: "Generate membership fee receipts",
          requiredFields: ["memberId"],
          optionalFields: [],
        },
        {
          type: "event-receipt",
          description: "Generate event registration receipts",
          requiredFields: ["registrationId"],
          optionalFields: [],
        },
      ],
    })
  } catch (error) {
    console.error("PDF info error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
