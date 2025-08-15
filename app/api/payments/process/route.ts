// Complete payment processing system
import { type NextRequest, NextResponse } from "next/server"
import { EsewaPayment } from "@/lib/esewa-integration"
import { KhaltiPayment } from "@/lib/khalti-integration"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { amount, paymentMethod, donationType, userId } = await request.json()
    const supabase = createServerSupabaseClient()

    // Create pending payment record
    const { data: payment, error } = await supabase
      .from("payments")
      .insert({
        amount,
        payment_method: paymentMethod,
        status: "pending",
        user_id: userId,
        type: donationType,
      })
      .select()
      .single()

    if (error) throw error

    // Process based on payment method
    switch (paymentMethod) {
      case "esewa":
        const esewaForm = EsewaPayment.generatePaymentForm(amount, payment.id)
        return NextResponse.json({
          success: true,
          paymentUrl: "https://uat.esewa.com.np/epay/main",
          formData: esewaForm,
        })

      case "khalti":
        const khaltiResponse = await KhaltiPayment.initiatePayment(amount, payment.id)
        return NextResponse.json({
          success: true,
          paymentUrl: khaltiResponse.payment_url,
        })

      default:
        return NextResponse.json({ error: "Unsupported payment method" }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 })
  }
}
