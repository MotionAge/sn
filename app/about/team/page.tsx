"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TeamMember {
  id: string
  name: string
  position: string
  image_url?: string
  bio?: string
  email?: string
  phone?: string
  category: "current_board" | "past_members" | "executives" | "advisors" | "donors"
  tenure?: string
  department?: string
  expertise?: string
  location?: string
  contribution?: string
  type?: string
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        const response = await fetch("/api/team-members")

        if (!response.ok) {
          throw new Error("Failed to fetch team members")
        }

        const data = await response.json()
        setTeamMembers(data.data || [])
      } catch (err: any) {
        setError(err.message || "Failed to load team members")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeamMembers()
  }, [])

  const currentBoard = teamMembers.filter((member) => member.category === "current_board")
  const pastMembers = teamMembers.filter((member) => member.category === "past_members")
  const executives = teamMembers.filter((member) => member.category === "executives")
  const advisors = teamMembers.filter((member) => member.category === "advisors")
  const donors = teamMembers.filter((member) => member.category === "donors")

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-orange-600">Our Team</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Meet the dedicated individuals who work tirelessly to promote Sanatan Dharma values and serve our community.
        </p>
      </div>

      <Tabs defaultValue="current-board" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="current-board">Current Board</TabsTrigger>
          <TabsTrigger value="past-members">Past Members</TabsTrigger>
          <TabsTrigger value="executives">Executives</TabsTrigger>
          <TabsTrigger value="advisors">Advisors</TabsTrigger>
          <TabsTrigger value="donors">Major Donors</TabsTrigger>
        </TabsList>

        <TabsContent value="current-board" className="mt-8">
          {currentBoard.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">No current board members found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentBoard.map((member) => (
                <Card key={member.id} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <Image
                        src={member.image_url || "/placeholder.svg?height=128&width=128"}
                        alt={member.name}
                        fill
                        className="object-cover rounded-full border-4 border-orange-100"
                      />
                    </div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <Badge className="bg-orange-600 text-white">{member.position}</Badge>
                  </CardHeader>
                  <CardContent>
                    {member.bio && <p className="text-sm text-gray-600 mb-4">{member.bio}</p>}
                    <div className="space-y-2">
                      {member.email && (
                        <div className="flex items-center justify-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-orange-600" />
                          <span className="text-gray-600">{member.email}</span>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center justify-center text-sm">
                          <Phone className="h-4 w-4 mr-2 text-orange-600" />
                          <span className="text-gray-600">{member.phone}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past-members" className="mt-8">
          {pastMembers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">No past members found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-orange-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Position</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Tenure</th>
                  </tr>
                </thead>
                <tbody>
                  {pastMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">{member.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{member.position}</td>
                      <td className="border border-gray-300 px-4 py-2">{member.tenure}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="executives" className="mt-8">
          {executives.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">No executives found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {executives.map((executive) => (
                <Card key={executive.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{executive.name}</CardTitle>
                    <Badge variant="outline" className="w-fit">
                      {executive.position}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    {executive.department && <p className="text-gray-600">Department: {executive.department}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="advisors" className="mt-8">
          {advisors.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">No advisors found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {advisors.map((advisor) => (
                <Card key={advisor.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{advisor.name}</CardTitle>
                    {advisor.expertise && <Badge className="bg-blue-600 text-white w-fit">{advisor.expertise}</Badge>}
                  </CardHeader>
                  <CardContent>
                    {advisor.location && <p className="text-gray-600">Location: {advisor.location}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="donors" className="mt-8">
          {donors.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">No major donors found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {donors.map((donor) => (
                <Card key={donor.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{donor.name}</CardTitle>
                    {donor.type && (
                      <Badge variant="outline" className="w-fit">
                        {donor.type}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    {donor.contribution && <p className="text-gray-600">Contribution: {donor.contribution}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
