"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, DollarSign, Users, Clock, Loader2 } from "lucide-react"
import PageVideo from "@/components/page-video"
import PageFAQ from "@/components/page-faq"

interface Project {
  id: number
  title: string
  description: string
  image_url?: string
  goal_amount?: number
  raised_amount?: number
  total_amount?: number
  currency: string
  start_date?: string
  end_date?: string
  completed_date?: string
  location: string
  beneficiaries: number
  status: "ongoing" | "completed" | "upcoming"
  type: "project" | "event"
  registration_fee?: number
  expected_attendees?: number
  event_time?: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      // Fetch both projects and events
      const [projectsResponse, eventsResponse] = await Promise.all([fetch("/api/projects"), fetch("/api/events")])

      const projectsData = projectsResponse.ok ? await projectsResponse.json() : { projects: [] }
      const eventsData = eventsResponse.ok ? await eventsResponse.json() : { events: [] }

      // Combine and format data
      const allProjects = [
        ...(projectsData.projects || []).map((p: any) => ({ ...p, type: "project" })),
        ...(eventsData.events || []).map((e: any) => ({
          ...e,
          type: "event",
          status: new Date(e.event_date) > new Date() ? "upcoming" : "completed",
        })),
      ]

      setProjects(allProjects)
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

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

  const ongoingProjects = projects.filter((p) => p.status === "ongoing" && p.type === "project")
  const completedProjects = projects.filter((p) => p.status === "completed" && p.type === "project")
  const upcomingEvents = projects.filter((p) => p.status === "upcoming" && p.type === "event")

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          <span className="ml-2 text-gray-600">Loading projects...</span>
        </div>
      </div>
    )
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
      <section className="mb-12">
        <PageVideo videoId="projects-page-video" />
      </section>

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
            <TabsTrigger value="ongoing">Ongoing Projects ({ongoingProjects.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed Projects ({completedProjects.length})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Events ({upcomingEvents.length})</TabsTrigger>
          </TabsList>

          {/* Ongoing Projects */}
          <TabsContent value="ongoing" className="mt-8">
            {ongoingProjects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No ongoing projects at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ongoingProjects.map((project) => {
                  const progress =
                    project.goal_amount && project.raised_amount
                      ? calculateProgress(project.raised_amount, project.goal_amount)
                      : 0
                  return (
                    <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48">
                        <Image
                          src={project.image_url || "/placeholder.svg?height=300&width=500"}
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
                        <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>

                        <div className="space-y-2 text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <MapPin size={16} className="mr-2" />
                            <span>{project.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Users size={16} className="mr-2" />
                            <span>{project.beneficiaries} beneficiaries</span>
                          </div>
                          {project.start_date && project.end_date && (
                            <div className="flex items-center">
                              <Calendar size={16} className="mr-2" />
                              <span>
                                {formatDate(project.start_date)} - {formatDate(project.end_date)}
                              </span>
                            </div>
                          )}
                        </div>

                        {project.goal_amount && project.raised_amount && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">
                                {formatCurrency(project.raised_amount, project.currency)} raised
                              </span>
                              <span className="text-gray-500">
                                of {formatCurrency(project.goal_amount, project.currency)}
                              </span>
                            </div>
                            <Progress value={progress} className="h-2 bg-gray-200" indicatorClassName="bg-orange-600" />
                            <div className="text-right text-sm text-gray-500">{progress}% complete</div>
                          </div>
                        )}
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
            )}
          </TabsContent>

          {/* Completed Projects */}
          <TabsContent value="completed" className="mt-8">
            {completedProjects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No completed projects to display.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedProjects.map((project) => (
                  <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={project.image_url || "/placeholder.svg?height=300&width=500"}
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
                      <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>

                      <div className="space-y-2 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-2" />
                          <span>{project.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Users size={16} className="mr-2" />
                          <span>{project.beneficiaries} beneficiaries</span>
                        </div>
                        {project.completed_date && (
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-2" />
                            <span>Completed: {formatDate(project.completed_date)}</span>
                          </div>
                        )}
                        {project.total_amount && (
                          <div className="flex items-center">
                            <DollarSign size={16} className="mr-2" />
                            <span>Total: {formatCurrency(project.total_amount, project.currency)}</span>
                          </div>
                        )}
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
            )}
          </TabsContent>

          {/* Upcoming Events */}
          <TabsContent value="upcoming" className="mt-8">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No upcoming events scheduled.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={event.image_url || "/placeholder.svg?height=300&width=500"}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-purple-600">Upcoming</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>

                      <div className="space-y-2 text-sm text-gray-500 mb-4">
                        {event.start_date && (
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-2" />
                            <span>{formatDate(event.start_date)}</span>
                          </div>
                        )}
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
                        {event.expected_attendees && (
                          <div className="flex items-center">
                            <Users size={16} className="mr-2" />
                            <span>{event.expected_attendees} expected attendees</span>
                          </div>
                        )}
                        {event.registration_fee && event.registration_fee > 0 && (
                          <div className="flex items-center">
                            <DollarSign size={16} className="mr-2" />
                            <span>{formatCurrency(event.registration_fee, event.currency)}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button asChild className="flex-1 bg-orange-600 hover:bg-orange-700">
                        <Link href={`/events/register/${event.id}`}>Register</Link>
                      </Button>
                      {(!event.registration_fee || event.registration_fee === 0) && (
                        <Button asChild className="flex-1 bg-green-600 hover:bg-green-700">
                          <Link href={`/donate?event=${event.id}`}>Support Event</Link>
                        </Button>
                      )}
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
        <PageFAQ pageId="projects" />
      </section>
    </div>
  )
}
