import { type NextRequest, NextResponse } from "next/server"
import { emailService } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, html, text, template, templateData, referenceType, referenceId } = body

    if (!to) {
      return NextResponse.json({ error: "Recipient email is required" }, { status: 400 })
    }

    if (!template && !subject) {
      return NextResponse.json({ error: "Either template or subject is required" }, { status: 400 })
    }

    if (!template && !html && !text) {
      return NextResponse.json(
        { error: "Email content (html or text) is required when not using template" },
        { status: 400 },
      )
    }

    const success = await emailService.sendEmail({
      to,
      subject,
      html,
      text,
      template,
      templateData,
      referenceType,
      referenceId,
    })

    if (success) {
      return NextResponse.json({ success: true, message: "Email sent successfully" })
    } else {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Email send error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET endpoint to retrieve email templates (for admin use)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const template = searchParams.get("template")

    if (!template) {
      return NextResponse.json({
        templates: [
          "donation-confirmation",
          "membership-welcome",
          "membership-approval",
          "event-registration",
          "payment-success",
          "contact-form",
        ],
      })
    }

    // Return template structure for preview (without actual sending)
    const templateStructure = {
      "donation-confirmation": {
        subject: "Donation Confirmation - Receipt #{{receiptNumber}}",
        requiredData: ["donorName", "amount", "currency", "receiptNumber", "donationDate", "paymentMethod"],
        optionalData: ["purpose", "message"],
      },
      "membership-welcome": {
        subject: "Welcome to Sanatan Dharma Bikash Nepal!",
        requiredData: ["fullName", "memberId", "membershipType", "joinDate"],
        optionalData: ["expiryDate"],
      },
      "membership-approval": {
        subject: "Membership Application Approved",
        requiredData: ["fullName", "memberId", "membershipType", "certificateNumber"],
        optionalData: [],
      },
      "event-registration": {
        subject: "Event Registration Confirmation - {{eventTitle}}",
        requiredData: ["participantName", "eventTitle", "eventDate", "startTime", "endTime", "venue", "registrationId"],
        optionalData: ["registrationFee", "currency", "specialRequests", "contactEmail", "contactPhone"],
      },
      "payment-success": {
        subject: "Payment Successful",
        requiredData: [
          "customerName",
          "amount",
          "currency",
          "paymentId",
          "transactionId",
          "paymentMethod",
          "paymentDate",
          "description",
        ],
        optionalData: [],
      },
      "contact-form": {
        subject: "New Contact Form Submission from {{name}}",
        requiredData: ["name", "email", "subject", "message"],
        optionalData: ["phone"],
      },
    }

    const templateInfo = templateStructure[template as keyof typeof templateStructure]

    if (!templateInfo) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    return NextResponse.json({ template, ...templateInfo })
  } catch (error) {
    console.error("Email template info error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
