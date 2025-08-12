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
import { Search, Download, Plus, Calendar, Users, DollarSign, MapPin, AlertCircle } from "lucide-react"
import { useEvents } from "@/hooks/use-api"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

interface Event {
  id: string
  title: string
  description: string
  event_date: string
  start_time: string
  end_time: string
  location: string
  category: string
  is_paid: boolean
  price?: number
  max_participants?: number
  current_participants: number
  created_at: string
  updated_at: string
}

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { data, loading, error, execute: fetchEvents } = useEvents()
  const events: Event[] = (data as Event[]) || []

  // Memoize fetchEvents to avoid unnecessary re-renders
  const fetchEventsCallback = useCallback(() => {
    fetchEvents()
  }, [fetchEvents])

  useEffect(() => {
    fetchEventsCallback()
  }, [fetchEventsCallback])

  const handleDeleteEvent = async (id: string) => {
    try {
      const result = await apiClient.deleteEvent(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Event deleted successfully")
        fetchEventsCallback() // Refresh the list
      }
    } catch (error) {
      toast.error("Failed to delete event")
    }
  }

  const getEventStatus = (event: Event) => {
    const eventDate = new Date(event.event_date)
    const today = new Date()
    
    if (eventDate < today) {
      return "Completed"
    } else if (eventDate.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return "Upcoming"
    } else {
      return "Active"
    }
  }

  const filteredEvents = events?.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase())
    const eventStatus = getEventStatus(event)
    const matchesStatus = statusFilter === "all" || eventStatus.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  const stats = [
    { 
      title: "Total Events", 
      value: events?.length?.toString() || "0", 
      icon: Calendar 
    },
    { 
      title: "Active Events", 
      value: events?.filter(e => getEventStatus(e) === "Active").length?.toString() || "0", 
      icon: Calendar 
    },
    { 
      title: "Total Registrations", 
      value: events?.reduce((sum, e) => sum + e.current_participants, 0).toString() || "0", 
      icon: Users 
    },
    { 
      title: "Revenue Generated", 
      value: events?.reduce((sum, e) => sum + (e.is_paid ? (e.price || 0) * e.current_participants : 0), 0).toLocaleString() || "0", 
      icon: DollarSign 
    },
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load events: {error}
          </AlertDescription>
        </Alert>
        <Button onClick={fetchEvents} variant="outline">
          Retry
        </Button>
      </div>
    )
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
                {loading ? (
                  // Loading skeletons
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-3 w-[300px]" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[150px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[80px]" />
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
                ) : filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchTerm || statusFilter !== "all" 
                          ? "No events match your filters" 
                          : "No events found"}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => {
                    const eventStatus = getEventStatus(event)
                    return (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-muted-foreground">{event.description}</div>
                            <div className="flex items-center mt-1">
                              <Badge variant="outline" className="text-xs">
                                {event.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground ml-2">
                                {event.is_paid ? `NPR ${event.price}` : "Free"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(event.event_date)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatTime(event.start_time)} - {formatTime(event.end_time)}
                            </div>
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
                              {event.current_participants}/{event.max_participants || "∞"}
                            </div>
                            {event.max_participants && (
                              <div className="text-xs text-muted-foreground">
                                {Math.round((event.current_participants / event.max_participants) * 100)}% filled
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(eventStatus)}>{eventStatus}</Badge>
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
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteEvent(event.id)}
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
