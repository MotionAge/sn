"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

// Mock data - would come from CMS in production
const projects = [
  {
    id: 1,
    title: "Gurukul Expansion Project",
    description: "Help us expand our Gurukul facilities to accommodate more students.",
    image: "/placeholder.svg?height=300&width=500",
    goalAmount: 500000,
    raisedAmount: 325000,
    currency: "NPR",
    status: "ongoing",
    url: "/projects/gurukul-expansion",
  },
  {
    id: 2,
    title: "Sanskrit Library Development",
    description: "Building a comprehensive library of Sanskrit texts and resources.",
    image: "/placeholder.svg?height=300&width=500",
    goalAmount: 300000,
    raisedAmount: 150000,
    currency: "NPR",
    status: "ongoing",
    url: "/projects/sanskrit-library",
  },
  {
    id: 3,
    title: "Community Outreach Program",
    description: "Supporting underprivileged communities with education and resources.",
    image: "/placeholder.svg?height=300&width=500",
    goalAmount: 200000,
    raisedAmount: 180000,
    currency: "NPR",
    status: "ongoing",
    url: "/projects/community-outreach",
  },
]

export default function FeaturedProjects() {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => {
        const progress = calculateProgress(project.raisedAmount, project.goalAmount)

        return (
          <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
              <div className="absolute top-2 right-2 bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded uppercase">
                {project.status}
              </div>
            </div>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-2 text-gray-800">{project.title}</h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{formatCurrency(project.raisedAmount, project.currency)} raised</span>
                  <span className="text-gray-500">of {formatCurrency(project.goalAmount, project.currency)}</span>
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
                <Link href={project.url}>Learn More</Link>
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
