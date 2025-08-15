interface IMEPayConfig {
  merchantCode: string
  username: string
  password: string
  module: string
  environment: "sandbox" | "production"
}

interface IMEPayData {
  amount: number
  refId: string
  particulars: string
  successUrl: string
  failureUrl: string
}

export class IMEPayPayment {
  private config: IMEPayConfig
  private baseUrl: string

  constructor() {
    this.config = {
      merchantCode: process.env.IMEPAY_MERCHANT_CODE || "",
      username: process.env.IMEPAY_USERNAME || "",
      password: process.env.IMEPAY_PASSWORD || "",
      module: process.env.IMEPAY_MODULE || "",
      environment: (process.env.IMEPAY_ENVIRONMENT as "sandbox" | "production") || "sandbox",
    }

    this.baseUrl =
      this.config.environment === "production" ? "https://payment.imepay.com.np" : "https://stg.imepay.com.np"
  }

  generateToken(data: IMEPayData): string {
    const crypto = require("crypto")
    const message = `${this.config.merchantCode}${data.refId}${data.amount}${this.config.module}`
    return crypto
      .createHash("sha256")
      .update(message + this.config.password)
      .digest("hex")
      .toUpperCase()
  }

  createPaymentForm(paymentData: IMEPayData): string {
    const token = this.generateToken(paymentData)

    return `
      <form id="imepay-form" action="${this.baseUrl}/api/Web/GetToken" method="POST">
        <input type="hidden" name="MerchantCode" value="${this.config.merchantCode}" />
        <input type="hidden" name="RefId" value="${paymentData.refId}" />
        <input type="hidden" name="TranAmount" value="${paymentData.amount}" />
        <input type="hidden" name="Method" value="POST" />
        <input type="hidden" name="RespUrl" value="${paymentData.successUrl}" />
        <input type="hidden" name="CancelUrl" value="${paymentData.failureUrl}" />
        <input type="hidden" name="Particulars" value="${paymentData.particulars}" />
        <input type="hidden" name="Module" value="${this.config.module}" />
        <input type="hidden" name="TokenId" value="${token}" />
      </form>
      <script>document.getElementById('imepay-form').submit();</script>
    `
  }

  async verifyPayment(refId: string, amount: number): Promise<boolean> {
    try {
      const token = this.generateToken({ refId, amount } as IMEPayData)

      const response = await fetch(`${this.baseUrl}/api/Web/Confirmation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          MerchantCode: this.config.merchantCode,
          RefId: refId,
          TokenId: token,
        }),
      })

      const result = await response.text()
      return result.includes("SUCCESS")
    } catch (error) {
      console.error("IME Pay verification error:", error)
      return false
    }
  }
}
