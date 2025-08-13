"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
  status: string
  start_date: string
  end_date: string | null
  is_active: boolean
}

export default function FeaturedProjects() {
  const { data: projects, loading, error, execute: fetchProjects } =  useApi(apiClient.getProjects)

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
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </CardFooter>
          </Card>
        ))}
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

  // Filter only active and ongoing projects
  const activeProjects = (Array.isArray(projects) ? projects : [])
    .filter((project: Project) => project.is_active && project.status === 'ongoing')
    .slice(0, 3)

  if (activeProjects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No active projects available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activeProjects.map((project: Project) => {
        const progress = calculateProgress(project.raised_amount, project.goal_amount)

        return (
          <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image src={project.image_url || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
              <div className="absolute top-2 right-2 bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded uppercase">
                {project.status}
              </div>
            </div>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-2 text-gray-800">{project.title}</h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{formatCurrency(project.raised_amount, project.currency)} raised</span>
                  <span className="text-gray-500">of {formatCurrency(project.goal_amount, project.currency)}</span>
                </div>
                <Progress value={progress} className="h-2 bg-gray-200 [&_.progress-bar]:bg-orange-600" />
                <div className="text-right text-sm text-gray-500">{progress}% complete</div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button asChild className="flex-1 bg-orange-600 hover:bg-orange-700">
                <Link href={`/donate?project=${project.id}`}>Donate</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-50 bg-transparent"
              >
                <Link href={`/projects/${project.id}`}>Learn More</Link>
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
