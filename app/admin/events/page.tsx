"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
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
import { Search, Plus, Calendar, MapPin, Users, DollarSign, Eye, Edit, Trash2, Loader2 } from "lucide-react"

interface Event {
  id: number
  title: string
  description: string
  event_date: string
  event_time?: string
  location: string
  category: string
  registration_fee: number
  max_attendees?: number
  current_attendees: number
  image_url?: string
  contact_person?: string
  contact_phone?: string
  contact_email?: string
  status: string
  is_featured: boolean
  created_at: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)

  const stats = [
    { title: "Total Events", value: events.length.toString(), icon: Calendar },
    { title: "Upcoming", value: events.filter((e) => e.status === "upcoming").length.toString(), icon: Calendar },
    { title: "Completed", value: events.filter((e) => e.status === "completed").length.toString(), icon: Calendar },
    {
      title: "Total Attendees",
      value: events.reduce((sum, e) => sum + e.current_attendees, 0).toString(),
      icon: Users,
    },
  ]

  useEffect(() => {
    fetchEvents()
  }, [searchTerm, categoryFilter, statusFilter])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (categoryFilter !== "all") params.append("category", categoryFilter)
      if (statusFilter !== "all") params.append("status", statusFilter)

      const response = await fetch(`/api/events?${params}`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      } else {
        console.error("Failed to fetch events")
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (eventId: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      setDeleteLoading(eventId)
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setEvents(events.filter((e) => e.id !== eventId))
      } else {
        alert("Failed to delete event")
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      alert("Failed to delete event")
    } finally {
      setDeleteLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "ongoing":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Events Management</h1>
          <p className="text-muted-foreground">Manage events, registrations, and attendees</p>
        </div>
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Link>
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
          <CardTitle>Events</CardTitle>
          <CardDescription>Manage all events and their details</CardDescription>
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
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="religious">Religious</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
                <SelectItem value="social">Social</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading events...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No events found.</p>
              <Button asChild className="mt-4">
                <Link href="/admin/events/new">Create your first event</Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date & Location</TableHead>
                    <TableHead>Attendees</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                            <Image
                              src={event.image_url || "/placeholder.svg?height=48&width=48"}
                              alt={event.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-muted-foreground capitalize">{event.category}</div>
                            {event.is_featured && (
                              <Badge variant="secondary" className="text-xs">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(event.event_date)}
                          </div>
                          {event.event_time && <div className="text-xs text-muted-foreground">{event.event_time}</div>}
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.location}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{event.current_attendees}</span>
                          {event.max_attendees && <span className="text-muted-foreground">/{event.max_attendees}</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        {event.registration_fee > 0 ? (
                          <div className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />
                            {formatCurrency(event.registration_fee)}
                          </div>
                        ) : (
                          <Badge variant="outline">Free</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedEvent(event)}>
                                <Eye className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{selectedEvent?.title}</DialogTitle>
                                <DialogDescription>Event Details</DialogDescription>
                              </DialogHeader>
                              {selectedEvent && (
                                <div className="space-y-4">
                                  {selectedEvent.image_url && (
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                      <Image
                                        src={selectedEvent.image_url || "/placeholder.svg"}
                                        alt={selectedEvent.title}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <h4 className="font-medium mb-2">Description</h4>
                                    <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Date:</span> {formatDate(selectedEvent.event_date)}
                                    </div>
                                    <div>
                                      <span className="font-medium">Time:</span> {selectedEvent.event_time || "TBD"}
                                    </div>
                                    <div>
                                      <span className="font-medium">Location:</span> {selectedEvent.location}
                                    </div>
                                    <div>
                                      <span className="font-medium">Category:</span> {selectedEvent.category}
                                    </div>
                                    <div>
                                      <span className="font-medium">Fee:</span>{" "}
                                      {selectedEvent.registration_fee > 0
                                        ? formatCurrency(selectedEvent.registration_fee)
                                        : "Free"}
                                    </div>
                                    <div>
                                      <span className="font-medium">Attendees:</span> {selectedEvent.current_attendees}
                                      {selectedEvent.max_attendees ? `/${selectedEvent.max_attendees}` : ""}
                                    </div>
                                  </div>
                                  {selectedEvent.contact_person && (
                                    <div>
                                      <h4 className="font-medium mb-2">Contact Information</h4>
                                      <div className="text-sm space-y-1">
                                        <div>
                                          <span className="font-medium">Person:</span> {selectedEvent.contact_person}
                                        </div>
                                        {selectedEvent.contact_phone && (
                                          <div>
                                            <span className="font-medium">Phone:</span> {selectedEvent.contact_phone}
                                          </div>
                                        )}
                                        {selectedEvent.contact_email && (
                                          <div>
                                            <span className="font-medium">Email:</span> {selectedEvent.contact_email}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/admin/events/edit/${event.id}`}>
                              <Edit className="h-3 w-3" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(event.id)}
                            disabled={deleteLoading === event.id}
                          >
                            {deleteLoading === event.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
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
