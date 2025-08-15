interface ConnectIPSConfig {
  merchantId: string
  appId: string
  appName: string
  password: string
  environment: "sandbox" | "production"
}

interface ConnectIPSData {
  amount: number
  orderId: string
  particulars: string
  successUrl: string
  failureUrl: string
}

export class ConnectIPSPayment {
  private config: ConnectIPSConfig
  private baseUrl: string

  constructor() {
    this.config = {
      merchantId: process.env.CONNECTIPS_MERCHANT_ID || "",
      appId: process.env.CONNECTIPS_APP_ID || "",
      appName: process.env.CONNECTIPS_APP_NAME || "",
      password: process.env.CONNECTIPS_PASSWORD || "",
      environment: (process.env.CONNECTIPS_ENVIRONMENT as "sandbox" | "production") || "sandbox",
    }

    this.baseUrl = this.config.environment === "production" ? "https://connectips.com" : "https://uat.connectips.com"
  }

  generateToken(data: ConnectIPSData): string {
    const crypto = require("crypto")
    const message = `MERCHANTID=${this.config.merchantId},APPID=${this.config.appId},APPNAME=${this.config.appName},TXNID=${data.orderId},TXNAMT=${data.amount},REFERENCE=${data.particulars}`
    return crypto.createHmac("sha256", this.config.password).update(message).digest("hex").toUpperCase()
  }

  createPaymentForm(paymentData: ConnectIPSData): string {
    const token = this.generateToken(paymentData)

    return `
      <form id="connectips-form" action="${this.baseUrl}/connectipswebws/api/creditor/validateTxn" method="POST">
        <input type="hidden" name="MERCHANTID" value="${this.config.merchantId}" />
        <input type="hidden" name="APPID" value="${this.config.appId}" />
        <input type="hidden" name="APPNAME" value="${this.config.appName}" />
        <input type="hidden" name="TXNID" value="${paymentData.orderId}" />
        <input type="hidden" name="TXNAMT" value="${paymentData.amount}" />
        <input type="hidden" name="REFERENCE" value="${paymentData.particulars}" />
        <input type="hidden" name="REMARKS" value="${paymentData.particulars}" />
        <input type="hidden" name="TOKEN" value="${token}" />
        <input type="hidden" name="URLSUCCESS" value="${paymentData.successUrl}" />
        <input type="hidden" name="URLFAIL" value="${paymentData.failureUrl}" />
      </form>
      <script>document.getElementById('connectips-form').submit();</script>
    `
  }

  async verifyPayment(orderId: string): Promise<{ status: string; transaction_id?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/connectipswebws/api/creditor/txnStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          MERCHANTID: this.config.merchantId,
          APPID: this.config.appId,
          APPNAME: this.config.appName,
          TXNID: orderId,
        }),
      })

      const result = await response.json()

      return {
        status: result.STATUS === "SUCCESS" ? "completed" : "failed",
        transaction_id: result.TXNID,
      }
    } catch (error) {
      console.error("ConnectIPS verification error:", error)
      return { status: "failed" }
    }
  }
}
