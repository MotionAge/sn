"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, DollarSign, Users, Clock } from "lucide-react"
import { useApi } from "@/hooks/use-api"
import { apiClient } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"

interface Project {
  id: string
  title: string
  description: string
  image_url: string
  goal_amount: number
  raised_amount: number
  currency: string
  start_date: string
  end_date: string | null
  location: string
  beneficiaries: number
  status: string
  is_active: boolean
}

export default function ProjectsPage() {
  const { data: projects, loading, error, execute: fetchProjects } = useApi(apiClient.getProjects)

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

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

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <Skeleton className="h-12 w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
        </div>
        <Tabs defaultValue="ongoing" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
          <TabsContent value="ongoing" className="space-y-6">
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
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  if (error || !projects) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Unable to load projects</p>
        <Button onClick={fetchProjects} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  // Filter only active projects
  const activeProjects = Array.isArray(projects) ? projects.filter((project: Project) => project.is_active) : []

  if (activeProjects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No projects available</p>
      </div>
    )
  }

  // Categorize projects
  const ongoingProjects = activeProjects.filter((project: Project) => project.status === 'ongoing')
  const completedProjects = activeProjects.filter((project: Project) => project.status === 'completed')
  const upcomingProjects = activeProjects.filter((project: Project) => project.status === 'planning')

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-orange-600">Our Projects</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover the impactful initiatives we're working on to preserve and promote Sanatan Dharma values.
          Support our projects and be part of positive change.
        </p>
      </section>

      {/* Projects Tabs */}
      <Tabs defaultValue="ongoing" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="ongoing">Ongoing Projects</TabsTrigger>
          <TabsTrigger value="completed">Completed Projects</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Projects</TabsTrigger>
        </TabsList>

        {/* Ongoing Projects */}
        <TabsContent value="ongoing" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ongoingProjects.map((project: Project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image src={project.image_url || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
                  <Badge className="absolute top-2 right-2 bg-orange-600">{project.status}</Badge>
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="space-y-2 text-sm text-gray-500">
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
                      <span>{formatDate(project.start_date)} - {project.end_date ? formatDate(project.end_date) : 'Ongoing'}</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{formatCurrency(project.raised_amount, project.currency)} raised</span>
                      <span className="text-gray-500">of {formatCurrency(project.goal_amount, project.currency)}</span>
                    </div>
                    <Progress value={calculateProgress(project.raised_amount, project.goal_amount)} className="h-2" />
                    <div className="text-right text-sm text-gray-500">
                      {calculateProgress(project.raised_amount, project.goal_amount)}% complete
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button asChild className="flex-1 bg-orange-600 hover:bg-orange-700">
                    <Link href={`/donate?project=${project.id}`}>Donate</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={`/projects/${project.id}`}>Learn More</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Completed Projects */}
        <TabsContent value="completed" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedProjects.map((project: Project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image src={project.image_url || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
                  <Badge className="absolute top-2 right-2 bg-green-600">Completed</Badge>
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users size={16} className="mr-2" />
                      <span>{project.beneficiaries} beneficiaries</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign size={16} className="mr-2" />
                      <span>Total: {formatCurrency(project.raised_amount, project.currency)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/projects/${project.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Upcoming Projects */}
        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingProjects.map((project: Project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image src={project.image_url || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
                  <Badge className="absolute top-2 right-2 bg-blue-600">Planning</Badge>
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users size={16} className="mr-2" />
                      <span>{project.beneficiaries} expected beneficiaries</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign size={16} className="mr-2" />
                      <span>Goal: {formatCurrency(project.goal_amount, project.currency)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/projects/${project.id}`}>Learn More</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <section className="mt-16 text-center">
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4 text-orange-600">Support Our Mission</h3>
            <p className="text-gray-700 mb-6">
              Your contributions help us continue our important work in preserving and promoting Sanatan Dharma values.
              Every donation makes a difference.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild className="bg-orange-600 hover:bg-orange-700">
                <Link href="/donate">Make a Donation</Link>
              </Button>
              <Button asChild variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
