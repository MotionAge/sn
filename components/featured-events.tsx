"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Clock } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Mock data - would come from CMS in production
const events = [
  {
    id: 1,
    title: "Gurukul Admission 2024",
    description: "Join our traditional Gurukul education system for holistic development.",
    image: "/placeholder.svg?height=300&width=500",
    date: "2024-08-15",
    time: "10:00 AM - 4:00 PM",
    location: "Kathmandu, Nepal",
    category: "Education",
    url: "/events/gurukul-admission",
  },
  {
    id: 2,
    title: "Pilgrimage to Sacred Sites",
    description: "Explore the sacred sites of Nepal with our guided pilgrimage tour.",
    image: "/placeholder.svg?height=300&width=500",
    date: "2024-09-10",
    time: "6:00 AM - 6:00 PM",
    location: "Various Locations",
    category: "Pilgrimage",
    url: "/events/pilgrimage",
  },
  {
    id: 3,
    title: "Sanskrit Learning Workshop",
    description: "Learn the basics of Sanskrit language in this intensive workshop.",
    image: "/placeholder.svg?height=300&width=500",
    date: "2024-07-25",
    time: "9:00 AM - 12:00 PM",
    location: "Online",
    category: "Education",
    url: "/events/sanskrit-workshop",
  },
  {
    id: 4,
    title: "Vedic Mathematics Training",
    description: "Discover the ancient system of Vedic Mathematics and its applications.",
    image: "/placeholder.svg?height=300&width=500",
    date: "2024-08-05",
    time: "2:00 PM - 5:00 PM",
    location: "Pokhara, Nepal",
    category: "Training",
    url: "/events/vedic-mathematics",
  },
]

export default function FeaturedEvents() {
  const [visibleEvents, setVisibleEvents] = useState(3)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.slice(0, visibleEvents).map((event) => (
          <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
              <Badge className="absolute top-2 right-2 bg-orange-600">{event.category}</Badge>
            </div>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-2 text-gray-800">{event.title}</h3>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-2" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  <span>{event.location}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                <Link href={event.url}>Register Now</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {visibleEvents < events.length && (
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => setVisibleEvents(events.length)}
            className="border-orange-600 text-orange-600 hover:bg-orange-50"
          >
            View All Events
          </Button>
        </div>
      )}
    </div>
  )
}
