"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Shield, CheckCircle, XCircle, AlertCircle, Calendar, User, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VerificationResult {
  type: "member" | "certificate" | "donation" | "receipt"
  found: boolean
  data?: any
  message?: string
}

export default function VerificationPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)

  const handleVerification = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search query",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/verification?query=${encodeURIComponent(searchQuery)}`)
      if (!response.ok) throw new Error("Verification failed")

      const data = await response.json()
      setResult(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Verification failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "expired":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const quickExamples = [
    { label: "Member ID", value: "M2024001", type: "Member verification" },
    { label: "Certificate", value: "CERT-M-2024-001", type: "Certificate verification" },
    { label: "Donation ID", value: "D2024001", type: "Donation verification" },
    { label: "Receipt", value: "REC-D-2024-001", type: "Receipt verification" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Verification Center</h1>
          <p className="text-muted-foreground">Verify membership status, certificates, donations, and receipts</p>
        </div>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Universal Verification
          </CardTitle>
          <CardDescription>
            Enter Member ID, Certificate Number, Donation ID, or Receipt Number to verify
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="searchQuery">Search Query</Label>
              <Input
                id="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter ID, certificate number, or receipt number..."
                onKeyPress={(e) => e.key === "Enter" && handleVerification()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleVerification} disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </div>

          {/* Quick Examples */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Examples:</Label>
            <div className="flex flex-wrap gap-2">
              {quickExamples.map((example) => (
                <Button
                  key={example.value}
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery(example.value)}
                  className="text-xs"
                >
                  {example.label}: {example.value}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {result.found ? (
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 mr-2 text-red-600" />
              )}
              Verification Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.found && result.data ? (
              <div className="space-y-6">
                {/* Member Verification */}
                {result.type === "member" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Member Information</h3>
                      <Badge className={getStatusColor(result.data.status)}>
                        {result.data.status.charAt(0).toUpperCase() + result.data.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Member ID</Label>
                        <p className="text-sm font-mono">{result.data.member_id}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Full Name</Label>
                        <p className="text-sm">{result.data.full_name}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Email</Label>
                        <p className="text-sm">{result.data.email}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Phone</Label>
                        <p className="text-sm">{result.data.phone}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Membership Type</Label>
                        <p className="text-sm">{result.data.membership_type}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Join Date</Label>
                        <p className="text-sm">{new Date(result.data.join_date).toLocaleDateString()}</p>
                      </div>
                      {result.data.expiry_date && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Expiry Date</Label>
                          <p className="text-sm flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(result.data.expiry_date).toLocaleDateString()}
                            {new Date(result.data.expiry_date) < new Date() && (
                              <AlertCircle className="h-3 w-3 ml-2 text-red-500" />
                            )}
                          </p>
                        </div>
                      )}
                      {result.data.certificate_number && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Certificate Number</Label>
                          <p className="text-sm font-mono">{result.data.certificate_number}</p>
                        </div>
                      )}
                    </div>

                    {result.data.status === "expired" && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                          <span className="text-sm font-medium text-red-800">Membership Expired</span>
                        </div>
                        <p className="text-sm text-red-700 mt-1">
                          This membership expired on {new Date(result.data.expiry_date).toLocaleDateString()}. Please
                          contact the member for renewal.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Certificate Verification */}
                {result.type === "certificate" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Certificate Information</h3>
                      <Badge className={getStatusColor(result.data.status)}>
                        {result.data.status.charAt(0).toUpperCase() + result.data.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Certificate ID</Label>
                        <p className="text-sm font-mono">{result.data.certificate_id}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Holder Name</Label>
                        <p className="text-sm">{result.data.member_name}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Certificate Type</Label>
                        <p className="text-sm">
                          {result.data.certificate_type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Issue Date</Label>
                        <p className="text-sm">{new Date(result.data.issue_date).toLocaleDateString()}</p>
                      </div>
                      {result.data.valid_until && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Valid Until</Label>
                          <p className="text-sm">{new Date(result.data.valid_until).toLocaleDateString()}</p>
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Verification Code</Label>
                        <p className="text-sm font-mono">{result.data.verification_code}</p>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-800">Certificate Verified</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        This certificate is authentic and was issued by SDB Nepal.
                      </p>
                    </div>
                  </div>
                )}

                {/* Donation Verification */}
                {(result.type === "donation" || result.type === "receipt") && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Donation Information</h3>
                      <Badge className={getStatusColor(result.data.status)}>
                        {result.data.status.charAt(0).toUpperCase() + result.data.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Donation ID</Label>
                        <p className="text-sm font-mono">{result.data.donation_id}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Donor Name</Label>
                        <p className="text-sm">{result.data.donor_name}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Amount</Label>
                        <p className="text-sm font-semibold">
                          {result.data.currency} {result.data.amount.toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Purpose</Label>
                        <p className="text-sm">{result.data.purpose}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Donation Date</Label>
                        <p className="text-sm">{new Date(result.data.donation_date).toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Payment Method</Label>
                        <p className="text-sm">{result.data.payment_method}</p>
                      </div>
                      {result.data.receipt_number && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Receipt Number</Label>
                          <p className="text-sm font-mono">{result.data.receipt_number}</p>
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Transaction ID</Label>
                        <p className="text-sm font-mono">{result.data.transaction_id}</p>
                      </div>
                    </div>

                    {result.data.status === "approved" && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-sm font-medium text-green-800">Donation Verified</span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          This donation has been verified and approved by SDB Nepal.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Not Found</h3>
                <p className="text-red-600">
                  {result.message || "No records found for the provided query. Please check the ID and try again."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2" />
              Member Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Verify membership status, expiry dates, and certificate numbers using Member ID.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <Shield className="h-4 w-4 mr-2" />
              Certificate Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Authenticate certificates and verify their validity using certificate numbers.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <FileText className="h-4 w-4 mr-2" />
              Donation Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Verify donation records and receipt authenticity using donation or receipt IDs.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
