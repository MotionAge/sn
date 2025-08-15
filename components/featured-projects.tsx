"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Calendar, MapPin } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  category: string
  target_amount: number
  raised_amount: number
  start_date: string
  end_date: string
  location: string
  featured_image?: string
  status: string
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects?featured=true&limit=3")
        if (response.ok) {
          const data = await response.json()
          setProjects(data.data || [])
        }
      } catch (error) {
        console.error("Error fetching featured projects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
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

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No active projects at the moment.</p>
          <p className="text-sm text-gray-500 mt-2">Check back soon for new projects!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => {
        const progressPercentage = (project.raised_amount / project.target_amount) * 100

        return (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <div className="relative h-48 overflow-hidden rounded-t-lg">
              <Image
                src={project.featured_image || "/placeholder.svg?height=200&width=400&text=Project+Image"}
                alt={project.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-green-600 text-white">{project.category}</Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-green-600" />
                  <span className="line-clamp-1">{project.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-green-600" />
                  <span>
                    {new Date(project.start_date).toLocaleDateString()} -{" "}
                    {new Date(project.end_date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{progressPercentage.toFixed(1)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <div className="flex justify-between text-sm mt-2">
                  <span>₹{project.raised_amount.toLocaleString()}</span>
                  <span>₹{project.target_amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Link href={`/projects/${project.id}`}>View Details</Link>
                </Button>
                <Button asChild size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                  <Link href={`/donate?project=${project.id}`}>Donate</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
