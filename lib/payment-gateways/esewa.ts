interface ESewaConfig {
  merchantId: string
  secretKey: string
  environment: "sandbox" | "production"
}

interface ESewaPaymentData {
  amount: number
  productCode: string
  productServiceCharge: number
  productDeliveryCharge: number
  taxAmount: number
  totalAmount: number
  transactionUuid: string
  successUrl: string
  failureUrl: string
}

export class ESewaPayment {
  private config: ESewaConfig
  private baseUrl: string

  constructor() {
    this.config = {
      merchantId: process.env.ESEWA_MERCHANT_ID || "",
      secretKey: process.env.ESEWA_SECRET_KEY || "",
      environment: (process.env.ESEWA_ENVIRONMENT as "sandbox" | "production") || "sandbox",
    }

    this.baseUrl =
      this.config.environment === "production"
        ? "https://epay.esewa.com.np/api/epay/main/v2/form"
        : "https://rc-epay.esewa.com.np/api/epay/main/v2/form"
  }

  generateSignature(data: ESewaPaymentData): string {
    const message = `total_amount=${data.totalAmount},transaction_uuid=${data.transactionUuid},product_code=${data.productCode}`
    const crypto = require("crypto")
    return crypto.createHmac("sha256", this.config.secretKey).update(message).digest("base64")
  }

  createPaymentForm(paymentData: ESewaPaymentData): string {
    const signature = this.generateSignature(paymentData)

    return `
      <form id="esewa-form" action="${this.baseUrl}" method="POST">
        <input type="hidden" name="amount" value="${paymentData.amount}" />
        <input type="hidden" name="tax_amount" value="${paymentData.taxAmount}" />
        <input type="hidden" name="total_amount" value="${paymentData.totalAmount}" />
        <input type="hidden" name="transaction_uuid" value="${paymentData.transactionUuid}" />
        <input type="hidden" name="product_code" value="${paymentData.productCode}" />
        <input type="hidden" name="product_service_charge" value="${paymentData.productServiceCharge}" />
        <input type="hidden" name="product_delivery_charge" value="${paymentData.productDeliveryCharge}" />
        <input type="hidden" name="success_url" value="${paymentData.successUrl}" />
        <input type="hidden" name="failure_url" value="${paymentData.failureUrl}" />
        <input type="hidden" name="signed_field_names" value="total_amount,transaction_uuid,product_code" />
        <input type="hidden" name="signature" value="${signature}" />
      </form>
      <script>document.getElementById('esewa-form').submit();</script>
    `
  }

  async verifyPayment(transactionUuid: string, totalAmount: number, productCode: string): Promise<boolean> {
    try {
      const verifyUrl =
        this.config.environment === "production"
          ? "https://epay.esewa.com.np/api/epay/transaction/status/"
          : "https://rc-epay.esewa.com.np/api/epay/transaction/status/"

      const response = await fetch(
        `${verifyUrl}?product_code=${productCode}&total_amount=${totalAmount}&transaction_uuid=${transactionUuid}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      )

      const result = await response.json()
      return result.status === "COMPLETE"
    } catch (error) {
      console.error("eSewa verification error:", error)
      return false
    }
  }
}
