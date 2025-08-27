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
import { Users, CreditCard, Building2, Smartphone, DollarSign, Loader2 } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { FileUpload } from "@/components/file-upload"
import PageVideo from "@/components/page-video"
import PageFAQ from "@/components/page-faq"

const membershipTypes = [
  {
    id: "basic",
    name: "Basic Membership",
    fee: 500,
    duration: "1 Year",
    benefits: ["Access to all events", "Monthly newsletter", "Community forum access", "Basic library access"],
  },
  {
    id: "premium",
    name: "Premium Membership",
    fee: 2000,
    duration: "1 Year",
    benefits: [
      "All Basic benefits",
      "Priority event booking",
      "Exclusive content access",
      "Full library access",
      "Personal consultation",
    ],
  },
  {
    id: "lifetime",
    name: "Lifetime Membership",
    fee: 25000,
    duration: "Lifetime",
    benefits: [
      "All Premium benefits",
      "Lifetime access",
      "VIP event access",
      "Annual recognition",
      "Advisory board invitation",
    ],
  },
]

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

export default function MembershipApplicationPage() {
  const { translate, language } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    membershipType: "",
    paymentMethod: "",

    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",

    // Address
    currentAddress: "",
    permanentAddress: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",

    // Professional Information
    occupation: "",
    organization: "",
    designation: "",

    // Emergency Contact
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",

    // Documents
    profilePhoto: "",
    identityDocument: "",

    // Additional Information
    interests: "",
    experience: "",
    motivation: "",
    referredBy: "",

    // Agreements
    agreeTerms: false,
    agreePrivacy: false,
    receiveUpdates: true,
  })

  const selectedMembership = membershipTypes.find((type) => type.id === formData.membershipType)

  const handleFileUpload = (field: string, fileData: any) => {
    setFormData({ ...formData, [field]: fileData.url })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      if (!formData.membershipType) {
        throw new Error("Please select a membership type")
      }

      if (!formData.paymentMethod) {
        throw new Error("Please select a payment method")
      }

      if (!formData.fullName || !formData.email || !formData.phone) {
        throw new Error("Please fill in all required fields")
      }

      if (!formData.agreeTerms || !formData.agreePrivacy) {
        throw new Error("Please agree to the terms and privacy policy")
      }

      const membershipFee = selectedMembership?.fee || 0

      // Create membership application
      const applicationResponse = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          membershipFee,
          status: "pending_payment",
          applicationDate: new Date().toISOString(),
        }),
      })

      if (!applicationResponse.ok) {
        const errorData = await applicationResponse.json()
        throw new Error(errorData.error || "Application submission failed")
      }

      const applicationResult = await applicationResponse.json()

      // Initiate payment
      const paymentResponse = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gateway: formData.paymentMethod,
          amount: membershipFee,
          currency: "NPR",
          description: `Membership Fee - ${selectedMembership?.name}`,
          customerInfo: {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
          },
          metadata: {
            type: "membership",
            membershipType: formData.membershipType,
            applicationId: applicationResult.data.id,
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
          "Your membership application has been submitted successfully! Payment instructions have been sent to your email.",
        )
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while processing your application")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Users className="h-16 w-16 text-orange-600" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-orange-600">
          Membership Application
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Join Sanatan Dharma Bikash Nepal and become part of our growing community.
        </p>
      </section>

      {/* Featured Video */}
      <section className="mb-12">
        <PageVideo videoId="membership-page-video" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Application Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                Membership Application Form
              </CardTitle>
              <CardDescription>
                Please fill in all required information accurately
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Membership Type Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    Membership Type *
                  </Label>
                  <RadioGroup
                    value={formData.membershipType}
                    onValueChange={(value) => setFormData({ ...formData, membershipType: value })}
                    className="space-y-4"
                  >
                    {membershipTypes.map((type) => (
                      <div key={type.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start space-x-3">
                          <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor={type.id} className="font-medium cursor-pointer">
                              {type.name}
                            </Label>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-lg font-bold text-orange-600">NPR {type.fee.toLocaleString()}</span>
                              <span className="text-sm text-gray-500">({type.duration})</span>
                            </div>
                            <ul className="mt-2 space-y-1">
                              {type.benefits.map((benefit, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-center">
                                  <span className="w-1 h-1 bg-orange-600 rounded-full mr-2"></span>
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    Personal Information
                  </Label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => setFormData({ ...formData, gender: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      id="nationality"
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                      placeholder="Nationality"
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    Address Information
                  </Label>

                  <div>
                    <Label htmlFor="currentAddress">Current Address</Label>
                    <Textarea
                      id="currentAddress"
                      value={formData.currentAddress}
                      onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
                      placeholder="Current address"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="permanentAddress">Permanent Address</Label>
                    <Textarea
                      id="permanentAddress"
                      value={formData.permanentAddress}
                      onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                      placeholder="Permanent address"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="Country"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        placeholder="Postal code"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    Professional Information
                  </Label>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input
                        id="occupation"
                        value={formData.occupation}
                        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                        placeholder="Occupation"
                      />
                    </div>
                    <div>
                      <Label htmlFor="organization">Organization</Label>
                      <Input
                        id="organization"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        placeholder="Organization"
                      />
                    </div>
                    <div>
                      <Label htmlFor="designation">Designation</Label>
                      <Input
                        id="designation"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        placeholder="Designation"
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    Emergency Contact
                  </Label>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="emergencyContactName">Name</Label>
                      <Input
                        id="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                        placeholder="Emergency contact name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyContactPhone">Phone Number</Label>
                      <Input
                        id="emergencyContactPhone"
                        type="tel"
                        value={formData.emergencyContactPhone}
                        onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                        placeholder="Phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyContactRelation">Relationship</Label>
                      <Input
                        id="emergencyContactRelation"
                        value={formData.emergencyContactRelation}
                        onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                        placeholder="Relationship"
                      />
                    </div>
                  </div>
                </div>

                {/* Document Upload */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Documents</Label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Profile Photo</Label>
                      <FileUpload
                        onUpload={(fileData) => handleFileUpload("profilePhoto", fileData)}
                        accept="image/*"
                        folder="member-photos"
                        maxSize={5}
                        label="Upload Photo"
                        currentFile={formData.profilePhoto}
                      />
                    </div>
                    <div>
                      <Label>Identity Document</Label>
                      <FileUpload
                        onUpload={(fileData) => handleFileUpload("identityDocument", fileData)}
                        accept="image/*,.pdf"
                        folder="member-documents"
                        maxSize={10}
                        label="Upload Document"
                        currentFile={formData.identityDocument}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    Additional Information
                  </Label>

                  <div>
                    <Label htmlFor="interests">Interests</Label>
                    <Textarea
                      id="interests"
                      value={formData.interests}
                      onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                      placeholder="Describe your interests"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="experience">Relevant Experience</Label>
                    <Textarea
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="Any relevant experience"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="motivation">
                      Why do you want to join?
                    </Label>
                    <Textarea
                      id="motivation"
                      value={formData.motivation}
                      onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                      placeholder="Your motivation to join"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="referredBy">Referred By</Label>
                    <Input
                      id="referredBy"
                      value={formData.referredBy}
                      onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                      placeholder="Name of the person who referred you"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    Payment Method *
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

                {/* Agreements */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                      className="mt-1"
                    />
                    <Label htmlFor="agreeTerms" className="text-sm">
                      I agree to the terms and conditions *
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreePrivacy"
                      checked={formData.agreePrivacy}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreePrivacy: checked as boolean })}
                      className="mt-1"
                    />
                    <Label htmlFor="agreePrivacy" className="text-sm">
                      I agree to the privacy policy *
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="receiveUpdates"
                      checked={formData.receiveUpdates}
                      onCheckedChange={(checked) => setFormData({ ...formData, receiveUpdates: checked as boolean })}
                      className="mt-1"
                    />
                    <Label htmlFor="receiveUpdates" className="text-sm">
                      I want to receive updates and newsletters
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
                      <Users className="h-4 w-4 mr-2" />
                      Submit Application
                      {selectedMembership && (
                        <span className="ml-2">(NPR {selectedMembership.fee.toLocaleString()})</span>
                      )}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Membership Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Membership Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span className="text-sm">Access to all events</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span className="text-sm">Library access</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span className="text-sm">Community network</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span className="text-sm">Monthly newsletter</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span className="text-sm">Special discounts</span>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">Office</p>
                <p className="text-sm text-gray-600">Kathmandu, Nepal</p>
              </div>
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-gray-600">+977-1-4444444</p>
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-gray-600">membership@sanatandharma.org</p>
              </div>
            </CardContent>
          </Card>

          {/* Processing Time */}
          <Card>
            <CardHeader>
              <CardTitle>Processing Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Your application will be processed within 3-5 business days. Membership will be activated after payment confirmation.
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
        <PageFAQ pageId="membership" />
      </section>
    </div>
  )
}
