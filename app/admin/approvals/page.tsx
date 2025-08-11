"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Clock, Eye, Users, DollarSign, Calendar } from "lucide-react"

export default function ApprovalsPage() {
  const [selectedTab, setSelectedTab] = useState("pending")
  const [isProcessing, setIsProcessing] = useState(false)

  // Mock data for pending approvals
  const pendingApprovals = {
    memberships: [
      {
        id: "M2024001",
        applicantName: "राम बहादुर श्रेष्ठ",
        email: "ram.shrestha@email.com",
        phone: "+977-9841234567",
        membershipType: "Lifetime",
        amount: 10000,
        paymentMethod: "eSewa",
        transactionId: "ESW123456789",
        appliedDate: "2024-01-15",
        documents: ["citizenship.pdf", "photo.jpg"],
        address: "Kathmandu-15, Nepal",
      },
      {
        id: "M2024002",
        applicantName: "सीता देवी पौडेल",
        email: "sita.poudel@email.com",
        phone: "+977-9851234567",
        membershipType: "Annual",
        amount: 2000,
        paymentMethod: "Khalti",
        transactionId: "KHT987654321",
        appliedDate: "2024-01-14",
        documents: ["citizenship.pdf", "photo.jpg"],
        address: "Pokhara-8, Nepal",
      },
    ],
    donations: [
      {
        id: "D2024001",
        donorName: "अनिल कुमार गुरुङ",
        email: "anil.gurung@email.com",
        phone: "+977-9861234567",
        amount: 5000,
        currency: "NPR",
        purpose: "Temple Construction",
        paymentMethod: "Bank Transfer",
        transactionId: "BT456789123",
        donationDate: "2024-01-13",
        receiptRequested: true,
      },
      {
        id: "D2024002",
        donorName: "सुनिता राई",
        email: "sunita.rai@email.com",
        phone: "+977-9871234567",
        amount: 3000,
        currency: "NPR",
        purpose: "Education Fund",
        paymentMethod: "eSewa",
        transactionId: "ESW789123456",
        donationDate: "2024-01-12",
        receiptRequested: true,
      },
    ],
    eventRegistrations: [
      {
        id: "E2024001",
        participantName: "गीता शर्मा",
        email: "geeta.sharma@email.com",
        phone: "+977-9881234567",
        eventTitle: "Sanskrit Workshop 2024",
        eventDate: "2024-02-15",
        registrationFee: 1500,
        paymentMethod: "Khalti",
        transactionId: "KHT456789123",
        registrationDate: "2024-01-10",
        specialRequests: "Vegetarian meals required",
      },
    ],
  }

  const stats = [
    { title: "Pending Memberships", value: pendingApprovals.memberships.length, icon: Users, color: "orange" },
    { title: "Pending Donations", value: pendingApprovals.donations.length, icon: DollarSign, color: "green" },
    { title: "Event Registrations", value: pendingApprovals.eventRegistrations.length, icon: Calendar, color: "blue" },
    {
      title: "Total Pending",
      value:
        pendingApprovals.memberships.length +
        pendingApprovals.donations.length +
        pendingApprovals.eventRegistrations.length,
      icon: Clock,
      color: "red",
    },
  ]

  const handleApproval = async (type: string, id: string, action: "approve" | "reject") => {
    setIsProcessing(true)
    try {
      // API call would go here
      console.log(`${action}ing ${type} with ID: ${id}`)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Show success message and refresh data
      alert(`${type} ${action}d successfully! Email notification sent.`)
    } catch (error) {
      console.error(`Error ${action}ing ${type}:`, error)
      alert(`Error ${action}ing ${type}. Please try again.`)
    } finally {
      setIsProcessing(false)
    }
  }

  const ApprovalActions = ({ type, id }: { type: string; id: string }) => (
    <div className="flex space-x-2">
      <Button
        size="sm"
        onClick={() => handleApproval(type, id, "approve")}
        disabled={isProcessing}
        className="bg-green-600 hover:bg-green-700"
      >
        <CheckCircle className="h-3 w-3 mr-1" />
        Approve
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => handleApproval(type, id, "reject")}
        disabled={isProcessing}
      >
        <XCircle className="h-3 w-3 mr-1" />
        Reject
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Approval Center</h1>
          <p className="text-muted-foreground">Review and approve pending applications and payments</p>
        </div>
        <Badge variant="outline" className="text-orange-600 border-orange-600">
          <Clock className="h-4 w-4 mr-1" />
          {stats[3].value} Pending
        </Badge>
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

      {/* Alert for pending items */}
      {stats[3].value > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <Clock className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            You have {stats[3].value} pending approval(s) that require your attention. Please review and take action.
          </AlertDescription>
        </Alert>
      )}

      {/* Approval Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          {/* Membership Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Membership Applications ({pendingApprovals.memberships.length})
              </CardTitle>
              <CardDescription>Review and approve new membership applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application ID</TableHead>
                    <TableHead>Applicant Details</TableHead>
                    <TableHead>Membership Type</TableHead>
                    <TableHead>Payment Details</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingApprovals.memberships.map((membership) => (
                    <TableRow key={membership.id}>
                      <TableCell className="font-medium">{membership.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{membership.applicantName}</div>
                          <div className="text-sm text-muted-foreground">{membership.email}</div>
                          <div className="text-sm text-muted-foreground">{membership.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{membership.membershipType}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">NPR {membership.amount.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">{membership.paymentMethod}</div>
                          <div className="text-xs text-muted-foreground">ID: {membership.transactionId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{membership.appliedDate}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Membership Application Details</DialogTitle>
                                <DialogDescription>Review application information</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium">Personal Information</h4>
                                    <p>Name: {membership.applicantName}</p>
                                    <p>Email: {membership.email}</p>
                                    <p>Phone: {membership.phone}</p>
                                    <p>Address: {membership.address}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Membership Details</h4>
                                    <p>Type: {membership.membershipType}</p>
                                    <p>Amount: NPR {membership.amount.toLocaleString()}</p>
                                    <p>Payment: {membership.paymentMethod}</p>
                                    <p>Transaction: {membership.transactionId}</p>
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <ApprovalActions type="membership" id={membership.id} />
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <ApprovalActions type="membership" id={membership.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Donation Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Donation Approvals ({pendingApprovals.donations.length})
              </CardTitle>
              <CardDescription>Review and approve donation receipts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donation ID</TableHead>
                    <TableHead>Donor Details</TableHead>
                    <TableHead>Amount & Purpose</TableHead>
                    <TableHead>Payment Details</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingApprovals.donations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell className="font-medium">{donation.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{donation.donorName}</div>
                          <div className="text-sm text-muted-foreground">{donation.email}</div>
                          <div className="text-sm text-muted-foreground">{donation.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {donation.currency} {donation.amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">{donation.purpose}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{donation.paymentMethod}</div>
                          <div className="text-xs text-muted-foreground">ID: {donation.transactionId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{donation.donationDate}</TableCell>
                      <TableCell>
                        <ApprovalActions type="donation" id={donation.id} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Event Registration Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Event Registrations ({pendingApprovals.eventRegistrations.length})
              </CardTitle>
              <CardDescription>Review and approve event registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Registration ID</TableHead>
                    <TableHead>Participant Details</TableHead>
                    <TableHead>Event Details</TableHead>
                    <TableHead>Payment Details</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingApprovals.eventRegistrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell className="font-medium">{registration.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{registration.participantName}</div>
                          <div className="text-sm text-muted-foreground">{registration.email}</div>
                          <div className="text-sm text-muted-foreground">{registration.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{registration.eventTitle}</div>
                          <div className="text-sm text-muted-foreground">Date: {registration.eventDate}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">NPR {registration.registrationFee.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">{registration.paymentMethod}</div>
                          <div className="text-xs text-muted-foreground">ID: {registration.transactionId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{registration.registrationDate}</TableCell>
                      <TableCell>
                        <ApprovalActions type="event-registration" id={registration.id} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Items</CardTitle>
              <CardDescription>Recently approved applications and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No approved items to display.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Items</CardTitle>
              <CardDescription>Recently rejected applications and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No rejected items to display.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
