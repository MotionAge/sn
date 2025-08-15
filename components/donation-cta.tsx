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

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/donations/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data.data || stats)
        }
      } catch (error) {
        console.error("Error fetching donation stats:", error)
      }
    }

    fetchStats()
  }, [])

  return (
    <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            {language === "ne" ? "हाम्रो मिशनमा सहयोग गर्नुहोस्" : "Support Our Mission"}
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            {language === "ne"
              ? "सनातन धर्मका मूल्यहरूको संरक्षण र प्रवर्धनमा योगदान दिनुहोस्। आपको सानो योगदानले ठूलो परिवर्तन ल्याउन सक्छ।"
              : "Help us preserve and promote the values of Sanatan Dharma. Your contribution, no matter how small, makes a big difference."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-white" />
              <div className="text-3xl font-bold mb-2">₹{stats.totalDonations.toLocaleString()}</div>
              <p className="opacity-90">{language === "ne" ? "कुल दान संकलन" : "Total Donations Raised"}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-white" />
              <div className="text-3xl font-bold mb-2">{stats.totalDonors.toLocaleString()}</div>
              <p className="opacity-90">{language === "ne" ? "दाताहरूको संख्या" : "Generous Donors"}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <Target className="h-12 w-12 mx-auto mb-4 text-white" />
              <div className="text-3xl font-bold mb-2">{stats.activeProjects}</div>
              <p className="opacity-90">{language === "ne" ? "सक्रिय परियोजनाहरू" : "Active Projects"}</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3">
              <Link href="/donate">
                <Heart className="mr-2 h-5 w-5" />
                {language === "ne" ? "अहिले दान गर्नुहोस्" : "Donate Now"}
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
                {language === "ne" ? "परियोजनाहरू हेर्नुहोस्" : "View Projects"}
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-sm opacity-75">
            {language === "ne"
              ? "सबै दानहरू कर छुटको लागि योग्य छन्। हामी पारदर्शी र जवाफदेही छौं।"
              : "All donations are tax-deductible. We are transparent and accountable."}
          </p>
        </div>
      </div>
    </section>
  )
}
