export interface PayPalConfig {
  clientId: string
  clientSecret: string
  environment: "sandbox" | "production"
}

export interface PayPalOrderData {
  intent: "CAPTURE"
  purchase_units: Array<{
    amount: {
      currency_code: string
      value: string
    }
    description?: string
    reference_id?: string
  }>
  application_context?: {
    return_url: string
    cancel_url: string
    brand_name?: string
    landing_page?: "LOGIN" | "BILLING" | "NO_PREFERENCE"
    user_action?: "CONTINUE" | "PAY_NOW"
  }
}

export class PayPalGateway {
  private config: PayPalConfig
  private baseUrl: string

  constructor(config: PayPalConfig) {
    this.config = config
    this.baseUrl = config.environment === "production" ? "https://api.paypal.com" : "https://api.sandbox.paypal.com"
  }

  async getAccessToken(): Promise<string> {
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

      if (!response.ok) {
        throw new Error("Failed to get PayPal access token")
      }

      const data = await response.json()
      return data.access_token
    } catch (error) {
      console.error("PayPal auth error:", error)
      throw error
    }
  }

  async createOrder(orderData: PayPalOrderData): Promise<any> {
    try {
      const accessToken = await this.getAccessToken()

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Order creation failed")
      }

      return await response.json()
    } catch (error) {
      console.error("PayPal order creation error:", error)
      throw error
    }
  }

  async captureOrder(orderId: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken()

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Order capture failed")
      }

      return await response.json()
    } catch (error) {
      console.error("PayPal order capture error:", error)
      throw error
    }
  }

  async getOrderDetails(orderId: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken()

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to get order details")
      }

      return await response.json()
    } catch (error) {
      console.error("PayPal get order error:", error)
      throw error
    }
  }
}
