import { type NextRequest, NextResponse } from "next/server"
import { PaymentManager, type PaymentMethod, type PaymentData } from "@/lib/payment-manager"
import { createServerSupabaseClient } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { method, amount, currency, description, type, customerInfo } = body

    // Validate required fields
    if (!method || !amount || !currency || !description || !type || !customerInfo) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate payment method
    const validMethods: PaymentMethod[] = [
      "esewa",
      "khalti",
      "paypal",
      "stripe",
      "imepay",
      "connectips",
      "bank",
      "cash",
    ]
    if (!validMethods.includes(method)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 })
    }

    // Validate amount limits
    const minAmount =
      type === "donation"
        ? Number.parseInt(process.env.MIN_DONATION_AMOUNT || "100")
        : Number.parseInt(process.env.MIN_MEMBERSHIP_FEE || "500")

    const maxAmount =
      type === "donation"
        ? Number.parseInt(process.env.MAX_DONATION_AMOUNT || "1000000")
        : Number.parseInt(process.env.MAX_MEMBERSHIP_FEE || "50000")

    if (amount < minAmount || amount > maxAmount) {
      return NextResponse.json({ error: `Amount must be between ${minAmount} and ${maxAmount}` }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    const orderId = uuidv4()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    // Create payment record in database
    const { error: dbError } = await supabase.from("payments").insert({
      id: orderId,
      method,
      amount,
      currency,
      description,
      type,
      status: "pending",
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phone,
      created_at: new Date().toISOString(),
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to create payment record" }, { status: 500 })
    }

    // Prepare payment data
    const paymentData: PaymentData = {
      amount,
      currency,
      description,
      orderId,
      customerInfo,
      successUrl: `${siteUrl}/payment/success?orderId=${orderId}&method=${method}`,
      failureUrl: `${siteUrl}/payment/failure?orderId=${orderId}&method=${method}`,
    }

    // Initialize payment
    const paymentManager = new PaymentManager()
    const result = await paymentManager.initiatePayment(method, paymentData)

    if (result.success) {
      return NextResponse.json({
        success: true,
        orderId,
        redirectUrl: result.redirectUrl,
        formHtml: result.formHtml,
      })
    } else {
      // Update payment status to failed
      await supabase.from("payments").update({ status: "failed", error_message: result.error }).eq("id", orderId)

      return NextResponse.json({ error: result.error || "Payment initiation failed" }, { status: 500 })
    }
  } catch (error) {
    console.error("Payment initiation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
