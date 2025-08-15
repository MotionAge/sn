"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslation } from "@/hooks/use-translation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download, Home, Mail, Loader2, X } from "lucide-react"
import Link from "next/link"
import Label from "@/components/ui/label" // Assuming Label is imported from this path

interface PaymentDetails {
  id: string
  status: string
  amount: number
  currency: string
  method: string
  transactionId?: string
  createdAt: string
  verifiedAt?: string
}

export default function PaymentSuccessPage() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const [payment, setPayment] = useState<PaymentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)

  const orderId = searchParams.get("orderId")
  const method = searchParams.get("method")

  useEffect(() => {
    if (orderId && method) {
      verifyPayment()
    }
  }, [orderId, method])

  const verifyPayment = async () => {
    try {
      setVerifying(true)

      // First, verify the payment with the gateway
      const verifyResponse = await fetch("/api/payments/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          method,
          verificationData: {
            // Add method-specific verification data from URL params
            transactionUuid: searchParams.get("oid"),
            totalAmount: searchParams.get("amt"),
            productCode: searchParams.get("pcd"),
            pidx: searchParams.get("pidx"),
            sessionId: searchParams.get("session_id"),
            refId: searchParams.get("refId"),
          },
        }),
      })

      const verifyResult = await verifyResponse.json()

      // Then get the payment details
      const statusResponse = await fetch(`/api/payments/verify?orderId=${orderId}`)
      const statusResult = await statusResponse.json()

      if (statusResult.success) {
        setPayment(statusResult.payment)
      }
    } catch (error) {
      console.error("Payment verification error:", error)
    } finally {
      setVerifying(false)
      setLoading(false)
    }
  }

  const downloadReceipt = async () => {
    try {
      const response = await fetch(`/api/payments/receipt?orderId=${orderId}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `receipt-${orderId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Receipt download error:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t("Verifying Payment...")}</h2>
            <p className="text-gray-600 text-center">{t("Please wait while we confirm your payment")}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {payment?.status === "completed" ? (
            <>
              {/* Success Message */}
              <Card className="mb-8">
                <CardContent className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{t("Payment Successful!")}</h1>
                  <p className="text-xl text-gray-600 mb-6">
                    {t("Thank you for your contribution to Sanatan Dharma Board Nepal")}
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full">
                    <CheckCircle className="w-4 h-4" />
                    {t("Payment Verified")}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Details */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>{t("Payment Details")}</CardTitle>
                  <CardDescription>{t("Here are the details of your transaction")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">{t("Order ID")}</Label>
                      <p className="font-mono text-sm">{payment.id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">{t("Amount")}</Label>
                      <p className="text-lg font-semibold">
                        {payment.currency} {payment.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">{t("Payment Method")}</Label>
                      <p className="capitalize">{payment.method}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">{t("Status")}</Label>
                      <p className="text-green-600 font-semibold capitalize">{payment.status}</p>
                    </div>
                  </div>

                  {payment.transactionId && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">{t("Transaction ID")}</Label>
                      <p className="font-mono text-sm">{payment.transactionId}</p>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t("Date & Time")}</Label>
                    <p>{new Date(payment.createdAt).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>{t("What's Next?")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">{t("Email Confirmation")}</h4>
                      <p className="text-sm text-gray-600">
                        {t("You will receive a confirmation email with your receipt and next steps")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">{t("Processing")}</h4>
                      <p className="text-sm text-gray-600">
                        {t("Your application will be reviewed and processed within 2-3 business days")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={downloadReceipt} variant="outline" size="lg">
                  <Download className="w-5 h-5 mr-2" />
                  {t("Download Receipt")}
                </Button>
                <Button asChild size="lg">
                  <Link href="/">
                    <Home className="w-5 h-5 mr-2" />
                    {t("Back to Home")}
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            /* Payment Failed */
            <Card>
              <CardContent className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                  <X className="w-10 h-10 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{t("Payment Failed")}</h1>
                <p className="text-xl text-gray-600 mb-6">{t("Unfortunately, your payment could not be processed")}</p>
                <div className="space-y-4">
                  <Button asChild size="lg">
                    <Link href="/donate">{t("Try Again")}</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/">
                      <Home className="w-5 h-5 mr-2" />
                      {t("Back to Home")}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
