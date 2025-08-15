"use client"

import type React from "react"

import { useState } from "react"
import { useTranslation } from "@/hooks/use-translation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Heart, CreditCard, Banknote, Smartphone, Building2, Wallet } from "lucide-react"
import { toast } from "sonner"

const paymentMethods = [
  { id: "esewa", name: "eSewa", icon: Wallet, description: "Digital wallet payment" },
  { id: "khalti", name: "Khalti", icon: Smartphone, description: "Mobile payment" },
  { id: "paypal", name: "PayPal", icon: CreditCard, description: "International payment" },
  { id: "stripe", name: "Credit/Debit Card", icon: CreditCard, description: "Visa, Mastercard, etc." },
  { id: "imepay", name: "IME Pay", icon: Smartphone, description: "Mobile banking" },
  { id: "connectips", name: "ConnectIPS", icon: Building2, description: "Internet banking" },
  { id: "bank", name: "Bank Transfer", icon: Building2, description: "Direct bank transfer" },
  { id: "cash", name: "Cash Payment", icon: Banknote, description: "Pay at office" },
]

const currencies = [
  { code: "NPR", symbol: "Rs.", name: "Nepali Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
]

const predefinedAmounts = {
  NPR: [500, 1000, 2500, 5000, 10000],
  USD: [5, 10, 25, 50, 100],
  EUR: [5, 10, 25, 50, 100],
  GBP: [5, 10, 25, 50, 100],
}

export default function DonatePage() {
  const { translate } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [currency, setCurrency] = useState("NPR")
  const [amount, setAmount] = useState("")
  const [customAmount, setCustomAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  })

  const selectedCurrency = currencies.find((c) => c.code === currency)
  const amounts = predefinedAmounts[currency as keyof typeof predefinedAmounts] || []

  const handleAmountSelect = (selectedAmount: string) => {
    setAmount(selectedAmount)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setAmount("")
  }

  const getFinalAmount = () => {
    return Number.parseFloat(customAmount || amount || "0")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const finalAmount = getFinalAmount()
    if (finalAmount <= 0) {
      toast.error("Please enter a valid donation amount")
      return
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method")
      return
    }

    if (!donorInfo.name || !donorInfo.email) {
      toast.error("Please fill in your name and email")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: paymentMethod,
          amount: finalAmount,
          currency,
          description: `Donation to Sanatan Dharma Board Nepal - ${finalAmount} ${currency}`,
          type: "donation",
          customerInfo: {
            name: donorInfo.name,
            email: donorInfo.email,
            phone: donorInfo.phone,
          },
        }),
      })

      const result = await response.json()

      if (result.success) {
        if (result.formHtml) {
          // For form-based payments (eSewa, IME Pay, ConnectIPS)
          const newWindow = window.open("", "_blank")
          if (newWindow) {
            newWindow.document.write(result.formHtml)
            newWindow.document.close()
          }
        } else if (result.redirectUrl) {
          // For redirect-based payments (Khalti, PayPal, Stripe)
          window.location.href = result.redirectUrl
        }
      } else {
        toast.error(result.error || "Payment initiation failed")
      }
    } catch (error) {
      console.error("Donation error:", error)
      toast.error("An error occurred while processing your donation")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
              <Heart className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{translate("Make a Donation")}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {translate("Support our mission to preserve and promote Sanatan Dharma values and culture")}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Donation Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-orange-600" />
                  {translate("Donation Details")}
                </CardTitle>
                <CardDescription>{translate("Choose your donation amount and payment method")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Currency Selection */}
                  <div className="space-y-2">
                    <Label>{translate("Currency")}</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((curr) => (
                          <SelectItem key={curr.code} value={curr.code}>
                            {curr.symbol} {curr.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Predefined Amounts */}
                  <div className="space-y-2">
                    <Label>{translate("Select Amount")}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {amounts.map((amt) => (
                        <Button
                          key={amt}
                          type="button"
                          variant={amount === amt.toString() ? "default" : "outline"}
                          onClick={() => handleAmountSelect(amt.toString())}
                          className="h-12"
                        >
                          {selectedCurrency?.symbol}
                          {amt}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div className="space-y-2">
                    <Label>{translate("Or Enter Custom Amount")}</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {selectedCurrency?.symbol}
                      </span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={customAmount}
                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                        className="pl-8"
                        min="1"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-3">
                    <Label>{translate("Payment Method")}</Label>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="grid gap-3">
                        {paymentMethods.map((method) => {
                          const Icon = method.icon
                          return (
                            <div
                              key={method.id}
                              className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50"
                            >
                              <RadioGroupItem value={method.id} id={method.id} />
                              <Label htmlFor={method.id} className="flex items-center gap-3 cursor-pointer flex-1">
                                <Icon className="w-5 h-5 text-gray-600" />
                                <div>
                                  <div className="font-medium">{method.name}</div>
                                  <div className="text-sm text-gray-500">{method.description}</div>
                                </div>
                              </Label>
                            </div>
                          )
                        })}
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Donor Information */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">{translate("Donor Information")}</Label>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{translate("Full Name")} *</Label>
                        <Input
                          id="name"
                          value={donorInfo.name}
                          onChange={(e) => setDonorInfo((prev) => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{translate("Email")} *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={donorInfo.email}
                          onChange={(e) => setDonorInfo((prev) => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">{translate("Phone Number")}</Label>
                        <Input
                          id="phone"
                          value={donorInfo.phone}
                          onChange={(e) => setDonorInfo((prev) => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">{translate("Address")}</Label>
                        <Input
                          id="address"
                          value={donorInfo.address}
                          onChange={(e) => setDonorInfo((prev) => ({ ...prev, address: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{translate("Message (Optional)")}</Label>
                      <Textarea
                        id="message"
                        placeholder={translate("Share why you're supporting our cause...")}
                        value={donorInfo.message}
                        onChange={(e) => setDonorInfo((prev) => ({ ...prev, message: e.target.value }))}
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full h-12 text-lg" disabled={loading || getFinalAmount() <= 0}>
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {translate("Processing...")}
                      </>
                    ) : (
                      <>
                        <Heart className="w-5 h-5 mr-2" />
                        {translate("Donate")} {selectedCurrency?.symbol}
                        {getFinalAmount().toFixed(2)}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Donation Impact */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{translate("Your Impact")}</CardTitle>
                  <CardDescription>{translate("See how your donation makes a difference")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-900 mb-2">Rs. 500</h4>
                    <p className="text-orange-800 text-sm">{translate("Provides educational materials for one student")}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2">Rs. 1,000</h4>
                    <p className="text-red-800 text-sm">{translate("Supports cultural event organization")}</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">Rs. 5,000</h4>
                    <p className="text-yellow-800 text-sm">{translate("Funds community outreach programs")}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{translate("Secure Payment")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {translate("SSL encrypted transactions")}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {translate("Multiple payment options")}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {translate("Instant receipt generation")}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {translate("Tax deduction certificate")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
