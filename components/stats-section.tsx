"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Calendar, BookOpen, Heart } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface Stats {
  totalMembers: number
  totalEvents: number
  totalBlogs: number
  totalDonations: number
}

export default function StatsSection() {
  const { language } = useTranslation()
  const [stats, setStats] = useState<Stats>({
    totalMembers: 0,
    totalEvents: 0,
    totalBlogs: 0,
    totalDonations: 0,
  })
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data.data || stats)
        } else if (response.status === 503) {
          // Database unavailable
          setHasError(true)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
        setHasError(true)
      }
    }

    fetchStats()
  }, [])

  const statsData = [
    {
      icon: Users,
      value: hasError ? "---" : stats.totalMembers.toLocaleString(),
      label: "Members",
      color: "text-blue-600",
    },
    {
      icon: Calendar,
      value: hasError ? "---" : stats.totalEvents.toLocaleString(),
      label: "Events",
      color: "text-green-600",
    },
    {
      icon: BookOpen,
      value: hasError ? "---" : stats.totalBlogs.toLocaleString(),
      label: "Blogs",
      color: "text-purple-600",
    },
    {
      icon: Heart,
      value: hasError ? "---" : `₹${stats.totalDonations.toLocaleString()}`,
      label: "Donations",
      color: "text-red-600",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <stat.icon className={`h-12 w-12 mx-auto mb-4 ${stat.color}`} />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <p className="text-gray-600">{stat.label}</p>
                {hasError && (
                  <p className="text-xs text-gray-400 mt-1">
                    Data unavailable
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
