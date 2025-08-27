import crypto from "crypto"

export interface ESewaConfig {
  merchantId: string
  secretKey: string
  successUrl: string
  failureUrl: string
  environment: "sandbox" | "production"
}

export interface ESewaPaymentData {
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

export class ESewaGateway {
  private config: ESewaConfig
  private baseUrl: string

  constructor(config: ESewaConfig) {
    this.config = config
    this.baseUrl =
      config.environment === "production"
        ? "https://epay.esewa.com.np/api/epay/main/v2/form"
        : "https://rc-epay.esewa.com.np/api/epay/main/v2/form"
  }

  generateSignature(data: ESewaPaymentData): string {
    const message = `total_amount=${data.totalAmount},transaction_uuid=${data.transactionUuid},product_code=${data.productCode}`
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

  async verifyPayment(transactionUuid: string, totalAmount: number): Promise<any> {
    const verifyUrl =
      this.config.environment === "production"
        ? "https://epay.esewa.com.np/api/epay/transaction/status/"
        : "https://rc-epay.esewa.com.np/api/epay/transaction/status/"

    try {
      const response = await fetch(
        `${verifyUrl}?product_code=${this.config.merchantId}&total_amount=${totalAmount}&transaction_uuid=${transactionUuid}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error("Payment verification failed")
      }

      return await response.json()
    } catch (error) {
      console.error("eSewa verification error:", error)
      throw error
    }
  }
}
