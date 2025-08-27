import crypto from "crypto"

export interface IMEPayConfig {
  merchantCode: string
  username: string
  password: string
  module: string
  environment: "sandbox" | "production"
}

export interface IMEPaymentData {
  merchantCode: string
  amount: string
  refId: string
  particulars: string
  token: string
  successUrl: string
  failureUrl: string
  cancelUrl: string
}

export class IMEPayGateway {
  private config: IMEPayConfig
  private baseUrl: string

  constructor(config: IMEPayConfig) {
    this.config = config
    this.baseUrl = config.environment === "production" ? "https://payment.imepay.com.np" : "https://stg.imepay.com.np"
  }

  generateToken(amount: string, refId: string): string {
    const message = `${this.config.merchantCode}${amount}${refId}`
    return crypto
      .createHash("sha256")
      .update(message + this.config.password)
      .digest("hex")
      .toUpperCase()
  }

  createPaymentForm(paymentData: Omit<IMEPaymentData, "token">): string {
    const token = this.generateToken(paymentData.amount, paymentData.refId)

    return `
      <form id="imepay-form" action="${this.baseUrl}/api/Web/GetToken" method="POST">
        <input type="hidden" name="MerchantCode" value="${paymentData.merchantCode}" />
        <input type="hidden" name="Amount" value="${paymentData.amount}" />
        <input type="hidden" name="RefId" value="${paymentData.refId}" />
        <input type="hidden" name="particulars" value="${paymentData.particulars}" />
        <input type="hidden" name="token" value="${token}" />
        <input type="hidden" name="successUrl" value="${paymentData.successUrl}" />
        <input type="hidden" name="failureUrl" value="${paymentData.failureUrl}" />
        <input type="hidden" name="cancelUrl" value="${paymentData.cancelUrl}" />
      </form>
      <script>document.getElementById('imepay-form').submit();</script>
    `
  }

  async verifyPayment(refId: string, transactionId: string): Promise<any> {
    try {
      const token = this.generateToken("0", refId)

      const response = await fetch(`${this.baseUrl}/api/Web/Confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          MerchantCode: this.config.merchantCode,
          RefId: refId,
          TransactionId: transactionId,
          Token: token,
        }),
      })

      if (!response.ok) {
        throw new Error("Payment verification failed")
      }

      const result = await response.text()
      return { success: result === "True", response: result }
    } catch (error) {
      console.error("IME Pay verification error:", error)
      throw error
    }
  }
}
