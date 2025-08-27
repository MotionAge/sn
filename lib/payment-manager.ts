import { ESewaGateway, type ESewaConfig, type ESewaPaymentData } from "./payment-gateways/esewa"
import { KhaltiGateway, type KhaltiConfig, type KhaltiPaymentData } from "./payment-gateways/khalti"
import { PayPalGateway, type PayPalConfig, type PayPalOrderData } from "./payment-gateways/paypal"
import { StripeGateway, type StripeConfig, type StripeSessionData } from "./payment-gateways/stripe"
import { IMEPayGateway, type IMEPayConfig } from "./payment-gateways/imepay"
import { ConnectIPSGateway, type ConnectIPSConfig } from "./payment-gateways/connectips"
import { getSupabaseClient } from "./supabase"

export type PaymentGateway =
  | "esewa"
  | "khalti"
  | "paypal"
  | "stripe"
  | "imepay"
  | "connectips"
  | "bank_transfer"
  | "cash"

export interface PaymentConfig {
  esewa: ESewaConfig
  khalti: KhaltiConfig
  paypal: PayPalConfig
  stripe: StripeConfig
  imepay: IMEPayConfig
  connectips: ConnectIPSConfig
}

export interface PaymentRequest {
  gateway: PaymentGateway
  amount: number
  currency: string
  description: string
  customerInfo: {
    name: string
    email: string
    phone?: string
  }
  metadata: Record<string, any>
  returnUrl: string
  cancelUrl: string
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  paymentUrl?: string
  formHtml?: string
  error?: string
  data?: any
}

export class PaymentManager {
  private config: PaymentConfig
  

  constructor() {
    this.config = {
      esewa: {
        merchantId: process.env.ESEWA_MERCHANT_ID!,
        secretKey: process.env.ESEWA_SECRET_KEY!,
        successUrl: process.env.ESEWA_SUCCESS_URL!,
        failureUrl: process.env.ESEWA_FAILURE_URL!,
        environment: (process.env.ESEWA_ENVIRONMENT as "sandbox" | "production") || "sandbox",
      },
      khalti: {
        publicKey: process.env.KHALTI_PUBLIC_KEY!,
        secretKey: process.env.KHALTI_SECRET_KEY!,
        environment: (process.env.KHALTI_ENVIRONMENT as "sandbox" | "production") || "sandbox",
      },
      paypal: {
        clientId: process.env.PAYPAL_CLIENT_ID!,
        clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
        environment: (process.env.PAYPAL_ENVIRONMENT as "sandbox" | "production") || "sandbox",
      },
      stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY!,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY!,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
        environment: (process.env.STRIPE_ENVIRONMENT as "test" | "live") || "test",
      },
      imepay: {
        merchantCode: process.env.IMEPAY_MERCHANT_CODE!,
        username: process.env.IMEPAY_USERNAME!,
        password: process.env.IMEPAY_PASSWORD!,
        module: process.env.IMEPAY_MODULE!,
        environment: (process.env.IMEPAY_ENVIRONMENT as "sandbox" | "production") || "sandbox",
      },
      connectips: {
        merchantId: process.env.CONNECTIPS_MERCHANT_ID!,
        appId: process.env.CONNECTIPS_APP_ID!,
        appName: process.env.CONNECTIPS_APP_NAME!,
        secretKey: process.env.CONNECTIPS_SECRET_KEY!,
        environment: (process.env.CONNECTIPS_ENVIRONMENT as "sandbox" | "production") || "sandbox",
      },
    }
  }

  async initiatePayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      // Log payment initiation
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error("Supabase not initialized")
      const { data: paymentRecord } = await supabase
        .from("payments")
        .insert({
          gateway: request.gateway,
          amount: request.amount,
          currency: request.currency,
          description: request.description,
          customer_name: request.customerInfo.name,
          customer_email: request.customerInfo.email,
          customer_phone: request.customerInfo.phone,
          metadata: request.metadata,
          status: "pending",
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      const transactionId = paymentRecord?.id || `txn_${Date.now()}`

      switch (request.gateway) {
        case "esewa":
          return await this.initiateESewaPayment(request, transactionId)

        case "khalti":
          return await this.initiateKhaltiPayment(request, transactionId)

        case "paypal":
          return await this.initiatePayPalPayment(request, transactionId)

        case "stripe":
          return await this.initiateStripePayment(request, transactionId)

        case "imepay":
          return await this.initiateIMEPayPayment(request, transactionId)

        case "connectips":
          return await this.initiateConnectIPSPayment(request, transactionId)

        case "bank_transfer":
          return await this.initiateBankTransfer(request, transactionId)

        case "cash":
          return await this.initiateCashPayment(request, transactionId)

        default:
          throw new Error(`Unsupported payment gateway: ${request.gateway}`)
      }
    } catch (error) {
      console.error("Payment initiation error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Payment initiation failed",
      }
    }
  }

  private async initiateESewaPayment(request: PaymentRequest, transactionId: string): Promise<PaymentResult> {
    const gateway = new ESewaGateway(this.config.esewa)

    const paymentData: ESewaPaymentData = {
      amount: request.amount,
      productCode: this.config.esewa.merchantId,
      productServiceCharge: 0,
      productDeliveryCharge: 0,
      taxAmount: 0,
      totalAmount: request.amount,
      transactionUuid: transactionId,
      successUrl: request.returnUrl,
      failureUrl: request.cancelUrl,
    }

    const formHtml = gateway.createPaymentForm(paymentData)

    return {
      success: true,
      transactionId,
      formHtml,
    }
  }

  private async initiateKhaltiPayment(request: PaymentRequest, transactionId: string): Promise<PaymentResult> {
    const gateway = new KhaltiGateway(this.config.khalti)

    const paymentData: KhaltiPaymentData = {
      return_url: request.returnUrl,
      website_url: process.env.NEXT_PUBLIC_APP_URL!,
      amount: request.amount * 100, // Khalti expects amount in paisa
      purchase_order_id: transactionId,
      purchase_order_name: request.description,
      customer_info: {
        name: request.customerInfo.name,
        email: request.customerInfo.email,
        phone: request.customerInfo.phone || "",
      },
    }

    const result = await gateway.initiatePayment(paymentData)

    return {
      success: true,
      transactionId,
      paymentUrl: result.payment_url,
      data: result,
    }
  }

  private async initiatePayPalPayment(request: PaymentRequest, transactionId: string): Promise<PaymentResult> {
    const gateway = new PayPalGateway(this.config.paypal)

    const orderData: PayPalOrderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: request.currency.toUpperCase(),
            value: request.amount.toString(),
          },
          description: request.description,
          reference_id: transactionId,
        },
      ],
      application_context: {
        return_url: request.returnUrl,
        cancel_url: request.cancelUrl,
        brand_name: "Sanatan Dharma Bikash",
        user_action: "PAY_NOW",
      },
    }

    const order = await gateway.createOrder(orderData)
    const approvalUrl = order.links.find((link: any) => link.rel === "approve")?.href

    return {
      success: true,
      transactionId,
      paymentUrl: approvalUrl,
      data: order,
    }
  }

  private async initiateStripePayment(request: PaymentRequest, transactionId: string): Promise<PaymentResult> {
    const gateway = new StripeGateway(this.config.stripe)

    const sessionData: StripeSessionData = {
      line_items: [
        {
          price_data: {
            currency: request.currency.toLowerCase(),
            product_data: {
              name: request.description,
            },
            unit_amount: Math.round(request.amount * 100), // Stripe expects amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: request.returnUrl,
      cancel_url: request.cancelUrl,
      customer_email: request.customerInfo.email,
      metadata: {
        transactionId,
        ...request.metadata,
      },
    }

    const session = await gateway.createCheckoutSession(sessionData)

    return {
      success: true,
      transactionId,
      paymentUrl: session.url!,
      data: session,
    }
  }

  private async initiateIMEPayPayment(request: PaymentRequest, transactionId: string): Promise<PaymentResult> {
    const gateway = new IMEPayGateway(this.config.imepay)

    const paymentData = {
      merchantCode: this.config.imepay.merchantCode,
      amount: request.amount.toString(),
      refId: transactionId,
      particulars: request.description,
      successUrl: request.returnUrl,
      failureUrl: request.cancelUrl,
      cancelUrl: request.cancelUrl,
    }

    const formHtml = gateway.createPaymentForm(paymentData)

    return {
      success: true,
      transactionId,
      formHtml,
    }
  }

  private async initiateConnectIPSPayment(request: PaymentRequest, transactionId: string): Promise<PaymentResult> {
    const gateway = new ConnectIPSGateway(this.config.connectips)

    const paymentData = {
      merchantId: this.config.connectips.merchantId,
      appId: this.config.connectips.appId,
      appName: this.config.connectips.appName,
      txnId: transactionId,
      txnDate: new Date().toISOString().split("T")[0].replace(/-/g, ""),
      txnCurrency: request.currency.toUpperCase(),
      txnAmount: request.amount.toString(),
      referenceId: transactionId,
      remarks: request.description,
      particulars: request.description,
      successUrl: request.returnUrl,
      failureUrl: request.cancelUrl,
    }

    const formHtml = gateway.createPaymentForm(paymentData)

    return {
      success: true,
      transactionId,
      formHtml,
    }
  }

  private async initiateBankTransfer(request: PaymentRequest, transactionId: string): Promise<PaymentResult> {
    // Update payment record with bank transfer instructions
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error("Supabase not initialized")
    await supabase
      .from("payments")
      .update({
        status: "pending_verification",
        payment_instructions: {
          method: "bank_transfer",
          bank_details: {
            bank_name: process.env.BANK_NAME,
            account_name: process.env.BANK_ACCOUNT_NAME,
            account_number: process.env.BANK_ACCOUNT_NUMBER,
            routing_number: process.env.BANK_ROUTING_NUMBER,
          },
          instructions: "Please transfer the amount to the above bank account and send us the transaction receipt.",
        },
      })
      .eq("id", transactionId)

    return {
      success: true,
      transactionId,
      data: {
        method: "bank_transfer",
        instructions: "Bank transfer details have been sent to your email.",
      },
    }
  }

  private async initiateCashPayment(request: PaymentRequest, transactionId: string): Promise<PaymentResult> {
    // Update payment record with cash payment instructions
    const supabase2 = getSupabaseClient()
    if (!supabase2) throw new Error("Supabase not initialized")
    await supabase2
      .from("payments")
      .update({
        status: "pending_verification",
        payment_instructions: {
          method: "cash",
          office_details: {
            address: process.env.OFFICE_ADDRESS,
            phone: process.env.OFFICE_PHONE,
            hours: process.env.OFFICE_HOURS,
          },
          instructions: "Please visit our office during business hours to make the cash payment.",
        },
      })
      .eq("id", transactionId)

    return {
      success: true,
      transactionId,
      data: {
        method: "cash",
        instructions: "Cash payment details have been sent to your email.",
      },
    }
  }

  async verifyPayment(gateway: PaymentGateway, transactionId: string, additionalData?: any): Promise<PaymentResult> {
    try {
      let verificationResult: any

      switch (gateway) {
        case "esewa":
          const esewaGateway = new ESewaGateway(this.config.esewa)
          verificationResult = await esewaGateway.verifyPayment(transactionId, additionalData.totalAmount)
          break

        case "khalti":
          const khaltiGateway = new KhaltiGateway(this.config.khalti)
          verificationResult = await khaltiGateway.verifyPayment(additionalData.pidx)
          break

        case "paypal":
          const paypalGateway = new PayPalGateway(this.config.paypal)
          verificationResult = await paypalGateway.getOrderDetails(additionalData.orderId)
          break

        case "stripe":
          const stripeGateway = new StripeGateway(this.config.stripe)
          verificationResult = await stripeGateway.retrieveSession(additionalData.sessionId)
          break

        case "imepay":
          const imepayGateway = new IMEPayGateway(this.config.imepay)
          verificationResult = await imepayGateway.verifyPayment(transactionId, additionalData.transactionId)
          break

        case "connectips":
          const connectipsGateway = new ConnectIPSGateway(this.config.connectips)
          verificationResult = await connectipsGateway.verifyPayment(transactionId, additionalData.referenceId)
          break

        default:
          throw new Error(`Verification not supported for gateway: ${gateway}`)
      }

      // Update payment status in database
      const status = this.determinePaymentStatus(gateway, verificationResult)
      const supabase3 = getSupabaseClient()
      if (!supabase3) throw new Error("Supabase not initialized")
      await supabase3
        .from("payments")
        .update({
          status,
          verification_data: verificationResult,
          verified_at: new Date().toISOString(),
        })
        .eq("id", transactionId)

      return {
        success: status === "completed",
        transactionId,
        data: verificationResult,
      }
    } catch (error) {
      console.error("Payment verification error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Payment verification failed",
      }
    }
  }

  private determinePaymentStatus(gateway: PaymentGateway, verificationResult: any): string {
    switch (gateway) {
      case "esewa":
        return verificationResult.status === "COMPLETE" ? "completed" : "failed"

      case "khalti":
        return verificationResult.status === "Completed" ? "completed" : "failed"

      case "paypal":
        return verificationResult.status === "COMPLETED" ? "completed" : "failed"

      case "stripe":
        return verificationResult.payment_status === "paid" ? "completed" : "failed"

      case "imepay":
        return verificationResult.success ? "completed" : "failed"

      case "connectips":
        return verificationResult.status === "SUCCESS" ? "completed" : "failed"

      default:
        return "pending"
    }
  }
}

export const paymentManager = new PaymentManager()
