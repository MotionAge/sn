import Stripe from "stripe"

export interface StripeConfig {
  secretKey: string
  publishableKey: string
  webhookSecret: string
  environment: "test" | "live"
}

export interface StripeSessionData {
  line_items: Array<{
    price_data: {
      currency: string
      product_data: {
        name: string
        description?: string
      }
      unit_amount: number
    }
    quantity: number
  }>
  mode: "payment" | "subscription" | "setup"
  success_url: string
  cancel_url: string
  customer_email?: string
  metadata?: Record<string, string>
}

export class StripeGateway {
  private stripe: Stripe
  private config: StripeConfig

  constructor(config: StripeConfig) {
    this.config = config
    this.stripe = new Stripe(config.secretKey, {
      apiVersion: "2023-10-16",
    })
  }

  async createCheckoutSession(sessionData: StripeSessionData): Promise<Stripe.Checkout.Session> {
    try {
      const session = await this.stripe.checkout.sessions.create(sessionData)
      return session
    } catch (error) {
      console.error("Stripe session creation error:", error)
      throw error
    }
  }

  async retrieveSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId)
      return session
    } catch (error) {
      console.error("Stripe session retrieval error:", error)
      throw error
    }
  }

  async createPaymentIntent(
    amount: number,
    currency = "usd",
    metadata?: Record<string, string>,
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        metadata: metadata || {},
      })
      return paymentIntent
    } catch (error) {
      console.error("Stripe payment intent error:", error)
      throw error
    }
  }

  async confirmPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId)
      return paymentIntent
    } catch (error) {
      console.error("Stripe payment confirmation error:", error)
      throw error
    }
  }

  async constructWebhookEvent(payload: string | Buffer, signature: string): Promise<Stripe.Event> {
    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, this.config.webhookSecret)
      return event
    } catch (error) {
      console.error("Stripe webhook error:", error)
      throw error
    }
  }

  async handleWebhook(event: Stripe.Event): Promise<any> {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session
        return { type: "payment_success", session }

      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        return { type: "payment_confirmed", paymentIntent }

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object as Stripe.PaymentIntent
        return { type: "payment_failed", paymentIntent: failedPayment }

      default:
        return { type: "unhandled", event }
    }
  }
}
