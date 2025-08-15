"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, DollarSign, Users, Clock, Search, Loader2 } from "lucide-react"
import PageVideo from "@/components/page-video"
import PageFAQ from "@/components/page-faq"

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
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("upcoming")

  useEffect(() => {
    fetchEvents()
  }, [searchTerm, categoryFilter, activeTab])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (categoryFilter !== "all") params.append("category", categoryFilter)
      if (activeTab !== "all") params.append("status", activeTab)

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "ongoing":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const upcomingEvents = events.filter((e) => e.status === "upcoming")
  const ongoingEvents = events.filter((e) => e.status === "ongoing")
  const completedEvents = events.filter((e) => e.status === "completed")

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-orange-600">Events</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Join us in our spiritual and cultural events. From religious ceremonies to educational workshops, we organize
          various events to strengthen our community bonds and preserve our heritage.
        </p>
      </section>

      {/* Featured Video */}
      <section className="mb-12">
        <PageVideo videoId="events-page-video" />
      </section>

      {/* Search and Filters */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search events..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="religious">Religious</SelectItem>
              <SelectItem value="cultural">Cultural</SelectItem>
              <SelectItem value="educational">Educational</SelectItem>
              <SelectItem value="social">Social Service</SelectItem>
              <SelectItem value="festival">Festival</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Events Tabs */}
      <section className="mb-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming ({upcomingEvents.length})</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing ({ongoingEvents.length})</TabsTrigger>
            <TabsTrigger value="completed">Past Events ({completedEvents.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-8">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                <span className="ml-2 text-gray-600">Loading events...</span>
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Upcoming Events</h3>
                <p className="text-gray-500">Check back soon for new events!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={event.image_url || "/placeholder.svg?height=300&width=500"}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 flex gap-2">
                        <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                        {event.is_featured && <Badge className="bg-orange-600">Featured</Badge>}
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                      <Badge variant="outline" className="w-fit capitalize">
                        {event.category}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>

                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2" />
                          <span>{formatDate(event.event_date)}</span>
                        </div>
                        {event.event_time && (
                          <div className="flex items-center">
                            <Clock size={16} className="mr-2" />
                            <span>{event.event_time}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-2" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Users size={16} className="mr-2" />
                            <span>{event.current_attendees} registered</span>
                            {event.max_attendees && <span className="text-gray-400">/{event.max_attendees}</span>}
                          </div>
                          {event.registration_fee > 0 ? (
                            <div className="flex items-center font-medium text-orange-600">
                              <DollarSign size={16} className="mr-1" />
                              {formatCurrency(event.registration_fee)}
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Free
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button asChild className="flex-1 bg-orange-600 hover:bg-orange-700">
                        <Link href={`/events/register/${event.id}`}>Register Now</Link>
                      </Button>
                      <Button asChild variant="outline" className="flex-1 bg-transparent">
                        <Link href={`/events/${event.id}`}>Learn More</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ongoing" className="mt-8">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                <span className="ml-2 text-gray-600">Loading events...</span>
              </div>
            ) : ongoingEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Ongoing Events</h3>
                <p className="text-gray-500">No events are currently in progress.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ongoingEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <Image
                        src={event.image_url || "/placeholder.svg?height=300&width=500"}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-green-600">Live Now</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-2" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Users size={16} className="mr-2" />
                          <span>{event.current_attendees} attending</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                        <Link href={`/events/${event.id}`}>Join Event</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-8">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                <span className="ml-2 text-gray-600">Loading events...</span>
              </div>
            ) : completedEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Past Events</h3>
                <p className="text-gray-500">Past events will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden opacity-90">
                    <div className="relative h-48">
                      <Image
                        src={event.image_url || "/placeholder.svg?height=300&width=500"}
                        alt={event.title}
                        fill
                        className="object-cover grayscale"
                      />
                      <Badge className="absolute top-2 right-2 bg-gray-600">Completed</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2" />
                          <span>{formatDate(event.event_date)}</span>
                        </div>
                        <div className="flex items-center">
                          <Users size={16} className="mr-2" />
                          <span>{event.current_attendees} attended</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full bg-transparent">
                        <Link href={`/events/${event.id}`}>View Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-orange-600">Frequently Asked Questions</h2>
        <PageFAQ pageId="events" />
      </section>
    </div>
  )
}
