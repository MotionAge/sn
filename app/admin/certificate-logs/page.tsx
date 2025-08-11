"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Award, Eye, FileText, Calendar } from "lucide-react"

export default function CertificateLogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const certificates = [
    {
      id: "CERT001",
      memberName: "राम बहादुर शर्मा",
      memberId: "M001",
      certificateType: "Membership Certificate",
      issueDate: "2024-01-15",
      validUntil: "Lifetime",
      status: "Active",
      downloadCount: 5,
      lastDownloaded: "2024-01-20",
      generatedBy: "Admin",
    },
    {
      id: "CERT002",
      memberName: "सीता देवी पौडेल",
      memberId: "M002",
      certificateType: "Event Participation",
      issueDate: "2024-01-10",
      validUntil: "N/A",
      status: "Active",
      downloadCount: 2,
      lastDownloaded: "2024-01-12",
      generatedBy: "System",
    },
    {
      id: "CERT003",
      memberName: "गीता राई",
      memberId: "M003",
      certificateType: "Course Completion",
      issueDate: "2024-01-08",
      validUntil: "2025-01-08",
      status: "Expired",
      downloadCount: 8,
      lastDownloaded: "2024-01-15",
      generatedBy: "Admin",
    },
    {
      id: "CERT004",
      memberName: "हरि प्रसाद गुरुङ",
      memberId: "M004",
      certificateType: "Volunteer Certificate",
      issueDate: "2024-01-05",
      validUntil: "2024-12-31",
      status: "Active",
      downloadCount: 1,
      lastDownloaded: "2024-01-06",
      generatedBy: "Admin",
    },
  ]

  const stats = [
    { title: "Total Certificates", value: "1,247", icon: Award },
    { title: "Active Certificates", value: "1,089", icon: FileText },
    { title: "This Month", value: "23", icon: Calendar },
    { title: "Total Downloads", value: "3,456", icon: Download },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Expired":
        return "bg-red-100 text-red-800"
      case "Revoked":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Membership Certificate":
        return "bg-blue-100 text-blue-800"
      case "Event Participation":
        return "bg-green-100 text-green-800"
      case "Course Completion":
        return "bg-purple-100 text-purple-800"
      case "Volunteer Certificate":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Certificate Logs</h1>
          <p className="text-muted-foreground">Track and manage all generated certificates</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Report
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

      {/* Certificate Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Certificate History</CardTitle>
          <CardDescription>View all generated certificates and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="membership">Membership</SelectItem>
                <SelectItem value="event">Event Participation</SelectItem>
                <SelectItem value="course">Course Completion</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Certificates Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Certificate Details</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Validity</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificates.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{cert.id}</div>
                        <div className="text-sm text-muted-foreground">Issued: {cert.issueDate}</div>
                        <div className="text-xs text-muted-foreground">By: {cert.generatedBy}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{cert.memberName}</div>
                        <div className="text-sm text-muted-foreground">ID: {cert.memberId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(cert.certificateType)}>{cert.certificateType}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">
                          {cert.validUntil === "Lifetime"
                            ? "Lifetime"
                            : cert.validUntil === "N/A"
                              ? "N/A"
                              : `Until ${cert.validUntil}`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{cert.downloadCount}</div>
                        <div className="text-xs text-muted-foreground">Last: {cert.lastDownloaded}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(cert.status)}>{cert.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Download
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
