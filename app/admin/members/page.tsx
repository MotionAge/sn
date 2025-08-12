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
import { Search, Download, UserPlus, Award, Mail, Phone, AlertCircle } from "lucide-react"
import { useMembers } from "@/hooks/use-api"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

interface Member {
  id: string
  serial_number: string
  full_name: string
  email: string
  phone: string
  address: string
  date_of_birth: string
  membership_type: string
  start_date: string
  end_date?: string
  is_active: boolean
  referral_code?: string
  created_at: string
  updated_at: string
}

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { data, loading, error, execute: fetchMembers } = useMembers()
  const members: Member[] = (data as Member[]) || []

  // Memoize fetchMembers to avoid unnecessary re-renders
  const fetchMembersCallback = useCallback(() => {
    fetchMembers()
  }, [fetchMembers])

  useEffect(() => {
    fetchMembersCallback()
  }, [fetchMembersCallback])

  const handleDeleteMember = async (id: string) => {
    try {
      const result = await apiClient.deleteMember(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Member deleted successfully")
        fetchMembersCallback() // Refresh the list
      }
    } catch (error) {
      toast.error("Failed to delete member")
    }
  }

  const getMemberStatus = (member: Member) => {
    if (!member.is_active) {
      return "Inactive"
    }
    if (member.membership_type === "lifetime") {
      return "Active"
    }
    if (member.end_date) {
      const endDate = new Date(member.end_date)
      const today = new Date()
      if (endDate < today) {
        return "Expired"
      }
    }
    return "Active"
  }

  const filteredMembers = members?.filter(member => {
    const matchesSearch = member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.phone.includes(searchTerm) ||
                         member.serial_number.includes(searchTerm)
    const memberStatus = getMemberStatus(member)
    const matchesStatus = statusFilter === "all" || memberStatus.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  const stats = [
    { 
      title: "Total Members", 
      value: members?.length?.toString() || "0", 
      icon: UserPlus 
    },
    { 
      title: "Active Members", 
      value: members?.filter(m => getMemberStatus(m) === "Active").length?.toString() || "0", 
      icon: Award 
    },
    { 
      title: "New This Month", 
      value: members?.filter(m => {
        const joinDate = new Date(m.start_date)
        const thisMonth = new Date()
        return joinDate.getMonth() === thisMonth.getMonth() && 
               joinDate.getFullYear() === thisMonth.getFullYear()
      }).length?.toString() || "0", 
      icon: UserPlus 
    },
    { 
      title: "Expired", 
      value: members?.filter(m => getMemberStatus(m) === "Expired").length?.toString() || "0", 
      icon: Mail 
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Expired":
        return "bg-red-100 text-red-800"
      case "Inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
            Failed to load members: {error}
          </AlertDescription>
        </Alert>
        <Button onClick={fetchMembers} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Member Management</h1>
          <p className="text-muted-foreground">Manage organization members and their details</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
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

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Members List</CardTitle>
          <CardDescription>View and manage all organization members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Members Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
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
                          <Skeleton className="h-3 w-[100px]" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[120px]" />
                          <Skeleton className="h-4 w-[100px]" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[80px]" />
                          <Skeleton className="h-3 w-[100px]" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[80px] rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Skeleton className="h-8 w-[80px]" />
                          <Skeleton className="h-8 w-[60px]" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchTerm || statusFilter !== "all" 
                          ? "No members match your filters" 
                          : "No members found"}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => {
                    const memberStatus = getMemberStatus(member)
                    return (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.serial_number}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{member.full_name}</div>
                            <div className="text-sm text-muted-foreground">Joined: {formatDate(member.start_date)}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-1" />
                              {member.email}
                            </div>
                            <div className="flex items-center text-sm">
                              <Phone className="h-3 w-3 mr-1" />
                              {member.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{member.membership_type}</div>
                            <div className="text-sm text-muted-foreground">
                              {member.membership_type === "lifetime" 
                                ? "Lifetime" 
                                : `Expires: ${member.end_date ? formatDate(member.end_date) : "N/A"}`
                              }
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(memberStatus)}>{memberStatus}</Badge>
                        </TableCell>
                        <TableCell>{member.address}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Award className="h-3 w-3 mr-1" />
                              Certificate
                            </Button>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteMember(member.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
