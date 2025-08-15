// Required for real eSewa payments
export class EsewaPayment {
  private static readonly ESEWA_URL = "https://uat.esewa.com.np/epay/main"
  private static readonly MERCHANT_ID = "EPAYTEST" // Real merchant ID needed

  static generatePaymentForm(amount: number, productId: string) {
    return {
      amt: amount,
      pdc: 0,
      psc: 0,
      txAmt: 0,
      tAmt: amount,
      pid: productId,
      scd: this.MERCHANT_ID,
      su: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      fu: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failure`,
    }
  }

  static async verifyPayment(oid: string, amt: string, refId: string) {
    // Actual verification with eSewa
    const response = await fetch("https://uat.esewa.com.np/epay/transrec", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        amt,
        scd: this.MERCHANT_ID,
        rid: refId,
        pid: oid,
      }),
    })

    return response.text()
  }
}
