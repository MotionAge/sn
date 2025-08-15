"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Users, DollarSign, Calendar, CheckCircle, XCircle, Clock, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PendingMember {
  member_id: string
  full_name: string
  email: string
  phone: string
  address: string
  membership_type: string
  payment_amount: number
  payment_method: string
  transaction_id: string
  join_date: string
  created_at: string
}

interface PendingDonation {
  donation_id: string
  donor_name: string
  donor_email: string
  donor_phone: string
  amount: number
  currency: string
  purpose: string
  payment_method: string
  transaction_id: string
  donation_date: string
  created_at: string
}

interface PendingRegistration {
  registration_id: string
  event_id: string
  participant_name: string
  participant_email: string
  participant_phone: string
  registration_fee: number
  payment_method: string
  transaction_id: string
  registration_date: string
  special_requests?: string
  events: {
    title: string
    title_nepali?: string
  }
  created_at: string
}

export default function ApprovalsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [pendingMembers, setPendingMembers] = useState<PendingMember[]>([])
  const [pendingDonations, setPendingDonations] = useState<PendingDonation[]>([])
  const [pendingRegistrations, setPendingRegistrations] = useState<PendingRegistration[]>([])
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchPendingApprovals()
  }, [])

  const fetchPendingApprovals = async () => {
    try {
      const response = await fetch("/api/approvals")
      if (!response.ok) throw new Error("Failed to fetch approvals")

      const data = await response.json()
      setPendingMembers(data.members || [])
      setPendingDonations(data.donations || [])
      setPendingRegistrations(data.registrations || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch pending approvals",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (type: string, id: string, action: "approve" | "reject") => {
    setActionLoading(true)
    try {
      const response = await fetch("/api/approvals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          id,
          action,
          reason: action === "reject" ? rejectionReason : null,
        }),
      })

      if (!response.ok) throw new Error("Failed to process approval")

      const result = await response.json()

      toast({
        title: "Success",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} ${action}d successfully`,
      })

      // Refresh data
      fetchPendingApprovals()
      setSelectedItem(null)
      setRejectionReason("")
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} ${type}`,
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const stats = [
    {
      title: "Pending Members",
      value: pendingMembers.length.toString(),
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Pending Donations",
      value: pendingDonations.length.toString(),
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Pending Registrations",
      value: pendingRegistrations.length.toString(),
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      title: "Total Pending",
      value: (pendingMembers.length + pendingDonations.length + pendingRegistrations.length).toString(),
      icon: Clock,
      color: "text-orange-600",
    },
  ]

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Approval Center</h1>
          <p className="text-muted-foreground">Review and approve pending applications, donations, and registrations</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Approval Tabs */}
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members">Members ({pendingMembers.length})</TabsTrigger>
          <TabsTrigger value="donations">Donations ({pendingDonations.length})</TabsTrigger>
          <TabsTrigger value="registrations">Registrations ({pendingRegistrations.length})</TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Pending Membership Applications</CardTitle>
              <CardDescription>Review and approve new membership applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member Details</TableHead>
                      <TableHead>Membership Type</TableHead>
                      <TableHead>Payment Info</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingMembers.map((member) => (
                      <TableRow key={member.member_id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{member.full_name}</div>
                            <div className="text-sm text-muted-foreground">{member.email}</div>
                            <div className="text-sm text-muted-foreground">{member.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {member.membership_type === "lifetime" ? "Lifetime" : "Annual"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">NPR {member.payment_amount.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">{member.payment_method}</div>
                            <div className="text-xs text-muted-foreground">{member.transaction_id}</div>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(member.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedItem(member)}>
                                  <Eye className="h-3 w-3 mr-1" />
                                  Review
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Review Membership Application</DialogTitle>
                                  <DialogDescription>
                                    Review the details and approve or reject this membership application
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedItem && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">Full Name</Label>
                                        <p className="text-sm">{selectedItem.full_name}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Email</Label>
                                        <p className="text-sm">{selectedItem.email}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Phone</Label>
                                        <p className="text-sm">{selectedItem.phone}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Membership Type</Label>
                                        <p className="text-sm">{selectedItem.membership_type}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Payment Amount</Label>
                                        <p className="text-sm">NPR {selectedItem.payment_amount?.toLocaleString()}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Payment Method</Label>
                                        <p className="text-sm">{selectedItem.payment_method}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Address</Label>
                                      <p className="text-sm">{selectedItem.address}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Transaction ID</Label>
                                      <p className="text-sm font-mono">{selectedItem.transaction_id}</p>
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="rejectionReason">Rejection Reason (if rejecting)</Label>
                                      <Textarea
                                        id="rejectionReason"
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder="Enter reason for rejection..."
                                        rows={3}
                                      />
                                    </div>

                                    <div className="flex justify-end space-x-2">
                                      <Button
                                        variant="outline"
                                        onClick={() => handleApproval("member", selectedItem.member_id, "reject")}
                                        disabled={actionLoading}
                                      >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject
                                      </Button>
                                      <Button
                                        onClick={() => handleApproval("member", selectedItem.member_id, "approve")}
                                        disabled={actionLoading}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        {actionLoading ? "Processing..." : "Approve"}
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {pendingMembers.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No pending membership applications</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Donations Tab */}
        <TabsContent value="donations">
          <Card>
            <CardHeader>
              <CardTitle>Pending Donation Approvals</CardTitle>
              <CardDescription>Review and approve donation payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor Details</TableHead>
                      <TableHead>Amount & Purpose</TableHead>
                      <TableHead>Payment Info</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingDonations.map((donation) => (
                      <TableRow key={donation.donation_id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{donation.donor_name}</div>
                            <div className="text-sm text-muted-foreground">{donation.donor_email}</div>
                            <div className="text-sm text-muted-foreground">{donation.donor_phone}</div>
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
                            <div className="text-sm">{donation.payment_method}</div>
                            <div className="text-xs text-muted-foreground font-mono">{donation.transaction_id}</div>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(donation.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedItem(donation)}>
                                  <Eye className="h-3 w-3 mr-1" />
                                  Review
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Review Donation</DialogTitle>
                                  <DialogDescription>
                                    Review the donation details and approve or reject
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedItem && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">Donor Name</Label>
                                        <p className="text-sm">{selectedItem.donor_name}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Email</Label>
                                        <p className="text-sm">{selectedItem.donor_email}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Phone</Label>
                                        <p className="text-sm">{selectedItem.donor_phone}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Amount</Label>
                                        <p className="text-sm">
                                          {selectedItem.currency} {selectedItem.amount?.toLocaleString()}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Purpose</Label>
                                        <p className="text-sm">{selectedItem.purpose}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Payment Method</Label>
                                        <p className="text-sm">{selectedItem.payment_method}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Transaction ID</Label>
                                      <p className="text-sm font-mono">{selectedItem.transaction_id}</p>
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="rejectionReason">Rejection Reason (if rejecting)</Label>
                                      <Textarea
                                        id="rejectionReason"
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder="Enter reason for rejection..."
                                        rows={3}
                                      />
                                    </div>

                                    <div className="flex justify-end space-x-2">
                                      <Button
                                        variant="outline"
                                        onClick={() => handleApproval("donation", selectedItem.donation_id, "reject")}
                                        disabled={actionLoading}
                                      >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject
                                      </Button>
                                      <Button
                                        onClick={() => handleApproval("donation", selectedItem.donation_id, "approve")}
                                        disabled={actionLoading}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        {actionLoading ? "Processing..." : "Approve"}
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {pendingDonations.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No pending donations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Registrations Tab */}
        <TabsContent value="registrations">
          <Card>
            <CardHeader>
              <CardTitle>Pending Event Registrations</CardTitle>
              <CardDescription>Review and approve event registration payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Participant Details</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Payment Info</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRegistrations.map((registration) => (
                      <TableRow key={registration.registration_id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{registration.participant_name}</div>
                            <div className="text-sm text-muted-foreground">{registration.participant_email}</div>
                            <div className="text-sm text-muted-foreground">{registration.participant_phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{registration.events.title}</div>
                            {registration.events.title_nepali && (
                              <div className="text-sm text-muted-foreground">{registration.events.title_nepali}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">NPR {registration.registration_fee.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">{registration.payment_method}</div>
                            <div className="text-xs text-muted-foreground font-mono">{registration.transaction_id}</div>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(registration.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedItem(registration)}>
                                  <Eye className="h-3 w-3 mr-1" />
                                  Review
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Review Event Registration</DialogTitle>
                                  <DialogDescription>
                                    Review the registration details and approve or reject
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedItem && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">Participant Name</Label>
                                        <p className="text-sm">{selectedItem.participant_name}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Email</Label>
                                        <p className="text-sm">{selectedItem.participant_email}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Phone</Label>
                                        <p className="text-sm">{selectedItem.participant_phone}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Registration Fee</Label>
                                        <p className="text-sm">NPR {selectedItem.registration_fee?.toLocaleString()}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Payment Method</Label>
                                        <p className="text-sm">{selectedItem.payment_method}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Event</Label>
                                        <p className="text-sm">{selectedItem.events?.title}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Transaction ID</Label>
                                      <p className="text-sm font-mono">{selectedItem.transaction_id}</p>
                                    </div>
                                    {selectedItem.special_requests && (
                                      <div>
                                        <Label className="text-sm font-medium">Special Requests</Label>
                                        <p className="text-sm">{selectedItem.special_requests}</p>
                                      </div>
                                    )}

                                    <div className="space-y-2">
                                      <Label htmlFor="rejectionReason">Rejection Reason (if rejecting)</Label>
                                      <Textarea
                                        id="rejectionReason"
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder="Enter reason for rejection..."
                                        rows={3}
                                      />
                                    </div>

                                    <div className="flex justify-end space-x-2">
                                      <Button
                                        variant="outline"
                                        onClick={() =>
                                          handleApproval("registration", selectedItem.registration_id, "reject")
                                        }
                                        disabled={actionLoading}
                                      >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          handleApproval("registration", selectedItem.registration_id, "approve")
                                        }
                                        disabled={actionLoading}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        {actionLoading ? "Processing..." : "Approve"}
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {pendingRegistrations.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No pending event registrations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
