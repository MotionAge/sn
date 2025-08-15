"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, DollarSign, TrendingUp, Users, Eye, Download, Loader2 } from "lucide-react"

interface Donation {
  id: number
  donor_name: string
  donor_email?: string
  donor_phone?: string
  amount: number
  currency: string
  payment_method: string
  transaction_id?: string
  purpose: string
  is_anonymous: boolean
  message?: string
  status: string
  created_at: string
}

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    totalAmount: 0,
  })

  useEffect(() => {
    fetchDonations()
  }, [searchTerm, statusFilter, methodFilter])

  const fetchDonations = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (methodFilter !== "all") params.append("method", methodFilter)

      const response = await fetch(`/api/donations?${params}`)
      if (response.ok) {
        const data = await response.json()
        setDonations(data.donations || [])
        setStats(data.stats || { total: 0, totalAmount: 0 })
      } else {
        console.error("Failed to fetch donations")
      }
    } catch (error) {
      console.error("Error fetching donations:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateDonationStatus = async (donationId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/donations/${donationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setDonations(donations.map((d) => (d.id === donationId ? { ...d, status: newStatus } : d)))
      } else {
        alert("Failed to update donation status")
      }
    } catch (error) {
      console.error("Error updating donation:", error)
      alert("Failed to update donation status")
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "esewa":
        return "bg-green-100 text-green-800"
      case "khalti":
        return "bg-purple-100 text-purple-800"
      case "bank":
        return "bg-blue-100 text-blue-800"
      case "cash":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredDonations = donations.filter(
    (donation) =>
      donation.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (donation.transaction_id && donation.transaction_id.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const statsCards = [
    {
      title: "Total Donations",
      value: stats.total.toString(),
      icon: Users,
      description: "All time donations",
    },
    {
      title: "Total Amount",
      value: formatCurrency(stats.totalAmount, "NPR"),
      icon: DollarSign,
      description: "Completed donations",
    },
    {
      title: "This Month",
      value: donations
        .filter((d) => {
          const donationDate = new Date(d.created_at)
          const now = new Date()
          return (
            donationDate.getMonth() === now.getMonth() &&
            donationDate.getFullYear() === now.getFullYear() &&
            d.status === "completed"
          )
        })
        .reduce((sum, d) => sum + d.amount, 0)
        .toLocaleString(),
      icon: TrendingUp,
      description: "Current month total",
    },
    {
      title: "Pending",
      value: donations.filter((d) => d.status === "pending").length.toString(),
      icon: Users,
      description: "Awaiting verification",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Donations Management</h1>
          <p className="text-muted-foreground">Track and manage all donations</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Donations Management */}
      <Card>
        <CardHeader>
          <CardTitle>Donations</CardTitle>
          <CardDescription>View and manage all donation records</CardDescription>
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
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="esewa">eSewa</SelectItem>
                <SelectItem value="khalti">Khalti</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading donations...</span>
            </div>
          ) : filteredDonations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No donations found.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDonations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{donation.is_anonymous ? "Anonymous" : donation.donor_name}</div>
                          {!donation.is_anonymous && donation.donor_email && (
                            <div className="text-sm text-muted-foreground">{donation.donor_email}</div>
                          )}
                          {!donation.is_anonymous && donation.donor_phone && (
                            <div className="text-xs text-muted-foreground">{donation.donor_phone}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{formatCurrency(donation.amount, donation.currency)}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getMethodColor(donation.payment_method)}>
                          {donation.payment_method.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="capitalize">{donation.purpose}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(donation.created_at)}</div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={donation.status}
                          onValueChange={(value) => updateDonationStatus(donation.id, value)}
                        >
                          <SelectTrigger className="w-[120px]">
                            <Badge className={getStatusColor(donation.status)}>{donation.status}</Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedDonation(donation)}>
                              <Eye className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Donation Details</DialogTitle>
                              <DialogDescription>Complete information about this donation</DialogDescription>
                            </DialogHeader>
                            {selectedDonation && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">Donor:</span>{" "}
                                    {selectedDonation.is_anonymous ? "Anonymous" : selectedDonation.donor_name}
                                  </div>
                                  <div>
                                    <span className="font-medium">Amount:</span>{" "}
                                    {formatCurrency(selectedDonation.amount, selectedDonation.currency)}
                                  </div>
                                  <div>
                                    <span className="font-medium">Method:</span>{" "}
                                    {selectedDonation.payment_method.toUpperCase()}
                                  </div>
                                  <div>
                                    <span className="font-medium">Purpose:</span> {selectedDonation.purpose}
                                  </div>
                                  <div>
                                    <span className="font-medium">Date:</span> {formatDate(selectedDonation.created_at)}
                                  </div>
                                  <div>
                                    <span className="font-medium">Status:</span>{" "}
                                    <Badge className={getStatusColor(selectedDonation.status)}>
                                      {selectedDonation.status}
                                    </Badge>
                                  </div>
                                  {selectedDonation.transaction_id && (
                                    <div className="col-span-2">
                                      <span className="font-medium">Transaction ID:</span>{" "}
                                      {selectedDonation.transaction_id}
                                    </div>
                                  )}
                                  {!selectedDonation.is_anonymous && selectedDonation.donor_email && (
                                    <div className="col-span-2">
                                      <span className="font-medium">Email:</span> {selectedDonation.donor_email}
                                    </div>
                                  )}
                                  {!selectedDonation.is_anonymous && selectedDonation.donor_phone && (
                                    <div className="col-span-2">
                                      <span className="font-medium">Phone:</span> {selectedDonation.donor_phone}
                                    </div>
                                  )}
                                </div>
                                {selectedDonation.message && (
                                  <div>
                                    <span className="font-medium">Message:</span>
                                    <p className="mt-1 text-sm text-muted-foreground">{selectedDonation.message}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
