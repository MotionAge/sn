"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Target, MapPin, Calendar } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface Project {
  id: string
  title_en: string
  description_en: string
  target_amount: number
  raised_amount: number
  start_date: string
  end_date: string
  location_en?: string
  image_url?: string
  is_featured: boolean
}

export default function FeaturedProjects() {
  const { language } = useTranslation()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects?featured=true&limit=3")

        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            setProjects(result.data)
          }
        }
      } catch (error) {
        console.warn("Error fetching featured projects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const calculateProgress = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100)
  }

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Projects
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
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Projects
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Support our ongoing projects and help us make a difference in the community
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No active projects
            </h3>
            <p className="text-gray-500">
              Check back soon for new projects
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
              const progress = calculateProgress(project.raised_amount, project.target_amount)

              return (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-gradient-to-r from-green-100 to-blue-100">
                    {project.image_url ? (
                      <img
                        src={project.image_url || "/placeholder.svg"}
                        alt={project.title_en}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Target className="h-16 w-16 text-green-600" />
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{project.title_en}</CardTitle>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {project.description_en}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Raised:</span>
                          <span className="font-semibold">{formatCurrency(project.raised_amount)}</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-gray-500">{progress.toFixed(1)}%</span>
                          <span className="text-gray-600">
                            Goal: 
                            {formatCurrency(project.target_amount)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        {project.location_en && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{project.location_en}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            End date: 
                            {new Date(project.end_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Contribute Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Button variant="outline" asChild>
            <a href="/projects">View All Projects</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
