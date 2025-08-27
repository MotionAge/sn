"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Target, Users, Zap } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface DonationStats {
  totalDonations: number
  totalDonors: number
  activeProjects: number
}

export default function DonationCTA() {
  const { language } = useTranslation()
  const [stats, setStats] = useState<DonationStats>({
    totalDonations: 0,
    totalDonors: 0,
    activeProjects: 0,
  })
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/donations/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data.data || stats)
        } else if (response.status === 503) {
          // Database unavailable - show default values
          setHasError(true)
        }
      } catch (error) {
        console.error("Error fetching donation stats:", error)
        setHasError(true)
      }
    }

    fetchStats()
  }, [])

  return (
    <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Support Our Mission
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Help us preserve and promote the values of Sanatan Dharma. Your contribution, no matter how small, makes a big difference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-white" />
              <div className="text-3xl font-bold mb-2">
                {hasError ? "---" : `₹${stats.totalDonations.toLocaleString()}`}
              </div>
              <p className="opacity-90">Total Donations Raised</p>
              {hasError && (
                <p className="text-xs opacity-75 mt-1">Data unavailable</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-white" />
              <div className="text-3xl font-bold mb-2">{hasError ? "---" : stats.totalDonors.toLocaleString()}</div>
              <p className="opacity-90">Generous Donors</p>
              {hasError && (
                <p className="text-xs opacity-75 mt-1">Data unavailable</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <Target className="h-12 w-12 mx-auto mb-4 text-white" />
              <div className="text-3xl font-bold mb-2">{hasError ? "---" : stats.activeProjects}</div>
              <p className="opacity-90">Active Projects</p>
              {hasError && (
                <p className="text-xs opacity-75 mt-1">Data unavailable</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3">
              <Link href="/donate">
                <Heart className="mr-2 h-5 w-5" />
                Donate Now
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 px-8 py-3 bg-transparent"
            >
              <Link href="/projects">
                <Zap className="mr-2 h-5 w-5" />
                View Projects
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-sm opacity-75">
            All donations are tax-deductible. We are transparent and accountable.
          </p>
        </div>
      </div>
    </section>
  )
}
