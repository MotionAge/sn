"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { XCircle, Home, RefreshCw, HelpCircle } from "lucide-react"
import Link from "next/link"

export default function PaymentFailurePage() {
  const searchParams = useSearchParams()
  const gateway = searchParams.get("gateway")
  const error = searchParams.get("error") || "Payment was not completed"

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Failure Header */}
        <div className="text-center mb-8">
          <XCircle className="h-20 w-20 text-red-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-red-600 mb-2">Payment Failed</h1>
          <p className="text-xl text-gray-600">We couldn't process your payment. Please try again.</p>
        </div>

        {/* Error Details */}
        <Alert variant="destructive" className="mb-8">
          <AlertDescription>
            <strong>Error:</strong> {error}
          </AlertDescription>
        </Alert>

        {/* Failure Reasons */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Common Reasons for Payment Failure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
              <p className="text-sm">Insufficient funds in your account</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
              <p className="text-sm">Incorrect payment details entered</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
              <p className="text-sm">Network connectivity issues</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
              <p className="text-sm">Payment gateway temporary unavailability</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
              <p className="text-sm">Transaction cancelled by user</p>
            </div>
          </CardContent>
        </Card>

        {/* What to do next */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What You Can Do</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <RefreshCw className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="font-medium">Try Again</p>
                <p className="text-sm text-gray-600">Go back and retry the payment with correct details</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <HelpCircle className="h-5 w-5 text-orange-600 mt-1" />
              <div>
                <p className="font-medium">Contact Support</p>
                <p className="text-sm text-gray-600">
                  If the problem persists, contact our support team for assistance
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center mt-1">
                <span className="text-white text-xs">₹</span>
              </div>
              <div>
                <p className="font-medium">Try Different Payment Method</p>
                <p className="text-sm text-gray-600">
                  Use an alternative payment method like bank transfer or cash payment
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-orange-600 hover:bg-orange-700">
            <Link href="/donate">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/contact">
              <HelpCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </Link>
          </Button>
        </div>

        {/* Support Information */}
        <div className="text-center mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">Our support team is here to help you complete your transaction.</p>
          <div className="space-y-2">
            <p className="text-sm">
              <strong>Email:</strong> support@sanatandharma.org
            </p>
            <p className="text-sm">
              <strong>Phone:</strong> +977-1-4444444
            </p>
            <p className="text-sm">
              <strong>Office Hours:</strong> Sunday-Friday, 10:00 AM - 5:00 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
