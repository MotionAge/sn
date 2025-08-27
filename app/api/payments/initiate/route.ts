import { type NextRequest, NextResponse } from "next/server"
import { paymentManager, type PaymentRequest } from "@/lib/payment-manager"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const paymentRequest: PaymentRequest = {
      gateway: body.gateway,
      amount: Number.parseFloat(body.amount),
      currency: body.currency || "NPR",
      description: body.description,
      customerInfo: {
        name: body.customerInfo.name,
        email: body.customerInfo.email,
        phone: body.customerInfo.phone,
      },
      metadata: body.metadata || {},
      returnUrl: body.returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      cancelUrl: body.cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/failure`,
    }

    // Validate required fields
    if (
      !paymentRequest.gateway ||
      !paymentRequest.amount ||
      !paymentRequest.customerInfo.name ||
      !paymentRequest.customerInfo.email
    ) {
      return NextResponse.json(
        { error: "Missing required fields: gateway, amount, customerInfo.name, customerInfo.email" },
        { status: 400 },
      )
    }

    // Validate amount
    if (paymentRequest.amount <= 0) {
      return NextResponse.json({ error: "Amount must be greater than 0" }, { status: 400 })
    }

    // Validate gateway
    const supportedGateways = ["esewa", "khalti", "paypal", "stripe", "imepay", "connectips", "bank_transfer", "cash"]
    if (!supportedGateways.includes(paymentRequest.gateway)) {
      return NextResponse.json(
        { error: `Unsupported payment gateway. Supported gateways: ${supportedGateways.join(", ")}` },
        { status: 400 },
      )
    }

    const result = await paymentManager.initiatePayment(paymentRequest)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      transactionId: result.transactionId,
      paymentUrl: result.paymentUrl,
      formHtml: result.formHtml,
      data: result.data,
    })
  } catch (error) {
    console.error("Payment initiation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
