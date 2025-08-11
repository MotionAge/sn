import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone } from "lucide-react"

export default function TeamPage() {
  const currentBoard = [
    {
      name: "Dr. Ram Prasad Sharma",
      position: "President",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Leading spiritual teacher with 25+ years of experience in Vedic studies.",
      email: "president@sdbnepal.org",
      phone: "+977 9841234567",
    },
    {
      name: "Sita Devi Adhikari",
      position: "Vice President",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Dedicated social worker and advocate for women's education in dharmic values.",
      email: "vp@sdbnepal.org",
      phone: "+977 9841234568",
    },
    {
      name: "Hari Bahadur Thapa",
      position: "Secretary",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Administrative expert with extensive experience in non-profit management.",
      email: "secretary@sdbnepal.org",
      phone: "+977 9841234569",
    },
    {
      name: "Dr. Anita Joshi",
      position: "Treasurer",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Financial expert and chartered accountant specializing in non-profit finances.",
      email: "treasurer@sdbnepal.org",
      phone: "+977 9841234570",
    },
  ]

  const pastMembers = [
    { name: "Late Pandit Govind Sharma", position: "Founding President", tenure: "2008-2015" },
    { name: "Krishna Bahadur Karki", position: "Former Secretary", tenure: "2010-2018" },
    { name: "Radha Devi Poudel", position: "Former Treasurer", tenure: "2012-2020" },
    { name: "Bishnu Prasad Gautam", position: "Former Vice President", tenure: "2015-2021" },
  ]

  const executives = [
    { name: "Rajesh Kumar Shrestha", position: "Program Director", department: "Events & Education" },
    { name: "Meera Devi Pandey", position: "Cultural Affairs Head", department: "Cultural Programs" },
    { name: "Suresh Bahadur Rana", position: "Community Outreach Manager", department: "Social Service" },
    { name: "Kamala Sharma", position: "Women's Wing Coordinator", department: "Women's Programs" },
  ]

  const advisors = [
    { name: "Acharya Vedananda Saraswati", expertise: "Vedic Philosophy", location: "Rishikesh, India" },
    { name: "Dr. Mahesh Raj Pant", expertise: "Sanskrit Literature", location: "Tribhuvan University" },
    { name: "Swami Chidananda Giri", expertise: "Yoga & Meditation", location: "Kathmandu" },
    { name: "Prof. Laxmi Devi Upreti", expertise: "Cultural Studies", location: "Nepal Academy" },
  ]

  const donors = [
    { name: "Shree Ram Foundation", contribution: "Major Infrastructure", type: "Institutional" },
    { name: "Gita Devi Memorial Trust", contribution: "Educational Programs", type: "Trust" },
    { name: "Anonymous Donor", contribution: "Gurukul Development", type: "Individual" },
    { name: "Dharma Seva Society", contribution: "Community Programs", type: "Organization" },
  ]

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentBoard.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover rounded-full border-4 border-orange-100"
                    />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <Badge className="bg-orange-600 text-white">{member.position}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{member.bio}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-orange-600" />
                      <span className="text-gray-600">{member.email}</span>
                    </div>
                    <div className="flex items-center justify-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-orange-600" />
                      <span className="text-gray-600">{member.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past-members" className="mt-8">
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
                {pastMembers.map((member, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-medium">{member.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{member.position}</td>
                    <td className="border border-gray-300 px-4 py-2">{member.tenure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="executives" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {executives.map((executive, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{executive.name}</CardTitle>
                  <Badge variant="outline" className="w-fit">
                    {executive.position}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Department: {executive.department}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="advisors" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advisors.map((advisor, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{advisor.name}</CardTitle>
                  <Badge className="bg-blue-600 text-white w-fit">{advisor.expertise}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Location: {advisor.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="donors" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {donors.map((donor, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{donor.name}</CardTitle>
                  <Badge variant="outline" className="w-fit">
                    {donor.type}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Contribution: {donor.contribution}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
