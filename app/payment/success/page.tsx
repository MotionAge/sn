"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslation } from "@/hooks/use-translation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Download, Home, Mail, Loader2, X } from "lucide-react"
import Link from "next/link"

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
  const [isVerifying, setIsVerifying] = useState(true)
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [error, setError] = useState("")

  const orderId = searchParams.get("orderId")
  const method = searchParams.get("method")

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const gateway = searchParams.get("gateway")
        const transactionId = searchParams.get("transaction_id")
        const pidx = searchParams.get("pidx")
        const orderId = searchParams.get("order_id")
        const sessionId = searchParams.get("session_id")

        if (!gateway || !transactionId) {
          throw new Error("Missing payment information")
        }

        const verificationData: any = { gateway, transactionId }

        // Add gateway-specific data
        if (pidx) verificationData.pidx = pidx
        if (orderId) verificationData.orderId = orderId
        if (sessionId) verificationData.sessionId = sessionId

        const response = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(verificationData),
        })

        if (!response.ok) {
          throw new Error("Payment verification failed")
        }

        const result = await response.json()
        setVerificationResult(result)

        if (!result.success) {
          throw new Error(result.error || "Payment verification failed")
        }
      } catch (err: any) {
        setError(err.message || "Payment verification failed")
      } finally {
        setIsVerifying(false)
        setLoading(false)
      }
    }

    verifyPayment()
  }, [searchParams])

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

  if (loading || isVerifying) {
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="text-center">
            <Button asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {verificationResult?.success ? (
            <>
              {/* Success Message */}
              <div className="text-center mb-8">
                <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
                <h1 className="text-4xl font-bold text-green-600 mb-2">Payment Successful!</h1>
                <p className="text-xl text-gray-600">Thank you for your contribution to Sanatan Dharma Bikash Nepal</p>
              </div>

              {/* Payment Details */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Transaction ID</p>
                      <p className="font-semibold">{verificationResult?.transactionId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-semibold capitalize">{searchParams.get("gateway")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-semibold">NPR {searchParams.get("amount")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>What's Next?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-orange-600 mt-1" />
                    <div>
                      <p className="font-medium">Email Confirmation</p>
                      <p className="text-sm text-gray-600">
                        A confirmation email with receipt has been sent to your email address.
                      </p>
                    </div>
                  </div>

                  {searchParams.get("type") === "membership" && (
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <p className="font-medium">Membership Activation</p>
                        <p className="text-sm text-gray-600">
                          Your membership will be activated within 24 hours. You'll receive login credentials via email.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3">
                    <Download className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium">Receipt Download</p>
                      <p className="text-sm text-gray-600">
                        You can download your payment receipt from your account dashboard.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-orange-600 hover:bg-orange-700">
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Return Home
                  </Link>
                </Button>

                {searchParams.get("type") === "membership" && (
                  <Button asChild variant="outline">
                    <Link href="/membership/login">Login to Account</Link>
                  </Button>
                )}

                <Button asChild variant="outline">
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </div>

              {/* Thank You Message */}
              <div className="text-center mt-12 p-6 bg-orange-50 rounded-lg">
                <h3 className="text-xl font-bold text-orange-600 mb-2">Thank You!</h3>
                <p className="text-gray-700">
                  Your support helps us preserve and promote Sanatan Dharma values. Together, we are building a stronger
                  spiritual community.
                </p>
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
