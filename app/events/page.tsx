import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Clock, Users, DollarSign } from "lucide-react"
import PageVideo from "@/components/page-video"
import PageFAQ from "@/components/page-faq"

export default function EventsPage() {
  const eventCategories = [
    {
      id: "gurukul",
      name: "Gurukul Admission",
      description: "Traditional education system combining spiritual and academic learning",
      events: [
        {
          id: 1,
          title: "Gurukul Short Term Course (3 months)",
          description: "Intensive course covering basic Sanskrit, Vedic mathematics, and moral values.",
          image: "/placeholder.svg?height=300&width=500",
          date: "2024-08-15",
          time: "9:00 AM - 12:00 PM",
          location: "SDB Gurukul Campus, Kathmandu",
          price: 15000,
          currency: "NPR",
          maxParticipants: 30,
          currentParticipants: 18,
          isPaid: true,
          registrationUrl: "/events/register/gurukul-short-term",
        },
        {
          id: 2,
          title: "Gurukul Long Term Course (1 year)",
          description: "Comprehensive program covering advanced Sanskrit, philosophy, and traditional arts.",
          image: "/placeholder.svg?height=300&width=500",
          date: "2024-09-01",
          time: "8:00 AM - 4:00 PM",
          location: "SDB Gurukul Campus, Kathmandu",
          price: 50000,
          currency: "NPR",
          maxParticipants: 20,
          currentParticipants: 12,
          isPaid: true,
          registrationUrl: "/events/register/gurukul-long-term",
        },
      ],
    },
    {
      id: "pilgrimage",
      name: "Pilgrimage",
      description: "Spiritual journeys to sacred sites and temples",
      events: [
        {
          id: 3,
          title: "Pashupatinath & Muktinath Yatra",
          description: "Sacred pilgrimage to two of Nepal's most important Hindu temples.",
          image: "/placeholder.svg?height=300&width=500",
          date: "2024-10-15",
          time: "5:00 AM - 8:00 PM",
          location: "Kathmandu to Muktinath",
          price: 8000,
          currency: "NPR",
          maxParticipants: 50,
          currentParticipants: 35,
          isPaid: true,
          registrationUrl: "/events/register/nepal-yatra",
        },
        {
          id: 4,
          title: "Char Dham Yatra (India)",
          description: "Holy pilgrimage to the four sacred sites in India.",
          image: "/placeholder.svg?height=300&width=500",
          date: "2024-11-01",
          time: "Full Day (10 days)",
          location: "India (Badrinath, Kedarnath, Gangotri, Yamunotri)",
          price: 45000,
          currency: "NPR",
          maxParticipants: 25,
          currentParticipants: 20,
          isPaid: true,
          registrationUrl: "/events/register/char-dham-yatra",
        },
      ],
    },
    {
      id: "sanskrit",
      name: "Sanskrit Learning",
      description: "Online and offline Sanskrit language courses",
      events: [
        {
          id: 5,
          title: "Beginner Sanskrit Online Course",
          description: "Learn basic Sanskrit alphabets, pronunciation, and simple verses.",
          image: "/placeholder.svg?height=300&width=500",
          date: "2024-07-20",
          time: "6:00 PM - 8:00 PM",
          location: "Online (Zoom)",
          price: 0,
          currency: "NPR",
          maxParticipants: 100,
          currentParticipants: 65,
          isPaid: false,
          registrationUrl: "/events/register/sanskrit-beginner",
        },
        {
          id: 6,
          title: "Advanced Sanskrit Workshop",
          description: "Deep dive into Sanskrit grammar, literature, and philosophical texts.",
          image: "/placeholder.svg?height=300&width=500",
          date: "2024-08-10",
          time: "10:00 AM - 4:00 PM",
          location: "SDB Learning Center, Pokhara",
          price: 5000,
          currency: "NPR",
          maxParticipants: 25,
          currentParticipants: 15,
          isPaid: true,
          registrationUrl: "/events/register/sanskrit-advanced",
        },
      ],
    },
    {
      id: "training",
      name: "Training & Education",
      description: "Various educational and skill development programs",
      events: [
        {
          id: 7,
          title: "Vedic Mathematics Workshop",
          description: "Learn ancient calculation techniques for modern applications.",
          image: "/placeholder.svg?height=300&width=500",
          date: "2024-07-25",
          time: "2:00 PM - 5:00 PM",
          location: "Online (Google Meet)",
          price: 0,
          currency: "NPR",
          maxParticipants: 75,
          currentParticipants: 45,
          isPaid: false,
          registrationUrl: "/events/register/vedic-mathematics",
        },
        {
          id: 8,
          title: "Yoga & Meditation Retreat",
          description: "3-day intensive retreat for physical and spiritual wellness.",
          image: "/placeholder.svg?height=300&width=500",
          date: "2024-09-20",
          time: "6:00 AM - 6:00 PM",
          location: "Nagarkot Retreat Center",
          price: 12000,
          currency: "NPR",
          maxParticipants: 30,
          currentParticipants: 22,
          isPaid: true,
          registrationUrl: "/events/register/yoga-retreat",
        },
      ],
    },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calculateAvailableSpots = (max: number, current: number) => {
    return max - current
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-orange-600">Event Enrollment</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Join our diverse range of educational, spiritual, and cultural programs designed to enrich your understanding
          of Sanatan Dharma and personal growth.
        </p>
      </section>

      {/* Featured Video */}
      <section className="mb-12">
        <PageVideo videoId="events-page-video" />
      </section>

      {/* Event Categories */}
      <section className="mb-12">
        <Tabs defaultValue="gurukul" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {eventCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {eventCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 text-orange-600">{category.name}</h2>
                <p className="text-gray-600">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.events.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                      <div className="absolute top-2 right-2 flex gap-2">
                        {event.isPaid ? (
                          <Badge className="bg-orange-600">
                            {event.currency} {event.price.toLocaleString()}
                          </Badge>
                        ) : (
                          <Badge className="bg-green-600">Free</Badge>
                        )}
                      </div>
                    </div>

                    <CardHeader>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                    </CardHeader>

                    <CardContent>
                      <p className="text-gray-600 mb-4">{event.description}</p>

                      <div className="space-y-2 text-sm text-gray-500 mb-4">
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
                        <div className="flex items-center">
                          <Users size={16} className="mr-2" />
                          <span>
                            {calculateAvailableSpots(event.maxParticipants, event.currentParticipants)} spots available
                            ({event.currentParticipants}/{event.maxParticipants} registered)
                          </span>
                        </div>
                        {event.isPaid && (
                          <div className="flex items-center">
                            <DollarSign size={16} className="mr-2" />
                            <span>
                              {event.currency} {event.price.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                        <Link href={event.registrationUrl}>Register Now</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
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
