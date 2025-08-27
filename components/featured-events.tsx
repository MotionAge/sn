"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface Event {
  id: string
  title_en: string
  description_en: string
  event_date: string
  location_en: string
  max_participants?: number
  registration_fee?: number
  image_url?: string
  is_featured: boolean
}

export default function FeaturedEvents() {
  const { language } = useTranslation()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events?featured=true&limit=3")

        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            setEvents(result.data)
          }
        }
      } catch (error) {
        console.warn("Error fetching featured events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Events
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Events
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our upcoming events and be part of the spiritual journey
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No upcoming events
            </h3>
            <p className="text-gray-500">
              Check back soon for new events
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gradient-to-r from-orange-100 to-red-100">
                  {event.image_url ? (
                    <img
                      src={event.image_url || "/placeholder.svg"}
                      alt={event.title_en}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Calendar className="h-16 w-16 text-orange-600" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{event.title_en}</CardTitle>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {event.description_en}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.location_en}</span>
                    </div>
                    {event.max_participants && (
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>
                          Max participants: 
                          {event.max_participants}
                        </span>
                      </div>
                    )}
                    {event.registration_fee && (
                      <div className="text-orange-600 font-semibold">
                        Registration fee: 
                        NPR {event.registration_fee}
                      </div>
                    )}
                  </div>
                  <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700">
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button variant="outline" asChild>
            <a href="/events">View All Events</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
