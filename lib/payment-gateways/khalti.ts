export interface KhaltiConfig {
  publicKey: string
  secretKey: string
  environment: "sandbox" | "production"
}

export interface KhaltiPaymentData {
  return_url: string
  website_url: string
  amount: number
  purchase_order_id: string
  purchase_order_name: string
  customer_info?: {
    name: string
    email: string
    phone: string
  }
}

export class KhaltiGateway {
  private config: KhaltiConfig
  private baseUrl: string

  constructor(config: KhaltiConfig) {
    this.config = config
    this.baseUrl = config.environment === "production" ? "https://khalti.com/api/v2" : "https://a.khalti.com/api/v2"
  }

  async initiatePayment(paymentData: KhaltiPaymentData): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/epayment/initiate/`, {
        method: "POST",
        headers: {
          Authorization: `Key ${this.config.secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Payment initiation failed")
      }

      return await response.json()
    } catch (error) {
      console.error("Khalti initiation error:", error)
      throw error
    }
  }

  async verifyPayment(pidx: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/epayment/lookup/`, {
        method: "POST",
        headers: {
          Authorization: `Key ${this.config.secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pidx }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Payment verification failed")
      }

      return await response.json()
    } catch (error) {
      console.error("Khalti verification error:", error)
      throw error
    }
  }
}
