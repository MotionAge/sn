"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Shield, CheckCircle, XCircle, AlertTriangle, User, FileText } from "lucide-react"

export default function VerificationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)

  // Mock verification data
  const mockVerificationData = {
    M2024001: {
      type: "membership",
      memberName: "राम बहादुर श्रेष्ठ",
      memberId: "M2024001",
      membershipType: "Lifetime",
      status: "Active",
      issueDate: "2024-01-15",
      expiryDate: "Lifetime",
      certificateNumber: "CERT-M-2024-001",
      renewalDue: null,
      contactEmail: "ram.shrestha@email.com",
      contactPhone: "+977-9841234567",
    },
    "CERT-M-2024-001": {
      type: "certificate",
      certificateNumber: "CERT-M-2024-001",
      memberName: "राम बहादुर श्रेष्ठ",
      memberId: "M2024001",
      certificateType: "Membership Certificate",
      issueDate: "2024-01-15",
      validUntil: "Lifetime",
      status: "Valid",
      verificationCode: "SDB-2024-M-001-VERIFY",
    },
    D2024001: {
      type: "donation",
      donationId: "D2024001",
      donorName: "अनिल कुमार गुरुङ",
      amount: 5000,
      currency: "NPR",
      purpose: "Temple Construction",
      donationDate: "2024-01-13",
      receiptNumber: "REC-D-2024-001",
      status: "Verified",
      paymentMethod: "Bank Transfer",
    },
    "REC-D-2024-001": {
      type: "receipt",
      receiptNumber: "REC-D-2024-001",
      donorName: "अनिल कुमार गुरुङ",
      donationId: "D2024001",
      amount: 5000,
      currency: "NPR",
      issueDate: "2024-01-13",
      status: "Valid",
      verificationCode: "SDB-2024-D-001-VERIFY",
    },
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock search result
      const result = mockVerificationData[searchQuery as keyof typeof mockVerificationData]
      setVerificationResult(result || null)
    } catch (error) {
      console.error("Search error:", error)
      setVerificationResult(null)
    } finally {
      setIsSearching(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "valid":
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "expired":
      case "invalid":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "pending":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default:
        return <Shield className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "valid":
      case "verified":
        return "bg-green-100 text-green-800"
      case "expired":
      case "invalid":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderVerificationResult = () => {
    if (!verificationResult) {
      return (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            No records found for the provided ID/Number. Please check and try again.
          </AlertDescription>
        </Alert>
      )
    }

    switch (verificationResult.type) {
      case "membership":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Membership Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(verificationResult.status)}
                  <Badge className={getStatusColor(verificationResult.status)}>{verificationResult.status}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Member Information</h4>
                  <p>
                    <strong>Name:</strong> {verificationResult.memberName}
                  </p>
                  <p>
                    <strong>Member ID:</strong> {verificationResult.memberId}
                  </p>
                  <p>
                    <strong>Membership Type:</strong> {verificationResult.membershipType}
                  </p>
                  <p>
                    <strong>Email:</strong> {verificationResult.contactEmail}
                  </p>
                  <p>
                    <strong>Phone:</strong> {verificationResult.contactPhone}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Membership Details</h4>
                  <p>
                    <strong>Issue Date:</strong> {verificationResult.issueDate}
                  </p>
                  <p>
                    <strong>Expiry Date:</strong> {verificationResult.expiryDate}
                  </p>
                  <p>
                    <strong>Certificate Number:</strong> {verificationResult.certificateNumber}
                  </p>
                  {verificationResult.renewalDue && (
                    <p>
                      <strong>Renewal Due:</strong> {verificationResult.renewalDue}
                    </p>
                  )}
                </div>
              </div>

              {verificationResult.status === "Active" && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    This membership is currently active and valid.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )

      case "certificate":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Certificate Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(verificationResult.status)}
                  <Badge className={getStatusColor(verificationResult.status)}>{verificationResult.status}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Certificate Information</h4>
                  <p>
                    <strong>Certificate Number:</strong> {verificationResult.certificateNumber}
                  </p>
                  <p>
                    <strong>Type:</strong> {verificationResult.certificateType}
                  </p>
                  <p>
                    <strong>Issue Date:</strong> {verificationResult.issueDate}
                  </p>
                  <p>
                    <strong>Valid Until:</strong> {verificationResult.validUntil}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Holder Information</h4>
                  <p>
                    <strong>Name:</strong> {verificationResult.memberName}
                  </p>
                  <p>
                    <strong>Member ID:</strong> {verificationResult.memberId}
                  </p>
                  <p>
                    <strong>Verification Code:</strong> {verificationResult.verificationCode}
                  </p>
                </div>
              </div>

              {verificationResult.status === "Valid" && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    This certificate is authentic and currently valid.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )

      case "donation":
      case "receipt":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                {verificationResult.type === "donation" ? "Donation" : "Receipt"} Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(verificationResult.status)}
                  <Badge className={getStatusColor(verificationResult.status)}>{verificationResult.status}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Donation Information</h4>
                  <p>
                    <strong>Amount:</strong> {verificationResult.currency} {verificationResult.amount?.toLocaleString()}
                  </p>
                  <p>
                    <strong>Purpose:</strong> {verificationResult.purpose}
                  </p>
                  <p>
                    <strong>Date:</strong> {verificationResult.donationDate || verificationResult.issueDate}
                  </p>
                  {verificationResult.paymentMethod && (
                    <p>
                      <strong>Payment Method:</strong> {verificationResult.paymentMethod}
                    </p>
                  )}
                </div>
                <div>
                  <h4 className="font-medium mb-2">Donor Information</h4>
                  <p>
                    <strong>Name:</strong> {verificationResult.donorName}
                  </p>
                  {verificationResult.receiptNumber && (
                    <p>
                      <strong>Receipt Number:</strong> {verificationResult.receiptNumber}
                    </p>
                  )}
                  {verificationResult.donationId && (
                    <p>
                      <strong>Donation ID:</strong> {verificationResult.donationId}
                    </p>
                  )}
                  {verificationResult.verificationCode && (
                    <p>
                      <strong>Verification Code:</strong> {verificationResult.verificationCode}
                    </p>
                  )}
                </div>
              </div>

              {(verificationResult.status === "Verified" || verificationResult.status === "Valid") && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    This {verificationResult.type} record is authentic and verified.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Verification Center</h1>
          <p className="text-muted-foreground">Verify membership status, certificates, and donation receipts</p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-600">
          <Shield className="h-4 w-4 mr-1" />
          Secure Verification
        </Badge>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Verification Search
          </CardTitle>
          <CardDescription>
            Enter Member ID, Certificate Number, Donation ID, or Receipt Number to verify
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="searchQuery">ID/Number to Verify</Label>
              <Input
                id="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., M2024001, CERT-M-2024-001, D2024001, REC-D-2024-001"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
                <Search className="h-4 w-4 mr-2" />
                {isSearching ? "Searching..." : "Verify"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {(verificationResult !== null || (searchQuery && !isSearching)) && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Verification Results</h2>
          {renderVerificationResult()}
        </div>
      )}

      {/* Quick Access Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access Examples</CardTitle>
          <CardDescription>Click on any example to test the verification system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" onClick={() => setSearchQuery("M2024001")} className="text-left">
              <div>
                <div className="font-medium">Member ID</div>
                <div className="text-sm text-muted-foreground">M2024001</div>
              </div>
            </Button>
            <Button variant="outline" onClick={() => setSearchQuery("CERT-M-2024-001")} className="text-left">
              <div>
                <div className="font-medium">Certificate</div>
                <div className="text-sm text-muted-foreground">CERT-M-2024-001</div>
              </div>
            </Button>
            <Button variant="outline" onClick={() => setSearchQuery("D2024001")} className="text-left">
              <div>
                <div className="font-medium">Donation ID</div>
                <div className="text-sm text-muted-foreground">D2024001</div>
              </div>
            </Button>
            <Button variant="outline" onClick={() => setSearchQuery("REC-D-2024-001")} className="text-left">
              <div>
                <div className="font-medium">Receipt</div>
                <div className="text-sm text-muted-foreground">REC-D-2024-001</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
