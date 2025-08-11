"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Plus, Calendar, Users, DollarSign, MapPin } from "lucide-react"

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const events = [
    {
      id: "E001",
      title: "गीता जयन्ती महोत्सव",
      description: "Annual Gita Jayanti celebration with cultural programs",
      date: "2024-12-15",
      time: "10:00 AM",
      location: "Pashupatinath Temple, Kathmandu",
      category: "Religious",
      status: "Upcoming",
      registrations: 245,
      maxCapacity: 500,
      fee: "Free",
      organizer: "SDB Nepal",
    },
    {
      id: "E002",
      title: "योग और ध्यान कार्यशाला",
      description: "Yoga and meditation workshop for spiritual wellness",
      date: "2024-01-20",
      time: "6:00 AM",
      location: "Lumbini Garden, Pokhara",
      category: "Workshop",
      status: "Active",
      registrations: 89,
      maxCapacity: 100,
      fee: "NPR 500",
      organizer: "SDB Pokhara",
    },
    {
      id: "E003",
      title: "धार्मिक पुस्तक प्रदर्शनी",
      description: "Religious book exhibition and discussion",
      date: "2023-11-10",
      time: "2:00 PM",
      location: "Nepal Academy, Kathmandu",
      category: "Exhibition",
      status: "Completed",
      registrations: 156,
      maxCapacity: 200,
      fee: "NPR 100",
      organizer: "SDB Nepal",
    },
  ]

  const stats = [
    { title: "Total Events", value: "47", icon: Calendar },
    { title: "Active Events", value: "8", icon: Calendar },
    { title: "Total Registrations", value: "2,847", icon: Users },
    { title: "Revenue Generated", value: "NPR 1,24,500", icon: DollarSign },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Upcoming":
        return "bg-blue-100 text-blue-800"
      case "Completed":
        return "bg-gray-100 text-gray-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Event Management</h1>
          <p className="text-muted-foreground">Manage events, registrations, and schedules</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
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

      {/* Events Management */}
      <Card>
        <CardHeader>
          <CardTitle>Events List</CardTitle>
          <CardDescription>View and manage all organization events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
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
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Events Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Registrations</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground">{event.description}</div>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className="text-xs">
                            {event.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-2">{event.fee}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {event.date}
                        </div>
                        <div className="text-sm text-muted-foreground">{event.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {event.registrations}/{event.maxCapacity}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round((event.registrations / event.maxCapacity) * 100)}% filled
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Users className="h-3 w-3 mr-1" />
                          Participants
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
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
