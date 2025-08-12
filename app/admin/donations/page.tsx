"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Download, DollarSign, TrendingUp, Users, Receipt, AlertCircle } from "lucide-react"
import { useDonations } from "@/hooks/use-api"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

interface Donation {
  id: string
  donor_name: string
  email?: string
  amount: number
  currency: string
  project_id?: string
  message?: string
  created_at: string
  updated_at: string
}

export default function DonationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { data: donations, loading, error, execute: fetchDonations } = useDonations<Donation[]>()

  // Memoize fetchDonations to avoid unnecessary re-renders
  const fetchDonationsCallback = useCallback(() => {
    fetchDonations()
  }, [fetchDonations])

  useEffect(() => {
    fetchDonationsCallback()
  }, [fetchDonationsCallback])

  const handleDeleteDonation = async (id: string) => {
    try {
      const result = await apiClient.deleteDonation(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Donation deleted successfully")
        fetchDonationsCallback() // Refresh the list
      }
    } catch (error) {
      toast.error("Failed to delete donation")
    }
  }

  const filteredDonations = donations?.filter(donation => {
    const matchesSearch = donation.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (donation.email && donation.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         donation.amount.toString().includes(searchTerm)
    return matchesSearch
  }) || []

  const totalAmount = donations?.reduce((sum, d) => sum + d.amount, 0) || 0
  const thisMonthAmount = donations?.filter(d => {
    const donationDate = new Date(d.created_at)
    const thisMonth = new Date()
    return donationDate.getMonth() === thisMonth.getMonth() && 
           donationDate.getFullYear() === thisMonth.getFullYear()
  }).reduce((sum, d) => sum + d.amount, 0) || 0

  const stats = [
    { 
      title: "Total Donations", 
      value: `${donations?.[0]?.currency || "NPR"} ${totalAmount.toLocaleString()}`, 
      icon: DollarSign 
    },
    { 
      title: "This Month", 
      value: `${donations?.[0]?.currency || "NPR"} ${thisMonthAmount.toLocaleString()}`, 
      icon: TrendingUp 
    },
    { 
      title: "Total Donors", 
      value: donations ? new Set(donations.map(d => d.donor_name)).size.toString() : "0", 
      icon: Users 
    },
    { 
      title: "Total Donations", 
      value: donations?.length?.toString() || "0", 
      icon: Receipt 
    },
  ]

  const getStatusColor = (donation: Donation) => {
    // For now, all donations are considered completed
    // In a real app, you'd have a status field
    return "bg-green-100 text-green-800"
  }

  const getPaymentMethodColor = (donation: Donation) => {
    // For now, default to a generic color
    // In a real app, you'd have a payment_method field
    return "bg-blue-100 text-blue-800"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load donations: {error}
          </AlertDescription>
        </Alert>
        <Button onClick={fetchDonations} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Donation Management</h1>
          <p className="text-muted-foreground">Track donations, generate receipts, and manage donors</p>
        </div>
        <Button>
          <Receipt className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Donations Management */}
      <Card>
        <CardHeader>
          <CardTitle>Donations List</CardTitle>
          <CardDescription>View and manage all donations received</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search donations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Donations Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donation ID</TableHead>
                  <TableHead>Donor Details</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loading skeletons
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[150px]" />
                          <Skeleton className="h-3 w-[120px]" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[80px] rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[120px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[80px] rounded-full" />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Skeleton className="h-8 w-[80px]" />
                          <Skeleton className="h-8 w-[60px]" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredDonations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchTerm 
                          ? "No donations match your search" 
                          : "No donations found"}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDonations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell className="font-medium">{donation.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{donation.donor_name}</div>
                          <div className="text-sm text-muted-foreground">{donation.email || "No email"}</div>
                          <div className="text-xs text-muted-foreground">{formatDate(donation.created_at)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {donation.currency} {donation.amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">ID: {donation.id}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentMethodColor(donation)}>Online</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{donation.message || "General Donation"}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(donation)}>Completed</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Receipt className="h-3 w-3 mr-1" />
                            Receipt
                          </Button>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteDonation(donation.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
