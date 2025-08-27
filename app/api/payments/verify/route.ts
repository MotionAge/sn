import { type NextRequest, NextResponse } from "next/server"
import { paymentManager } from "@/lib/payment-manager"
import { createServerSupabaseClient } from "@/lib/supabase"
import { emailService } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { gateway, transactionId, ...additionalData } = body

    if (!gateway || !transactionId) {
      return NextResponse.json({ error: "Missing required fields: gateway, transactionId" }, { status: 400 })
    }

    const result = await paymentManager.verifyPayment(gateway, transactionId, additionalData)

    if (result.success) {
      const supabase = createServerSupabaseClient()

      // Get payment details
      const { data: payment } = await supabase.from("payments").select("*").eq("id", transactionId).single()

      if (payment) {
        // Update payment status
        await supabase
          .from("payments")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
          })
          .eq("id", transactionId)

        // Update related records based on reference type
        if (payment.reference_type === "donation") {
          await supabase
            .from("donations")
            .update({
              payment_status: "completed",
              payment_verified_at: new Date().toISOString(),
            })
            .eq("id", payment.reference_id)

          // Send donation confirmation email
          if (payment.customer_email) {
            const { data: donation } = await supabase
              .from("donations")
              .select("*")
              .eq("id", payment.reference_id)
              .single()

            if (donation) {
              await emailService.sendEmail({
                to: payment.customer_email,
                template: "donation-confirmation",
                templateData: {
                  donorName: payment.customer_name,
                  amount: payment.amount,
                  currency: payment.currency,
                  receiptNumber: donation.donation_id,
                  donationDate: payment.completed_at,
                  paymentMethod: payment.payment_gateway,
                  purpose: donation.purpose,
                  message: donation.message,
                },
                referenceType: "donation",
                referenceId: payment.reference_id,
              })

              // Generate donation receipt PDF
              await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/pdf/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: "donation-receipt",
                  data: {
                    receiptNumber: donation.donation_id,
                    donorName: payment.customer_name,
                    amount: payment.amount,
                    currency: payment.currency,
                    donationDate: new Date(payment.completed_at),
                    paymentMethod: payment.payment_gateway,
                    purpose: donation.purpose,
                    transactionId: payment.gateway_transaction_id,
                    donationId: payment.reference_id,
                  },
                }),
              })
            }
          }
        } else if (payment.reference_type === "membership") {
          await supabase
            .from("members")
            .update({
              payment_status: "completed",
              membership_status: "active",
              payment_verified_at: new Date().toISOString(),
            })
            .eq("id", payment.reference_id)

          // Send membership welcome email
          if (payment.customer_email) {
            const { data: member } = await supabase.from("members").select("*").eq("id", payment.reference_id).single()

            if (member) {
              await emailService.sendEmail({
                to: payment.customer_email,
                template: "membership-welcome",
                templateData: {
                  fullName: member.full_name,
                  memberId: member.member_id,
                  membershipType: member.membership_type,
                  joinDate: member.join_date,
                  expiryDate: member.expiry_date,
                },
                referenceType: "membership",
                referenceId: payment.reference_id,
              })

              // Generate membership certificate
              await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/pdf/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: "certificate",
                  data: {
                    serialNumber: `CERT-${member.member_id}`,
                    certificateType: "membership",
                    recipientName: member.full_name,
                    membershipType: member.membership_type,
                    issueDate: new Date(),
                    validUntil: member.expiry_date ? new Date(member.expiry_date) : null,
                    memberId: member.id,
                  },
                }),
              })
            }
          }
        } else if (payment.reference_type === "event_registration") {
          await supabase
            .from("event_registrations")
            .update({
              payment_status: "completed",
              registration_status: "confirmed",
            })
            .eq("id", payment.reference_id)

          // Send event registration confirmation email
          if (payment.customer_email) {
            const { data: registration } = await supabase
              .from("event_registrations")
              .select(`
                *,
                events (
                  title,
                  event_date,
                  start_time,
                  end_time,
                  venue,
                  organizer_email,
                  organizer_phone
                )
              `)
              .eq("id", payment.reference_id)
              .single()

            if (registration && registration.events) {
              await emailService.sendEmail({
                to: payment.customer_email,
                template: "event-registration",
                templateData: {
                  participantName: registration.participant_name,
                  eventTitle: registration.events.title,
                  eventDate: registration.events.event_date,
                  startTime: registration.events.start_time,
                  endTime: registration.events.end_time,
                  venue: registration.events.venue,
                  registrationId: registration.registration_id,
                  registrationFee: registration.registration_fee,
                  currency: payment.currency,
                  specialRequests: registration.special_requests,
                  contactEmail: registration.events.organizer_email,
                  contactPhone: registration.events.organizer_phone,
                },
                referenceType: "event_registration",
                referenceId: payment.reference_id,
              })
            }
          }
        }

        // Send general payment success email
        if (payment.customer_email) {
          await emailService.sendEmail({
            to: payment.customer_email,
            template: "payment-success",
            templateData: {
              customerName: payment.customer_name,
              amount: payment.amount,
              currency: payment.currency,
              paymentId: payment.payment_id,
              transactionId: payment.gateway_transaction_id,
              paymentMethod: payment.payment_gateway,
              paymentDate: payment.completed_at,
              description: payment.description,
            },
            referenceType: payment.reference_type,
            referenceId: payment.reference_id,
          })
        }
      }
    }

    return NextResponse.json({
      success: result.success,
      transactionId: result.transactionId,
      error: result.error,
      data: result.data,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
