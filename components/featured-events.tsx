"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock } from "lucide-react"

interface Event {
  id: string
  title: string
  description: string
  event_date: string
  event_time: string
  location: string
  category: string
  capacity: number
  registered_count: number
  featured_image?: string
  status: string
}

export default function FeaturedEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events?featured=true&limit=3")
        if (response.ok) {
          const data = await response.json()
          setEvents(data.data || [])
        }
      } catch (error) {
        console.error("Error fetching featured events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg" />
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No upcoming events at the moment.</p>
          <p className="text-sm text-gray-500 mt-2">Check back soon for new events!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="hover:shadow-lg transition-shadow">
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <Image
              src={event.featured_image || "/placeholder.svg?height=200&width=400&text=Event+Image"}
              alt={event.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-2 right-2">
              <Badge className="bg-orange-600 text-white">{event.category}</Badge>
            </div>
          </div>
          <CardHeader>
            <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-orange-600" />
                <span>{new Date(event.event_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-orange-600" />
                <span>{event.event_time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-orange-600" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-orange-600" />
                <span>
                  {event.registered_count} / {event.capacity} registered
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                <Link href={`/events/${event.id}`}>View Details</Link>
              </Button>
              <Button asChild size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700">
                <Link href={`/events/register/${event.id}`}>Register</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
