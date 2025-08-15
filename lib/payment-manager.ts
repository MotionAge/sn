import { ESewaPayment } from "./payment-gateways/esewa"
import { KhaltiPayment } from "./payment-gateways/khalti"
import { PayPalPayment } from "./payment-gateways/paypal"
import { StripePayment } from "./payment-gateways/stripe"
import { IMEPayPayment } from "./payment-gateways/imepay"
import { ConnectIPSPayment } from "./payment-gateways/connectips"

export type PaymentMethod = "esewa" | "khalti" | "paypal" | "stripe" | "imepay" | "connectips" | "bank" | "cash"

export interface PaymentData {
  amount: number
  currency: string
  description: string
  orderId: string
  customerInfo: {
    name: string
    email: string
    phone?: string
  }
  successUrl: string
  failureUrl: string
}

export class PaymentManager {
  private esewa: ESewaPayment
  private khalti: KhaltiPayment
  private paypal: PayPalPayment
  private stripe: StripePayment
  private imepay: IMEPayPayment
  private connectips: ConnectIPSPayment

  constructor() {
    this.esewa = new ESewaPayment()
    this.khalti = new KhaltiPayment()
    this.paypal = new PayPalPayment()
    this.stripe = new StripePayment()
    this.imepay = new IMEPayPayment()
    this.connectips = new ConnectIPSPayment()
  }

  async initiatePayment(
    method: PaymentMethod,
    data: PaymentData,
  ): Promise<{ success: boolean; redirectUrl?: string; formHtml?: string; error?: string }> {
    try {
      switch (method) {
        case "esewa":
          return this.initiateESewaPayment(data)

        case "khalti":
          return this.initiateKhaltiPayment(data)

        case "paypal":
          return this.initiatePayPalPayment(data)

        case "stripe":
          return this.initiateStripePayment(data)

        case "imepay":
          return this.initiateIMEPayPayment(data)

        case "connectips":
          return this.initiateConnectIPSPayment(data)

        case "bank":
          return this.initiateBankTransfer(data)

        case "cash":
          return this.initiateCashPayment(data)

        default:
          return { success: false, error: "Invalid payment method" }
      }
    } catch (error) {
      console.error("Payment initiation error:", error)
      return { success: false, error: "Payment initiation failed" }
    }
  }

  private async initiateESewaPayment(data: PaymentData): Promise<{ success: boolean; formHtml?: string }> {
    const esewaData = {
      amount: data.amount,
      productCode: "EPAYTEST",
      productServiceCharge: 0,
      productDeliveryCharge: 0,
      taxAmount: 0,
      totalAmount: data.amount,
      transactionUuid: data.orderId,
      successUrl: data.successUrl,
      failureUrl: data.failureUrl,
    }

    const formHtml = this.esewa.createPaymentForm(esewaData)
    return { success: true, formHtml }
  }

  private async initiateKhaltiPayment(
    data: PaymentData,
  ): Promise<{ success: boolean; redirectUrl?: string; error?: string }> {
    const khaltiData = {
      return_url: data.successUrl,
      website_url: process.env.NEXT_PUBLIC_SITE_URL || "",
      amount: data.amount * 100, // Khalti expects amount in paisa
      purchase_order_id: data.orderId,
      purchase_order_name: data.description,
      customer_info: {
        name: data.customerInfo.name,
        email: data.customerInfo.email,
        phone: data.customerInfo.phone || "",
      },
    }

    const result = await this.khalti.initiatePayment(khaltiData)
    if (result) {
      return { success: true, redirectUrl: result.payment_url }
    }

    return { success: false, error: "Khalti payment initiation failed" }
  }

  private async initiatePayPalPayment(
    data: PaymentData,
  ): Promise<{ success: boolean; redirectUrl?: string; error?: string }> {
    const paypalData = {
      amount: data.amount.toString(),
      currency: data.currency,
      description: data.description,
      return_url: data.successUrl,
      cancel_url: data.failureUrl,
    }

    const result = await this.paypal.createOrder(paypalData)
    if (result) {
      return { success: true, redirectUrl: result.approval_url }
    }

    return { success: false, error: "PayPal payment initiation failed" }
  }

  private async initiateStripePayment(
    data: PaymentData,
  ): Promise<{ success: boolean; redirectUrl?: string; error?: string }> {
    const stripeData = {
      amount: data.amount,
      currency: data.currency.toLowerCase(),
      description: data.description,
      success_url: data.successUrl,
      cancel_url: data.failureUrl,
      customer_email: data.customerInfo.email,
    }

    const result = await this.stripe.createCheckoutSession(stripeData)
    if (result) {
      return { success: true, redirectUrl: result.url }
    }

    return { success: false, error: "Stripe payment initiation failed" }
  }

  private async initiateIMEPayPayment(data: PaymentData): Promise<{ success: boolean; formHtml?: string }> {
    const imepayData = {
      amount: data.amount,
      refId: data.orderId,
      particulars: data.description,
      successUrl: data.successUrl,
      failureUrl: data.failureUrl,
    }

    const formHtml = this.imepay.createPaymentForm(imepayData)
    return { success: true, formHtml }
  }

  private async initiateConnectIPSPayment(data: PaymentData): Promise<{ success: boolean; formHtml?: string }> {
    const connectipsData = {
      amount: data.amount,
      orderId: data.orderId,
      particulars: data.description,
      successUrl: data.successUrl,
      failureUrl: data.failureUrl,
    }

    const formHtml = this.connectips.createPaymentForm(connectipsData)
    return { success: true, formHtml }
  }

  private async initiateBankTransfer(data: PaymentData): Promise<{ success: boolean; redirectUrl?: string }> {
    // For bank transfer, we just redirect to a page with bank details
    const bankDetailsUrl = `${data.successUrl}?method=bank&orderId=${data.orderId}`
    return { success: true, redirectUrl: bankDetailsUrl }
  }

  private async initiateCashPayment(data: PaymentData): Promise<{ success: boolean; redirectUrl?: string }> {
    // For cash payment, we redirect to a page with office visit instructions
    const cashInstructionsUrl = `${data.successUrl}?method=cash&orderId=${data.orderId}`
    return { success: true, redirectUrl: cashInstructionsUrl }
  }

  async verifyPayment(
    method: PaymentMethod,
    verificationData: any,
  ): Promise<{ verified: boolean; transactionId?: string }> {
    try {
      switch (method) {
        case "esewa":
          const esewaVerified = await this.esewa.verifyPayment(
            verificationData.transactionUuid,
            verificationData.totalAmount,
            verificationData.productCode,
          )
          return { verified: esewaVerified, transactionId: verificationData.transactionUuid }

        case "khalti":
          const khaltiResult = await this.khalti.verifyPayment(verificationData.pidx)
          return {
            verified: khaltiResult.status === "Completed",
            transactionId: khaltiResult.transaction_id,
          }

        case "paypal":
          const paypalResult = await this.paypal.captureOrder(verificationData.orderId)
          return {
            verified: paypalResult.status === "completed",
            transactionId: paypalResult.transaction_id,
          }

        case "stripe":
          const stripeResult = await this.stripe.retrieveSession(verificationData.sessionId)
          return {
            verified: stripeResult.status === "paid",
            transactionId: stripeResult.payment_intent,
          }

        case "imepay":
          const imepayVerified = await this.imepay.verifyPayment(verificationData.refId, verificationData.amount)
          return { verified: imepayVerified, transactionId: verificationData.refId }

        case "connectips":
          const connectipsResult = await this.connectips.verifyPayment(verificationData.orderId)
          return {
            verified: connectipsResult.status === "completed",
            transactionId: connectipsResult.transaction_id,
          }

        default:
          return { verified: false }
      }
    } catch (error) {
      console.error("Payment verification error:", error)
      return { verified: false }
    }
  }
}
