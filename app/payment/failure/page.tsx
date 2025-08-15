"use client"

import { useSearchParams } from "next/navigation"
import { useTranslation } from "@/hooks/use-translation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Home, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function PaymentFailurePage() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const method = searchParams.get("method")
  const orderId = searchParams.get("orderId")

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <X className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{t("Payment Failed")}</h1>
              <p className="text-xl text-gray-600 mb-6">{t("Unfortunately, your payment could not be processed")}</p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <h3 className="font-semibold text-red-800 mb-2">{t("Possible Reasons:")}</h3>
                <ul className="text-sm text-red-700 space-y-1 text-left">
                  <li>• {t("Insufficient funds in your account")}</li>
                  <li>• {t("Payment was cancelled by user")}</li>
                  <li>• {t("Network connectivity issues")}</li>
                  <li>• {t("Payment gateway timeout")}</li>
                  <li>• {t("Invalid payment details")}</li>
                </ul>
              </div>

              {orderId && (
                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {t("Order ID")}: <span className="font-mono">{orderId}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("Payment Method")}: <span className="capitalize">{method}</span>
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/donate">
                    <RefreshCw className="w-5 h-5 mr-2" />
                    {t("Try Again")}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  <Link href="/">
                    <Home className="w-5 h-5 mr-2" />
                    {t("Back to Home")}
                  </Link>
                </Button>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">{t("Need Help?")}</h4>
                <p className="text-sm text-blue-700">
                  {t("If you continue to experience issues, please contact our support team at")}{" "}
                  <a href="mailto:support@sanatandharmaboard.org" className="underline">
                    support@sanatandharmaboard.org
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
