import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, DollarSign, Users, Clock } from "lucide-react"
import PageVideo from "@/components/page-video"
import PageFAQ from "@/components/page-faq"

export default function ProjectsPage() {
  const ongoingProjects = [
    {
      id: 1,
      title: "Gurukul Expansion Project",
      description:
        "Expanding our traditional education facilities to accommodate more students and provide better learning environments.",
      image: "/placeholder.svg?height=300&width=500",
      goalAmount: 500000,
      raisedAmount: 325000,
      currency: "NPR",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      location: "Kathmandu, Nepal",
      beneficiaries: 200,
      status: "ongoing",
    },
    {
      id: 2,
      title: "Sanskrit Library Development",
      description: "Building a comprehensive digital and physical library of Sanskrit texts and resources.",
      image: "/placeholder.svg?height=300&width=500",
      goalAmount: 300000,
      raisedAmount: 150000,
      currency: "NPR",
      startDate: "2024-02-01",
      endDate: "2024-10-31",
      location: "Multiple Locations",
      beneficiaries: 500,
      status: "ongoing",
    },
    {
      id: 3,
      title: "Community Outreach Program",
      description: "Supporting underprivileged communities with education, healthcare, and spiritual guidance.",
      image: "/placeholder.svg?height=300&width=500",
      goalAmount: 200000,
      raisedAmount: 180000,
      currency: "NPR",
      startDate: "2024-03-01",
      endDate: "2024-09-30",
      location: "Rural Nepal",
      beneficiaries: 1000,
      status: "ongoing",
    },
  ]

  const completedProjects = [
    {
      id: 4,
      title: "Vedic Mathematics Training Program",
      description: "Successfully trained 500+ students in ancient mathematical techniques.",
      image: "/placeholder.svg?height=300&width=500",
      totalAmount: 150000,
      currency: "NPR",
      completedDate: "2023-12-31",
      location: "Online & Offline",
      beneficiaries: 500,
      status: "completed",
    },
    {
      id: 5,
      title: "Temple Restoration Initiative",
      description: "Restored 5 ancient temples in the Kathmandu Valley.",
      image: "/placeholder.svg?height=300&width=500",
      totalAmount: 800000,
      currency: "NPR",
      completedDate: "2023-11-30",
      location: "Kathmandu Valley",
      beneficiaries: 10000,
      status: "completed",
    },
  ]

  const upcomingEvents = [
    {
      id: 6,
      title: "Annual Dharma Conference 2024",
      description: "Bringing together scholars and practitioners from around the world.",
      image: "/placeholder.svg?height=300&width=500",
      date: "2024-12-15",
      time: "9:00 AM - 6:00 PM",
      location: "Kathmandu Convention Center",
      expectedAttendees: 1000,
      registrationFee: 2000,
      currency: "NPR",
    },
    {
      id: 7,
      title: "Youth Sanskrit Competition",
      description: "Encouraging young people to learn and appreciate Sanskrit language.",
      image: "/placeholder.svg?height=300&width=500",
      date: "2024-11-20",
      time: "10:00 AM - 4:00 PM",
      location: "Various Schools",
      expectedAttendees: 500,
      registrationFee: 0,
      currency: "NPR",
    },
  ]

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const calculateProgress = (raised: number, goal: number) => {
    return Math.min(Math.round((raised / goal) * 100), 100)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-orange-600">Karma (Projects)</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our projects embody the principle of Karma - selfless action for the betterment of society. Through education,
          cultural preservation, and community service, we work to create positive change.
        </p>
      </section>

      {/* Featured Video */}
      {/* <section className="mb-12">
        <PageVideo videoId="projects-page-video" />
      </section> */}

      {/* Annual Calendar CTA */}
      <section className="mb-12">
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-orange-600">Annual Calendar 2024</h2>
            <p className="text-gray-700 mb-6">
              View our complete annual calendar with all planned events, projects, and important dates.
            </p>
            <Button className="bg-orange-600 hover:bg-orange-700">Download Annual Calendar</Button>
          </CardContent>
        </Card>
      </section>

      {/* Projects Tabs */}
      <section className="mb-12">
        <Tabs defaultValue="ongoing" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ongoing">Ongoing Projects</TabsTrigger>
            <TabsTrigger value="completed">Completed Projects</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          </TabsList>

          {/* Ongoing Projects */}
          <TabsContent value="ongoing" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ongoingProjects.map((project) => {
                const progress = calculateProgress(project.raisedAmount, project.goalAmount)
                return (
                  <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-green-600">Ongoing</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{project.description}</p>

                      <div className="space-y-2 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-2" />
                          <span>{project.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Users size={16} className="mr-2" />
                          <span>{project.beneficiaries} beneficiaries</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2" />
                          <span>
                            {formatDate(project.startDate)} - {formatDate(project.endDate)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">
                            {formatCurrency(project.raisedAmount, project.currency)} raised
                          </span>
                          <span className="text-gray-500">
                            of {formatCurrency(project.goalAmount, project.currency)}
                          </span>
                        </div>
                        <Progress value={progress} className="h-2 bg-gray-200" />
                        <div className="text-right text-sm text-gray-500">{progress}% complete</div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button asChild className="flex-1 bg-orange-600 hover:bg-orange-700">
                        <Link href={`/donate?project=${project.id}`}>Donate</Link>
                      </Button>
                      <Button asChild variant="outline" className="flex-1 bg-transparent">
                        <Link href={`/projects/${project.id}`}>Learn More</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Completed Projects */}
          <TabsContent value="completed" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-blue-600">Completed</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{project.description}</p>

                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-2" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users size={16} className="mr-2" />
                        <span>{project.beneficiaries} beneficiaries</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2" />
                        <span>Completed: {formatDate(project.completedDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign size={16} className="mr-2" />
                        <span>Total: {formatCurrency(project.totalAmount, project.currency)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full bg-transparent">
                      <Link href={`/projects/${project.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Upcoming Events */}
          <TabsContent value="upcoming" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                    <Badge className="absolute top-2 right-2 bg-purple-600">Upcoming</Badge>
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
                        <span>{event.expectedAttendees} expected attendees</span>
                      </div>
                      {event.registrationFee > 0 && (
                        <div className="flex items-center">
                          <DollarSign size={16} className="mr-2" />
                          <span>{formatCurrency(event.registrationFee, event.currency)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button asChild className="flex-1 bg-orange-600 hover:bg-orange-700">
                      <Link href={`/events/register/event-${event.id}`}>Register</Link>
                    </Button>
                    {event.registrationFee === 0 && (
                      <Button asChild className="flex-1 bg-green-600 hover:bg-green-700">
                        <Link href={`/donate?event=${event.id}`}>Support Event</Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-orange-600">Frequently Asked Questions</h2>
        <PageFAQ pageId="projects" />
      </section>
    </div>
  )
}
