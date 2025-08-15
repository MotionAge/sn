import { type NextRequest, NextResponse } from "next/server"
import { PaymentManager, type PaymentMethod } from "@/lib/payment-manager"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, method, verificationData } = body

    if (!orderId || !method) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Get payment record
    const { data: payment, error: fetchError } = await supabase.from("payments").select("*").eq("id", orderId).single()

    if (fetchError || !payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Verify payment with gateway
    const paymentManager = new PaymentManager()
    const verification = await paymentManager.verifyPayment(method as PaymentMethod, verificationData)

    if (verification.verified) {
      // Update payment status to completed
      const { error: updateError } = await supabase
        .from("payments")
        .update({
          status: "completed",
          transaction_id: verification.transactionId,
          verified_at: new Date().toISOString(),
        })
        .eq("id", orderId)

      if (updateError) {
        console.error("Database update error:", updateError)
        return NextResponse.json({ error: "Failed to update payment status" }, { status: 500 })
      }

      // If it's a membership payment, create member record
      if (payment.type === "membership") {
        const { error: memberError } = await supabase.from("members").insert({
          name: payment.customer_name,
          email: payment.customer_email,
          phone: payment.customer_phone,
          membership_type: "regular",
          status: "pending",
          payment_id: orderId,
          created_at: new Date().toISOString(),
        })

        if (memberError) {
          console.error("Member creation error:", memberError)
        }
      }

      // If it's a donation, create donation record
      if (payment.type === "donation") {
        const { error: donationError } = await supabase.from("donations").insert({
          donor_name: payment.customer_name,
          donor_email: payment.customer_email,
          donor_phone: payment.customer_phone,
          amount: payment.amount,
          currency: payment.currency,
          payment_method: payment.method,
          transaction_id: verification.transactionId,
          status: "completed",
          payment_id: orderId,
          created_at: new Date().toISOString(),
        })

        if (donationError) {
          console.error("Donation creation error:", donationError)
        }
      }

      return NextResponse.json({
        success: true,
        verified: true,
        transactionId: verification.transactionId,
      })
    } else {
      // Update payment status to failed
      await supabase.from("payments").update({ status: "failed" }).eq("id", orderId)

      return NextResponse.json({
        success: false,
        verified: false,
        error: "Payment verification failed",
      })
    }
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")
    const method = searchParams.get("method")

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Get payment status
    const { data: payment, error } = await supabase.from("payments").select("*").eq("id", orderId).single()

    if (error || !payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        method: payment.method,
        transactionId: payment.transaction_id,
        createdAt: payment.created_at,
        verifiedAt: payment.verified_at,
      },
    })
  } catch (error) {
    console.error("Payment status check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
