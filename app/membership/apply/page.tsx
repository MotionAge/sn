"use client"

import type React from "react"

import { useState } from "react"
import { useTranslation } from "@/hooks/use-translation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Users, CreditCard, Banknote, Smartphone, Building2, Wallet } from "lucide-react"
import { toast } from "sonner"

const membershipTypes = [
  {
    id: "regular",
    name: "Regular Membership",
    fee: 1000,
    currency: "NPR",
    benefits: ["Access to all events", "Monthly newsletter", "Community support", "Cultural programs"],
  },
  {
    id: "premium",
    name: "Premium Membership",
    fee: 5000,
    currency: "NPR",
    benefits: [
      "All regular benefits",
      "Priority event booking",
      "Exclusive workshops",
      "Personal consultation",
      "Annual retreat access",
    ],
  },
  {
    id: "lifetime",
    name: "Lifetime Membership",
    fee: 25000,
    currency: "NPR",
    benefits: [
      "All premium benefits",
      "Lifetime validity",
      "VIP event access",
      "Board meeting participation",
      "Legacy recognition",
    ],
  },
]

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

export default function MembershipApplyPage() {
  const { translate } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [selectedMembership, setSelectedMembership] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [memberInfo, setMemberInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    occupation: "",
    organization: "",
    interests: "",
    referredBy: "",
    motivation: "",
  })

  const selectedMembershipType = membershipTypes.find((m) => m.id === selectedMembership)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedMembership) {
      toast.error("Please select a membership type")
      return
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method")
      return
    }

    if (!memberInfo.firstName || !memberInfo.lastName || !memberInfo.email || !memberInfo.phone) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions")
      return
    }

    setLoading(true)

    try {
      const membershipType = membershipTypes.find((m) => m.id === selectedMembership)
      if (!membershipType) {
        toast.error("Invalid membership type")
        return
      }

      const response = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: paymentMethod,
          amount: membershipType.fee,
          currency: membershipType.currency,
          description: `${membershipType.name} - Sanatan Dharma Board Nepal`,
          type: "membership",
          customerInfo: {
            name: `${memberInfo.firstName} ${memberInfo.lastName}`,
            email: memberInfo.email,
            phone: memberInfo.phone,
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
      console.error("Membership application error:", error)
      toast.error("An error occurred while processing your application")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{translate("Join Our Community")}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {translate("Become a member of Sanatan Dharma Board Nepal and be part of our mission")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Membership Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>{translate("Choose Membership Type")}</CardTitle>
                <CardDescription>{translate("Select the membership plan that best suits your needs")}</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedMembership} onValueChange={setSelectedMembership}>
                  <div className="grid gap-4">
                    {membershipTypes.map((membership) => (
                      <div key={membership.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start space-x-3">
                          <RadioGroupItem value={membership.id} id={membership.id} className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor={membership.id} className="cursor-pointer">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg">{membership.name}</h3>
                                <span className="text-2xl font-bold text-blue-600">
                                  Rs. {membership.fee.toLocaleString()}
                                </span>
                              </div>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {membership.benefits.map((benefit, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            </Label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>{translate("Personal Information")}</CardTitle>
                <CardDescription>{translate("Please provide your personal details")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{translate("First Name")} *</Label>
                    <Input
                      id="firstName"
                      value={memberInfo.firstName}
                      onChange={(e) => setMemberInfo((prev) => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{translate("Last Name")} *</Label>
                    <Input
                      id="lastName"
                      value={memberInfo.lastName}
                      onChange={(e) => setMemberInfo((prev) => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{translate("Email Address")} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={memberInfo.email}
                      onChange={(e) => setMemberInfo((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{translate("Phone Number")} *</Label>
                    <Input
                      id="phone"
                      value={memberInfo.phone}
                      onChange={(e) => setMemberInfo((prev) => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">{translate("Address")}</Label>
                  <Input
                    id="address"
                    value={memberInfo.address}
                    onChange={(e) => setMemberInfo((prev) => ({ ...prev, address: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">{translate("City")}</Label>
                    <Input
                      id="city"
                      value={memberInfo.city}
                      onChange={(e) => setMemberInfo((prev) => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">{translate("Country")}</Label>
                    <Input
                      id="country"
                      value={memberInfo.country}
                      onChange={(e) => setMemberInfo((prev) => ({ ...prev, country: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="occupation">{translate("Occupation")}</Label>
                    <Input
                      id="occupation"
                      value={memberInfo.occupation}
                      onChange={(e) => setMemberInfo((prev) => ({ ...prev, occupation: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization">{translate("Organization")}</Label>
                    <Input
                      id="organization"
                      value={memberInfo.organization}
                      onChange={(e) => setMemberInfo((prev) => ({ ...prev, organization: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests">{translate("Areas of Interest")}</Label>
                  <Textarea
                    id="interests"
                    placeholder={translate("e.g., Cultural events, Educational programs, Community service...")}
                    value={memberInfo.interests}
                    onChange={(e) => setMemberInfo((prev) => ({ ...prev, interests: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referredBy">{translate("Referred By (Optional)")}</Label>
                  <Input
                    id="referredBy"
                    placeholder={translate("Name of the person who referred you")}
                    value={memberInfo.referredBy}
                    onChange={(e) => setMemberInfo((prev) => ({ ...prev, referredBy: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivation">{translate("Why do you want to join?")}</Label>
                  <Textarea
                    id="motivation"
                    placeholder={translate("Share your motivation for joining our community...")}
                    value={memberInfo.motivation}
                    onChange={(e) => setMemberInfo((prev) => ({ ...prev, motivation: e.target.value }))}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>{translate("Payment Method")}</CardTitle>
                <CardDescription>{translate("Choose how you would like to pay your membership fee")}</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="grid gap-3">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon
                      return (
                        <div
                          key={method.id}
                          className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50"
                        >
                          <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
                          <Label
                            htmlFor={`payment-${method.id}`}
                            className="flex items-center gap-3 cursor-pointer flex-1"
                          >
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
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    {translate(
                      "I agree to the terms and conditions of membership and understand that my application will be reviewed by the board. I commit to upholding the values and principles of Sanatan Dharma Board Nepal.",
                    )}
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                size="lg"
                className="px-12 h-12 text-lg"
                disabled={loading || !selectedMembership || !paymentMethod || !agreedToTerms}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {translate("Processing...")}
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5 mr-2" />
                    {translate("Apply for Membership")}
                    {selectedMembershipType && (
                      <span className="ml-2">- Rs. {selectedMembershipType.fee.toLocaleString()}</span>
                    )}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
