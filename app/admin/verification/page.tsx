"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Shield, CheckCircle, XCircle, AlertTriangle, User, FileText, Loader2 } from "lucide-react"
import { useApi } from "@/hooks/use-api"
import { apiClient } from "@/lib/api-client"

interface VerificationResult {
  type: 'membership' | 'certificate' | 'donation' | 'receipt'
  id: string
  name: string
  status: string
  issue_date: string
  expiry_date?: string
  valid_until?: string
  certificate_number?: string
  receipt_number?: string
  verification_code?: string
  amount?: number
  currency?: string
  purpose?: string
}

export default function VerificationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search query")
      return
    }

    setIsSearching(true)
    setError("")
    setVerificationResult(null)

    try {
      const result = await apiClient.verifyItem(searchQuery.trim())
      if (result.error) {
        setError(result.error)
      } else {
        setVerificationResult(result.data as VerificationResult)
      }
    } catch (error) {
      setError("Failed to verify item. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'valid':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'expired':
      case 'invalid':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'pending':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'valid':
        return 'bg-green-100 text-green-800'
      case 'expired':
      case 'invalid':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'Lifetime') return dateString
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Verification Center</h1>
          <p className="text-muted-foreground">Verify membership certificates, donation receipts, and other documents</p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-orange-600" />
          <span className="text-sm text-muted-foreground">Secure Verification</span>
        </div>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Verify Document</CardTitle>
          <CardDescription>
            Enter a membership ID, certificate number, donation ID, or receipt number to verify its authenticity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter ID, certificate number, or receipt number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="text-lg"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !searchQuery.trim()}
              className="px-8"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Verify
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Verification Result */}
      {verificationResult && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(verificationResult.status)}
                  Verification Result
                </CardTitle>
                <CardDescription>
                  {verificationResult.type.charAt(0).toUpperCase() + verificationResult.type.slice(1)} Verification
                </CardDescription>
              </div>
              <Badge className={getStatusColor(verificationResult.status)}>
                {verificationResult.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-600 mb-2">Document Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Type:</span>
                      <span className="text-sm font-medium">
                        {verificationResult.type.charAt(0).toUpperCase() + verificationResult.type.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">ID:</span>
                      <span className="text-sm font-medium font-mono">{verificationResult.id}</span>
                    </div>
                    {verificationResult.certificate_number && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Certificate #:</span>
                        <span className="text-sm font-medium">{verificationResult.certificate_number}</span>
                      </div>
                    )}
                    {verificationResult.receipt_number && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Receipt #:</span>
                        <span className="text-sm font-medium">{verificationResult.receipt_number}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-600 mb-2">Personal Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Name:</span>
                      <span className="text-sm font-medium">{verificationResult.name}</span>
                    </div>
                    {verificationResult.amount && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Amount:</span>
                        <span className="text-sm font-medium">
                          {verificationResult.currency} {verificationResult.amount}
                        </span>
                      </div>
                    )}
                    {verificationResult.purpose && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Purpose:</span>
                        <span className="text-sm font-medium">{verificationResult.purpose}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-600 mb-2">Validity Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Issue Date:</span>
                      <span className="text-sm font-medium">{formatDate(verificationResult.issue_date)}</span>
                    </div>
                    {verificationResult.expiry_date && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Expiry Date:</span>
                        <span className="text-sm font-medium">{formatDate(verificationResult.expiry_date)}</span>
                      </div>
                    )}
                    {verificationResult.valid_until && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Valid Until:</span>
                        <span className="text-sm font-medium">{formatDate(verificationResult.valid_until)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {verificationResult.verification_code && (
                  <div>
                    <h4 className="font-medium text-gray-600 mb-2">Verification Code</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <code className="text-sm font-mono text-gray-800">
                        {verificationResult.verification_code}
                      </code>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Use this code for official verification purposes
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>This verification was performed using our secure database system</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Membership Verification</h4>
              <p className="text-gray-600">Enter membership ID (e.g., M2024001) to verify active membership status</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Certificate Verification</h4>
              <p className="text-gray-600">Enter certificate number to verify the authenticity of issued certificates</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Donation Verification</h4>
              <p className="text-gray-600">Enter donation ID or receipt number to verify donation records</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
