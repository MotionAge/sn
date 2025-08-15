interface KhaltiConfig {
  publicKey: string
  secretKey: string
  environment: "sandbox" | "production"
}

interface KhaltiPaymentData {
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

export class KhaltiPayment {
  private config: KhaltiConfig
  private baseUrl: string

  constructor() {
    this.config = {
      publicKey: process.env.KHALTI_PUBLIC_KEY || "",
      secretKey: process.env.KHALTI_SECRET_KEY || "",
      environment: (process.env.KHALTI_ENVIRONMENT as "sandbox" | "production") || "sandbox",
    }

    this.baseUrl =
      this.config.environment === "production" ? "https://khalti.com/api/v2" : "https://a.khalti.com/api/v2"
  }

  async initiatePayment(paymentData: KhaltiPaymentData): Promise<{ payment_url: string; pidx: string } | null> {
    try {
      const response = await fetch(`${this.baseUrl}/epayment/initiate/`, {
        method: "POST",
        headers: {
          Authorization: `Key ${this.config.secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })

      const result = await response.json()

      if (result.payment_url && result.pidx) {
        return {
          payment_url: result.payment_url,
          pidx: result.pidx,
        }
      }

      return null
    } catch (error) {
      console.error("Khalti initiation error:", error)
      return null
    }
  }

  async verifyPayment(pidx: string): Promise<{ status: string; transaction_id?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/epayment/lookup/`, {
        method: "POST",
        headers: {
          Authorization: `Key ${this.config.secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pidx }),
      })

      const result = await response.json()

      return {
        status: result.status,
        transaction_id: result.transaction_id,
      }
    } catch (error) {
      console.error("Khalti verification error:", error)
      return { status: "failed" }
    }
  }
}
