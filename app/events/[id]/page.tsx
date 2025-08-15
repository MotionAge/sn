"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Clock, Phone, Mail, ArrowLeft, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

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
  registration_fee: number
  contact_person: string
  contact_phone: string
  contact_email: string
  featured_image?: string
  gallery_images?: string[]
  status: string
  registration_deadline: string
  created_at: string
}

export default function EventDetailPage() {
  const params = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await fetch(`/api/events/${params.id}`)

        if (!response.ok) {
          throw new Error("Event not found")
        }

        const data = await response.json()
        setEvent(data.data)
      } catch (err: any) {
        setError(err.message || "Failed to load event")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchEvent()
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error || "Event not found"}</AlertDescription>
        </Alert>
        <div className="mt-6">
          <Link href="/events">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const isRegistrationOpen = new Date() < new Date(event.registration_deadline)
  const spotsRemaining = event.capacity - event.registered_count

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/events">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Featured Image */}
          {event.featured_image && (
            <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
              <Image src={event.featured_image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
            </div>
          )}

          {/* Event Details */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">{event.title}</CardTitle>
                  <Badge className="bg-orange-600 text-white">{event.category}</Badge>
                </div>
                <Badge variant={event.status === "active" ? "default" : "secondary"}>{event.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: event.description }} />

              {/* Gallery */}
              {event.gallery_images && event.gallery_images.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">Event Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {event.gallery_images.map((image, index) => (
                      <div key={index} className="relative h-32 rounded-lg overflow-hidden">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Gallery image ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform cursor-pointer"
                          onClick={() => window.open(image, "_blank")}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Info */}
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-orange-600 mr-3" />
                <div>
                  <p className="font-medium">{new Date(event.event_date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Date</p>
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="h-5 w-5 text-orange-600 mr-3" />
                <div>
                  <p className="font-medium">{event.event_time}</p>
                  <p className="text-sm text-gray-600">Time</p>
                </div>
              </div>

              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-orange-600 mr-3" />
                <div>
                  <p className="font-medium">{event.location}</p>
                  <p className="text-sm text-gray-600">Location</p>
                </div>
              </div>

              <div className="flex items-center">
                <Users className="h-5 w-5 text-orange-600 mr-3" />
                <div>
                  <p className="font-medium">
                    {event.registered_count} / {event.capacity}
                  </p>
                  <p className="text-sm text-gray-600">Registered</p>
                </div>
              </div>

              {event.registration_fee > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-lg font-bold text-orange-600">₹{event.registration_fee}</p>
                  <p className="text-sm text-gray-600">Registration Fee</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Registration */}
          <Card>
            <CardHeader>
              <CardTitle>Registration</CardTitle>
            </CardHeader>
            <CardContent>
              {isRegistrationOpen && spotsRemaining > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">{spotsRemaining} spots remaining</p>
                  <p className="text-sm text-gray-600">
                    Registration deadline: {new Date(event.registration_deadline).toLocaleDateString()}
                  </p>
                  <Link href={`/events/register/${event.id}`}>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">Register Now</Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-red-600 font-medium">
                    {spotsRemaining <= 0 ? "Event is full" : "Registration closed"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{event.contact_person}</p>
                <p className="text-sm text-gray-600">Contact Person</p>
              </div>

              <div className="flex items-center">
                <Phone className="h-4 w-4 text-orange-600 mr-2" />
                <a href={`tel:${event.contact_phone}`} className="text-blue-600 hover:underline">
                  {event.contact_phone}
                </a>
              </div>

              <div className="flex items-center">
                <Mail className="h-4 w-4 text-orange-600 mr-2" />
                <a href={`mailto:${event.contact_email}`} className="text-blue-600 hover:underline">
                  {event.contact_email}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
