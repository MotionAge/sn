// Required for real Khalti payments
export class KhaltiPayment {
  private static readonly KHALTI_URL = "https://a.khalti.com/api/v2/epayment/initiate/"
  private static readonly PUBLIC_KEY = process.env.KHALTI_PUBLIC_KEY
  private static readonly SECRET_KEY = process.env.KHALTI_SECRET_KEY

  static async initiatePayment(amount: number, productId: string) {
    const response = await fetch(this.KHALTI_URL, {
      method: "POST",
      headers: {
        Authorization: `Key ${this.SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/khalti/callback`,
        website_url: process.env.NEXT_PUBLIC_BASE_URL,
        amount: amount * 100, // Khalti uses paisa
        purchase_order_id: productId,
        purchase_order_name: "Donation/Membership",
      }),
    })

    return response.json()
  }

  static async verifyPayment(pidx: string) {
    const response = await fetch(`https://a.khalti.com/api/v2/epayment/lookup/`, {
      method: "POST",
      headers: {
        Authorization: `Key ${this.SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pidx }),
    })

    return response.json()
  }
}
