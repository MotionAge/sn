import crypto from "crypto"

export interface ConnectIPSConfig {
  merchantId: string
  appId: string
  appName: string
  secretKey: string
  environment: "sandbox" | "production"
}

export interface ConnectIPSPaymentData {
  merchantId: string
  appId: string
  appName: string
  txnId: string
  txnDate: string
  txnCurrency: string
  txnAmount: string
  referenceId: string
  remarks: string
  particulars: string
  token: string
  successUrl: string
  failureUrl: string
}

export class ConnectIPSGateway {
  private config: ConnectIPSConfig
  private baseUrl: string

  constructor(config: ConnectIPSConfig) {
    this.config = config
    this.baseUrl = config.environment === "production" ? "https://payment.connectips.com" : "https://uat.connectips.com"
  }

  generateToken(data: Omit<ConnectIPSPaymentData, "token">): string {
    const message = `MERCHANTID=${data.merchantId},APPID=${data.appId},APPNAME=${data.appName},TXNID=${data.txnId},TXNDATE=${data.txnDate},TXNCURRENCY=${data.txnCurrency},TXNAMOUNT=${data.txnAmount},REFERENCEID=${data.referenceId},REMARKS=${data.remarks},PARTICULARS=${data.particulars},TOKEN=`

    return crypto.createHmac("sha256", this.config.secretKey).update(message).digest("base64")
  }

  createPaymentForm(paymentData: Omit<ConnectIPSPaymentData, "token">): string {
    const token = this.generateToken(paymentData)

    return `
      <form id="connectips-form" action="${this.baseUrl}/connectipswebws/api/creditor/validateTxn" method="POST">
        <input type="hidden" name="MERCHANTID" value="${paymentData.merchantId}" />
        <input type="hidden" name="APPID" value="${paymentData.appId}" />
        <input type="hidden" name="APPNAME" value="${paymentData.appName}" />
        <input type="hidden" name="TXNID" value="${paymentData.txnId}" />
        <input type="hidden" name="TXNDATE" value="${paymentData.txnDate}" />
        <input type="hidden" name="TXNCURRENCY" value="${paymentData.txnCurrency}" />
        <input type="hidden" name="TXNAMOUNT" value="${paymentData.txnAmount}" />
        <input type="hidden" name="REFERENCEID" value="${paymentData.referenceId}" />
        <input type="hidden" name="REMARKS" value="${paymentData.remarks}" />
        <input type="hidden" name="PARTICULARS" value="${paymentData.particulars}" />
        <input type="hidden" name="SUCCESS_URL" value="${paymentData.successUrl}" />
        <input type="hidden" name="FAILURE_URL" value="${paymentData.failureUrl}" />
        <input type="hidden" name="TOKEN" value="${token}" />
      </form>
      <script>document.getElementById('connectips-form').submit();</script>
    `
  }

  async verifyPayment(txnId: string, referenceId: string): Promise<any> {
    try {
      const verifyData = {
        merchantId: this.config.merchantId,
        appId: this.config.appId,
        appName: this.config.appName,
        txnId,
        referenceId,
        txnDate: new Date().toISOString().split("T")[0].replace(/-/g, ""),
        txnCurrency: "NPR",
        txnAmount: "0",
        remarks: "Verification",
        particulars: "Payment Verification",
      }

      const token = this.generateToken(verifyData)

      const response = await fetch(`${this.baseUrl}/connectipswebws/api/creditor/txnStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          MERCHANTID: verifyData.merchantId,
          APPID: verifyData.appId,
          APPNAME: verifyData.appName,
          TXNID: txnId,
          REFERENCEID: referenceId,
          TOKEN: token,
        }),
      })

      if (!response.ok) {
        throw new Error("Payment verification failed")
      }

      return await response.json()
    } catch (error) {
      console.error("ConnectIPS verification error:", error)
      throw error
    }
  }
}
