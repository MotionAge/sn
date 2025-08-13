"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle, XCircle, Clock, AlertCircle, Download, Eye } from "lucide-react"
import { useApi } from "@/hooks/use-api"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

interface ApprovalItem {
  id: string
  type: 'membership' | 'donation' | 'event_registration'
  applicant_name: string
  email: string
  phone: string
  amount?: number
  currency?: string
  payment_method?: string
  transaction_id?: string
  applied_date: string
  status: 'pending' | 'approved' | 'rejected'
  documents?: string[]
  address?: string
  purpose?: string
  receipt_requested?: boolean
  event_title?: string
  event_date?: string
}

export default function ApprovalsPage() {
  const [selectedTab, setSelectedTab] = useState("pending")
  const [isProcessing, setIsProcessing] = useState(false)

  // Fetch pending approvals from API
  const { data: approvals, loading, error, execute: fetchApprovals } = useApi(apiClient.getPendingApprovals)

  useEffect(() => {
    fetchApprovals()
  }, [fetchApprovals])

  const handleApprove = async (id: string, type: string) => {
    setIsProcessing(true)
    try {
      const result = await apiClient.approveItem(id, type)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Item approved successfully")
        fetchApprovals()
      }
    } catch (error) {
      toast.error("Failed to approve item")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async (id: string, type: string) => {
    setIsProcessing(true)
    try {
      const result = await apiClient.rejectItem(id, type)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Item rejected successfully")
        fetchApprovals()
      }
    } catch (error) {
      toast.error("Failed to reject item")
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="space-y-4">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  if (error || !approvals) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load approvals: {error}</AlertDescription>
        </Alert>
        <Button onClick={fetchApprovals} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  // Filter approvals by status
  const approvalList: ApprovalItem[] = Array.isArray(approvals) ? approvals : []
  const pendingApprovals = approvalList.filter((item: ApprovalItem) => item.status === 'pending')
  const approvedItems = approvalList.filter((item: ApprovalItem) => item.status === 'approved')
  const rejectedItems = approvalList.filter((item: ApprovalItem) => item.status === 'rejected')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const renderApprovalItem = (item: ApprovalItem) => (
    <Card key={item.id} className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{item.applicant_name}</CardTitle>
            <CardDescription>{item.email} • {item.phone}</CardDescription>
            {item.address && <CardDescription>{item.address}</CardDescription>}
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(item.status)}
            <Badge variant="outline">{item.type.replace('_', ' ').toUpperCase()}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Applied Date</p>
            <p className="text-sm">{formatDate(item.applied_date)}</p>
          </div>
          {item.amount && (
            <div>
              <p className="text-sm font-medium text-gray-600">Amount</p>
              <p className="text-sm">{item.currency} {item.amount}</p>
            </div>
          )}
          {item.payment_method && (
            <div>
              <p className="text-sm font-medium text-gray-600">Payment Method</p>
              <p className="text-sm">{item.payment_method}</p>
            </div>
          )}
          {item.transaction_id && (
            <div>
              <p className="text-sm font-medium text-gray-600">Transaction ID</p>
              <p className="text-sm font-mono text-xs">{item.transaction_id}</p>
            </div>
          )}
          {item.event_title && (
            <div>
              <p className="text-sm font-medium text-gray-600">Event</p>
              <p className="text-sm">{item.event_title}</p>
            </div>
          )}
        </div>

        {item.documents && item.documents.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-600 mb-2">Documents</p>
            <div className="flex gap-2">
              {item.documents.map((doc, index) => (
                <Button key={index} variant="outline" size="sm">
                  <Download className="h-3 w-3 mr-1" />
                  {doc}
                </Button>
              ))}
            </div>
          </div>
        )}

        {item.status === 'pending' && (
          <div className="flex gap-2">
            <Button
              onClick={() => handleApprove(item.id, item.type)}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button
              onClick={() => handleReject(item.id, item.type)}
              disabled={isProcessing}
              variant="destructive"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Approvals Management</h1>
          <p className="text-muted-foreground">Review and manage pending membership applications, donations, and event registrations</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({pendingApprovals.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedItems.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingApprovals.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                No pending approvals
              </CardContent>
            </Card>
          ) : (
            pendingApprovals.map(renderApprovalItem)
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedItems.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                No approved items
              </CardContent>
            </Card>
          ) : (
            approvedItems.map(renderApprovalItem)
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedItems.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                No rejected items
              </CardContent>
            </Card>
          ) : (
            rejectedItems.map(renderApprovalItem)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
