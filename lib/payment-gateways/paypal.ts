interface PayPalConfig {
  clientId: string
  clientSecret: string
  environment: "sandbox" | "production"
}

interface PayPalOrderData {
  amount: string
  currency: string
  description: string
  return_url: string
  cancel_url: string
}

export class PayPalPayment {
  private config: PayPalConfig
  private baseUrl: string

  constructor() {
    this.config = {
      clientId: process.env.PAYPAL_CLIENT_ID || "",
      clientSecret: process.env.PAYPAL_CLIENT_SECRET || "",
      environment: (process.env.PAYPAL_ENVIRONMENT as "sandbox" | "production") || "sandbox",
    }

    this.baseUrl =
      this.config.environment === "production" ? "https://api.paypal.com" : "https://api.sandbox.paypal.com"
  }

  async getAccessToken(): Promise<string | null> {
    try {
      const auth = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString("base64")

      const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      })

      const result = await response.json()
      return result.access_token || null
    } catch (error) {
      console.error("PayPal token error:", error)
      return null
    }
  }

  async createOrder(orderData: PayPalOrderData): Promise<{ id: string; approval_url: string } | null> {
    try {
      const accessToken = await this.getAccessToken()
      if (!accessToken) return null

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: orderData.currency,
                value: orderData.amount,
              },
              description: orderData.description,
            },
          ],
          application_context: {
            return_url: orderData.return_url,
            cancel_url: orderData.cancel_url,
          },
        }),
      })

      const result = await response.json()

      if (result.id) {
        const approvalUrl = result.links?.find((link: any) => link.rel === "approve")?.href
        return {
          id: result.id,
          approval_url: approvalUrl,
        }
      }

      return null
    } catch (error) {
      console.error("PayPal order creation error:", error)
      return null
    }
  }

  async captureOrder(orderId: string): Promise<{ status: string; transaction_id?: string }> {
    try {
      const accessToken = await this.getAccessToken()
      if (!accessToken) return { status: "failed" }

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()

      return {
        status: result.status === "COMPLETED" ? "completed" : "failed",
        transaction_id: result.purchase_units?.[0]?.payments?.captures?.[0]?.id,
      }
    } catch (error) {
      console.error("PayPal capture error:", error)
      return { status: "failed" }
    }
  }
}
