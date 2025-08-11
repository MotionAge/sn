"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, DollarSign, TrendingUp, Users, Receipt } from "lucide-react"

export default function DonationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const donations = [
    {
      id: "D001",
      donorName: "अनिल कुमार श्रेष्ठ",
      email: "anil.shrestha@email.com",
      amount: 5000,
      currency: "NPR",
      paymentMethod: "eSewa",
      purpose: "Temple Construction",
      date: "2024-01-15",
      status: "Completed",
      transactionId: "ESW123456789",
      receiptGenerated: true,
    },
    {
      id: "D002",
      donorName: "सुनिता पौडेल",
      email: "sunita.poudel@email.com",
      amount: 2500,
      currency: "NPR",
      paymentMethod: "Khalti",
      purpose: "Education Fund",
      date: "2024-01-14",
      status: "Completed",
      transactionId: "KHT987654321",
      receiptGenerated: true,
    },
    {
      id: "D003",
      donorName: "राजेश गुरुङ",
      email: "rajesh.gurung@email.com",
      amount: 1000,
      currency: "NPR",
      paymentMethod: "Bank Transfer",
      purpose: "General Donation",
      date: "2024-01-13",
      status: "Pending",
      transactionId: "BT456789123",
      receiptGenerated: false,
    },
  ]

  const stats = [
    { title: "Total Donations", value: "NPR 2,47,500", icon: DollarSign },
    { title: "This Month", value: "NPR 45,000", icon: TrendingUp },
    { title: "Total Donors", value: "156", icon: Users },
    { title: "Pending", value: "NPR 8,500", icon: Receipt },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case "eSewa":
        return "bg-green-100 text-green-800"
      case "Khalti":
        return "bg-purple-100 text-purple-800"
      case "Bank Transfer":
        return "bg-blue-100 text-blue-800"
      case "Cash":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
                {donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-medium">{donation.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{donation.donorName}</div>
                        <div className="text-sm text-muted-foreground">{donation.email}</div>
                        <div className="text-xs text-muted-foreground">{donation.date}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {donation.currency} {donation.amount.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">ID: {donation.transactionId}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentMethodColor(donation.paymentMethod)}>{donation.paymentMethod}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{donation.purpose}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(donation.status)}>{donation.status}</Badge>
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
