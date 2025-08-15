interface StripeConfig {
  publishableKey: string
  secretKey: string
  webhookSecret: string
}

interface StripeSessionData {
  amount: number
  currency: string
  description: string
  success_url: string
  cancel_url: string
  customer_email?: string
}

export class StripePayment {
  private config: StripeConfig

  constructor() {
    this.config = {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "",
      secretKey: process.env.STRIPE_SECRET_KEY || "",
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
    }
  }

  async createCheckoutSession(sessionData: StripeSessionData): Promise<{ id: string; url: string } | null> {
    try {
      const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.secretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          mode: "payment",
          success_url: sessionData.success_url,
          cancel_url: sessionData.cancel_url,
          "line_items[0][price_data][currency]": sessionData.currency,
          "line_items[0][price_data][product_data][name]": sessionData.description,
          "line_items[0][price_data][unit_amount]": (sessionData.amount * 100).toString(),
          "line_items[0][quantity]": "1",
          ...(sessionData.customer_email && { customer_email: sessionData.customer_email }),
        }),
      })

      const result = await response.json()

      if (result.id && result.url) {
        return {
          id: result.id,
          url: result.url,
        }
      }

      return null
    } catch (error) {
      console.error("Stripe session creation error:", error)
      return null
    }
  }

  async retrieveSession(sessionId: string): Promise<{ status: string; payment_intent?: string }> {
    try {
      const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.config.secretKey}`,
        },
      })

      const result = await response.json()

      return {
        status: result.payment_status,
        payment_intent: result.payment_intent,
      }
    } catch (error) {
      console.error("Stripe session retrieval error:", error)
      return { status: "failed" }
    }
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const crypto = require("crypto")
      const expectedSignature = crypto
        .createHmac("sha256", this.config.webhookSecret)
        .update(payload, "utf8")
        .digest("hex")

      return crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expectedSignature, "hex"))
    } catch (error) {
      console.error("Stripe webhook verification error:", error)
      return false
    }
  }
}
