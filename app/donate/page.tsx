"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, CreditCard, Building2, Smartphone, DollarSign, Loader2 } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import PageVideo from "@/components/page-video"
import PageFAQ from "@/components/page-faq"

const donationAmounts = [100, 500, 1000, 2500, 5000, 10000]

const paymentMethods = [
  { id: "esewa", name: "eSewa", icon: Smartphone, description: "Pay with eSewa digital wallet" },
  { id: "khalti", name: "Khalti", icon: Smartphone, description: "Pay with Khalti digital wallet" },
  { id: "paypal", name: "PayPal", icon: CreditCard, description: "Pay with PayPal (International)" },
  { id: "stripe", name: "Credit/Debit Card", icon: CreditCard, description: "Pay with Stripe (International)" },
  { id: "imepay", name: "IME Pay", icon: Smartphone, description: "Pay with IME Pay" },
  { id: "connectips", name: "ConnectIPS", icon: Building2, description: "Pay with ConnectIPS" },
  { id: "bank_transfer", name: "Bank Transfer", icon: Building2, description: "Manual bank transfer" },
  { id: "cash", name: "Cash Payment", icon: DollarSign, description: "Pay cash at our office" },
]

export default function DonatePage() {
  const { translate, language } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    amount: "",
    customAmount: "",
    currency: "NPR",
    paymentMethod: "",
    donorName: "",
    donorEmail: "",
    donorPhone: "",
    donorAddress: "",
    purpose: "",
    message: "",
    isAnonymous: false,
    receiveUpdates: true,
  })

  const handleAmountSelect = (amount: number) => {
    setFormData({ ...formData, amount: amount.toString(), customAmount: "" })
  }

  const handleCustomAmountChange = (value: string) => {
    setFormData({ ...formData, customAmount: value, amount: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const donationAmount = Number.parseFloat(formData.amount || formData.customAmount)

      if (!donationAmount || donationAmount <= 0) {
        throw new Error("Please enter a valid donation amount")
      }

      if (!formData.paymentMethod) {
        throw new Error("Please select a payment method")
      }

      if (!formData.donorName || !formData.donorEmail) {
        throw new Error("Please fill in all required fields")
      }

      // Initiate payment
      const paymentResponse = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gateway: formData.paymentMethod,
          amount: donationAmount,
          currency: formData.currency,
          description: `Donation - ${formData.purpose || "General Fund"}`,
          customerInfo: {
            name: formData.donorName,
            email: formData.donorEmail,
            phone: formData.donorPhone,
          },
          metadata: {
            type: "donation",
            purpose: formData.purpose,
            message: formData.message,
            isAnonymous: formData.isAnonymous,
            donorAddress: formData.donorAddress,
          },
        }),
      })

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json()
        throw new Error(errorData.error || "Payment initiation failed")
      }

      const paymentResult = await paymentResponse.json()

      if (paymentResult.formHtml) {
        // For form-based payments (eSewa, IME Pay, ConnectIPS)
        const newWindow = window.open("", "_blank")
        if (newWindow) {
          newWindow.document.write(paymentResult.formHtml)
          newWindow.document.close()
        }
      } else if (paymentResult.paymentUrl) {
        // For redirect-based payments (Khalti, PayPal, Stripe)
        window.location.href = paymentResult.paymentUrl
      } else {
        // For manual payments (Bank Transfer, Cash)
        setSuccess(
          "Payment instructions have been sent to your email. Please follow the instructions to complete your donation.",
        )
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while processing your donation")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Heart className="h-16 w-16 text-orange-600" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-orange-600">
          Make a Donation
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Support the preservation and promotion of Sanatan Dharma. Your donation helps us continue our mission and serve the community.
        </p>
      </section>

      {/* Featured Video */}
      <section className="mb-12">
        <PageVideo videoId="donation-page-video" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Donation Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-orange-600" />
                Donation Form
              </CardTitle>
              <CardDescription>
                Please fill in the details below to make your donation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Donation Amount</Label>

                  <div className="grid grid-cols-3 gap-3">
                    {donationAmounts.map((amount) => (
                      <Button
                        key={amount}
                        type="button"
                        variant={formData.amount === amount.toString() ? "default" : "outline"}
                        className={formData.amount === amount.toString() ? "bg-orange-600 hover:bg-orange-700" : ""}
                        onClick={() => handleAmountSelect(amount)}
                      >
                        {formData.currency} {amount.toLocaleString()}
                      </Button>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label htmlFor="customAmount">Custom Amount</Label>
                      <Input
                        id="customAmount"
                        type="number"
                        min="1"
                        placeholder="Enter amount"
                        value={formData.customAmount}
                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                      />
                    </div>
                    <div className="w-24">
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        value={formData.currency}
                        onValueChange={(value) => setFormData({ ...formData, currency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NPR">NPR</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    Payment Method
                  </Label>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50"
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <div className="flex items-center space-x-3 flex-1">
                          <method.icon className="h-5 w-5 text-orange-600" />
                          <div>
                            <Label htmlFor={method.id} className="font-medium cursor-pointer">
                              {method.name}
                            </Label>
                            <p className="text-sm text-gray-500">{method.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Donor Information */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    Donor Information
                  </Label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="donorName">Full Name *</Label>
                      <Input
                        id="donorName"
                        required
                        value={formData.donorName}
                        onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="donorEmail">Email Address *</Label>
                      <Input
                        id="donorEmail"
                        type="email"
                        required
                        value={formData.donorEmail}
                        onChange={(e) => setFormData({ ...formData, donorEmail: e.target.value })}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="donorPhone">Phone Number</Label>
                      <Input
                        id="donorPhone"
                        type="tel"
                        value={formData.donorPhone}
                        onChange={(e) => setFormData({ ...formData, donorPhone: e.target.value })}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="purpose">Donation Purpose</Label>
                      <Select
                        value={formData.purpose}
                        onValueChange={(value) => setFormData({ ...formData, purpose: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Fund</SelectItem>
                          <SelectItem value="temple">
                            Temple Construction
                          </SelectItem>
                          <SelectItem value="education">
                            Education Programs
                          </SelectItem>
                          <SelectItem value="events">
                            Event Organization
                          </SelectItem>
                          <SelectItem value="charity">Charity Work</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="donorAddress">Address</Label>
                    <Input
                      id="donorAddress"
                      value={formData.donorAddress}
                      onChange={(e) => setFormData({ ...formData, donorAddress: e.target.value })}
                      placeholder="Enter your address"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Any message you would like to share"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isAnonymous"
                      checked={formData.isAnonymous}
                      onCheckedChange={(checked) => setFormData({ ...formData, isAnonymous: checked as boolean })}
                    />
                    <Label htmlFor="isAnonymous">
                      Make this donation anonymous
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="receiveUpdates"
                      checked={formData.receiveUpdates}
                      onCheckedChange={(checked) => setFormData({ ...formData, receiveUpdates: checked as boolean })}
                    />
                    <Label htmlFor="receiveUpdates">
                      Receive updates about our activities
                    </Label>
                  </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4 mr-2" />
                      Donate Now
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Impact Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Our Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">₹2,50,000</div>
                <p className="text-sm text-gray-600">Raised this month</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">1,250</div>
                <p className="text-sm text-gray-600">Total donors</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">45</div>
                <p className="text-sm text-gray-600">Projects completed</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Donations */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Anonymous</span>
                <span className="font-semibold">₹5,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Ram Sharma</span>
                <span className="font-semibold">₹2,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Sita Devi</span>
                <span className="font-semibold">₹1,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Anonymous</span>
                <span className="font-semibold">₹10,000</span>
              </div>
            </CardContent>
          </Card>

          {/* Tax Information */}
          <Card>
            <CardHeader>
              <CardTitle>Tax Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Your donation is eligible for tax deduction. We will provide you with a donation receipt.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-orange-600">
          Frequently Asked Questions
        </h2>
        <PageFAQ pageId="donation" />
      </section>
    </div>
  )
}
