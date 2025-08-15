"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download, Home } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function EsewaSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isVerifying, setIsVerifying] = useState(true)
  const [verificationResult, setVerificationResult] = useState<any>(null)

  useEffect(() => {
    const verifyPayment = async () => {
      const oid = searchParams.get("oid")
      const amt = searchParams.get("amt")
      const refId = searchParams.get("refId")

      if (!oid || !amt || !refId) {
        toast({
          title: "Error",
          description: "Missing payment parameters",
          variant: "destructive",
        })
        router.push("/donate")
        return
      }

      try {
        const response = await fetch("/api/payments/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentId: oid,
            gatewayData: { refId },
          }),
        })

        const result = await response.json()
        setVerificationResult(result)

        if (result.success) {
          toast({
            title: "Payment Successful!",
            description: "Your payment has been verified successfully.",
          })
        } else {
          toast({
            title: "Payment Verification Failed",
            description: result.message,
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Verification Error",
          description: "Failed to verify payment",
          variant: "destructive",
        })
      } finally {
        setIsVerifying(false)
      }
    }

    verifyPayment()
  }, [searchParams, router, toast])

  if (isVerifying) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Verifying Payment...</h2>
            <p className="text-gray-600">Please wait while we verify your payment with eSewa.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {verificationResult?.success ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-500 text-2xl">✕</span>
              </div>
            )}
          </div>
          <CardTitle className={verificationResult?.success ? "text-green-600" : "text-red-600"}>
            {verificationResult?.success ? "Payment Successful!" : "Payment Failed"}
          </CardTitle>
          <CardDescription>
            {verificationResult?.success
              ? "Your payment has been processed successfully."
              : "There was an issue with your payment verification."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {verificationResult?.success && (
            <>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Payment Details</h3>
                <p>
                  <strong>Transaction ID:</strong> {verificationResult.transactionId}
                </p>
                <p>
                  <strong>Amount:</strong> NPR {searchParams.get("amt")}
                </p>
                <p>
                  <strong>Status:</strong> Completed
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1" onClick={() => router.push("/")}>
                  <Home className="h-4 w-4 mr-2" />
                  Go to Home
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              </div>
            </>
          )}

          {!verificationResult?.success && (
            <div className="flex flex-col gap-3">
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-800">{verificationResult?.message}</p>
              </div>
              <Button onClick={() => router.push("/donate")} className="w-full">
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
