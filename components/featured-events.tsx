"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Clock } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useApi } from "@/hooks/use-api"
import { apiClient } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"

interface Event {
  id: string
  title: string
  description: string
  image_url: string
  event_date: string
  start_time: string
  end_time: string
  location: string
  category: string
  is_paid: boolean
  price: number | null
  max_participants: number | null
  is_active: boolean
}

export default function FeaturedEvents() {
  const [visibleEvents, setVisibleEvents] = useState(3)
  const { data: events, loading, error, execute: fetchEvents } = useApi(apiClient.getEvents)

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="relative h-48">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="pt-6">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !events) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Unable to load events</p>
        <Button onClick={fetchEvents} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  // Filter only active events and upcoming events
  const now = new Date()
  const eventList: Event[] = Array.isArray(events) ? events : []
  const activeEvents = eventList
    .filter((event: Event) => event.is_active && new Date(event.event_date) >= now)
    .sort((a: Event, b: Event) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
    .slice(0, visibleEvents)

  if (activeEvents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No upcoming events available</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeEvents.map((event: Event) => (
          <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image 
                src={event.image_url || "/placeholder.svg"} 
                alt={event.title} 
                fill 
                className="object-cover" 
              />
              <Badge className="absolute top-2 right-2 bg-orange-600">{event.category}</Badge>
            </div>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-2 text-gray-800">{event.title}</h3>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span>{formatDate(event.event_date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-2" />
                  <span>{event.start_time} - {event.end_time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  <span>{event.location}</span>
                </div>
                {event.is_paid && event.price && (
                  <div className="text-orange-600 font-medium">
                    Price: NPR {event.price}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                <Link href={`/events/register/${event.id}`}>Register Now</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {activeEvents.length < eventList.length && (
        <div className="text-center mt-8">
          <Button
            onClick={() => setVisibleEvents(prev => prev + 3)}
            variant="outline"
            className="bg-orange-600 text-white hover:bg-orange-700 border-orange-600"
          >
            Load More Events
          </Button>
        </div>
      )}
    </div>
  )
}
