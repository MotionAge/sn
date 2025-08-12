"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Search, Download, Play, Eye, FileText, ImageIcon, Music, Video } from "lucide-react"
import PageVideo from "@/components/page-video"
import PageFAQ from "@/components/page-faq"

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Mock login state

  const libraryCategories = [
    {
      id: "sanatan-gallery",
      name: "Sanatan Gallery",
      description: "Collection of sacred images, artwork, and visual representations",
      items: [
        {
          id: 1,
          title: "Sacred Temples of Nepal",
          description: "High-resolution images of ancient temples across Nepal",
          type: "image",
          thumbnail: "/placeholder.svg?height=200&width=300",
          isFree: true,
          downloadCount: 245,
          fileSize: "15 MB",
        },
        {
          id: 2,
          title: "Vedic Art Collection",
          description: "Traditional artwork depicting Vedic themes and stories",
          type: "image",
          thumbnail: "/placeholder.svg?height=200&width=300",
          isFree: false,
          downloadCount: 89,
          fileSize: "25 MB",
        },
      ],
    },
    {
      id: "publications",
      name: "Publications",
      description: "Books, research papers, and scholarly publications",
      items: [
        {
          id: 3,
          title: "Introduction to Vedic Philosophy",
          description: "Comprehensive guide to understanding Vedic principles",
          type: "pdf",
          thumbnail: "/placeholder.svg?height=200&width=300",
          isFree: true,
          downloadCount: 567,
          fileSize: "5.2 MB",
        },
        {
          id: 4,
          title: "Sanskrit Grammar Handbook",
          description: "Complete reference for Sanskrit grammar and syntax",
          type: "pdf",
          thumbnail: "/placeholder.svg?height=200&width=300",
          isFree: false,
          downloadCount: 234,
          fileSize: "8.7 MB",
        },
      ],
    },
    {
      id: "bhajans",
      name: "Bhajans",
      description: "Devotional songs and spiritual music",
      items: [
        {
          id: 5,
          title: "Morning Prayer Collection",
          description: "Traditional morning prayers and bhajans",
          type: "audio",
          thumbnail: "/placeholder.svg?height=200&width=300",
          isFree: true,
          downloadCount: 456,
          fileSize: "45 MB",
        },
        {
          id: 6,
          title: "Festival Bhajans",
          description: "Special bhajans for various Hindu festivals",
          type: "video",
          thumbnail: "/placeholder.svg?height=200&width=300",
          isFree: false,
          downloadCount: 123,
          fileSize: "120 MB",
        },
      ],
    },
    {
      id: "puran-saptaha",
      name: "Puran/Saptaha Mahagyan",
      description: "Sacred texts and spiritual discourses",
      items: [
        {
          id: 7,
          title: "Bhagavad Gita Discourse Series",
          description: "Complete audio series on Bhagavad Gita teachings",
          type: "audio",
          thumbnail: "/placeholder.svg?height=200&width=300",
          isFree: false,
          downloadCount: 789,
          fileSize: "200 MB",
        },
        {
          id: 8,
          title: "Ramayana Katha",
          description: "Video series of Ramayana storytelling sessions",
          type: "video",
          thumbnail: "/placeholder.svg?height=200&width=300",
          isFree: false,
          downloadCount: 345,
          fileSize: "1.2 GB",
        },
      ],
    },
    {
      id: "completion-reports",
      name: "Completion Reports",
      description: "Project completion reports and documentation",
      items: [
        {
          id: 9,
          title: "Temple Restoration Project Report 2023",
          description: "Detailed report on temple restoration activities",
          type: "pdf",
          thumbnail: "/placeholder.svg?height=200&width=300",
          isFree: true,
          downloadCount: 156,
          fileSize: "12 MB",
        },
        {
          id: 10,
          title: "Educational Program Impact Assessment",
          description: "Analysis of our educational program outcomes",
          type: "pdf",
          thumbnail: "/placeholder.svg?height=200&width=300",
          isFree: false,
          downloadCount: 78,
          fileSize: "6.8 MB",
        },
      ],
    },
    {
      id: "annual-budget",
      name: "Annual Budget",
      description: "Financial reports and budget documents",
      items: [
        {
          id: 11,
          title: "Annual Financial Report 2023",
          description: "Complete financial overview and budget allocation",
          type: "pdf",
          thumbnail: "/placeholder.svg?height=200&width=300",
          isFree: true,
          downloadCount: 234,
          fileSize: "3.5 MB",
        },
        {
          id: 12,
          title: "Audit Report 2023",
          description: "Independent audit report and recommendations",
          type: "pdf",
          thumbnail: "/placeholder.svg?height=200&width=300",
          isFree: false,
          downloadCount: 89,
          fileSize: "4.2 MB",
        },
      ],
    },
    {
      id: "assembly-elections",
      name: "Assembly & Elections",
      description: "Governance documents and election materials",
      items: [
        {
          id: 13,
          title: "Annual General Meeting 2023",
          description: "Video recording of annual general meeting",
          type: "video",
          thumbnail: "/placeholder.svg?height=200&width=300",
          isFree: true,
          downloadCount: 167,
          fileSize: "450 MB",
        },
        {
          id: 14,
          title: "Election Process Documentation",
          description: "Complete documentation of election procedures",
          type: "pdf",
          thumbnail: "/placeholder.svg?height=200&width=300",
          isFree: false,
          downloadCount: 45,
          fileSize: "2.8 MB",
        },
      ],
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5" />
      case "image":
        return <ImageIcon className="h-5 w-5" />
      case "audio":
        return <Music className="h-5 w-5" />
      case "video":
        return <Video className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getActionButton = (item: any) => {
    if (!item.isFree && !isLoggedIn) {
      return (
        <Button disabled className="w-full bg-transparent" variant="outline">
          <Lock className="h-4 w-4 mr-2" />
          Login Required
        </Button>
      )
    }

    switch (item.type) {
      case "video":
      case "audio":
        return (
          <Button className="w-full bg-orange-600 hover:bg-orange-700">
            <Play className="h-4 w-4 mr-2" />
            Play
          </Button>
        )
      case "image":
        return (
          <Button className="w-full bg-orange-600 hover:bg-orange-700">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
        )
      default:
        return (
          <Button className="w-full bg-orange-600 hover:bg-orange-700">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        )
    }
  }

  const filteredCategories = libraryCategories
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.items.length > 0)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-orange-600">Digital Library</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Access our comprehensive collection of spiritual texts, audio recordings, videos, and educational materials.
          Some content requires membership for access.
        </p>
      </section>

      {/* Access Notice */}
      {!isLoggedIn && (
        <Alert className="mb-8 border-orange-200 bg-orange-50">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            Some content in our library requires membership access.
            <Link href="/membership/login" className="text-orange-600 hover:underline ml-1">
              Login here
            </Link>{" "}
            or
            <Link href="/membership/apply" className="text-orange-600 hover:underline ml-1">
              apply for membership
            </Link>{" "}
            to access premium content.
          </AlertDescription>
        </Alert>
      )}

      {/* Search Bar */}
      <section className="mb-8">
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search library..."
            className="pl-10 pr-4 py-2 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* Featured Video */}
      {/* <section className="mb-12">
        <PageVideo videoId="library-page-video" />
      </section> */}

      {/* Library Categories */}
      <section className="mb-12">
        <Tabs defaultValue="sanatan-gallery" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-8">
            {libraryCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                {category.name.split(" ")[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {(searchTerm ? filteredCategories : libraryCategories).map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 text-orange-600">{category.name}</h2>
                <p className="text-gray-600">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 flex gap-2">
                        <Badge className="bg-white text-gray-800">
                          {getTypeIcon(item.type)}
                          <span className="ml-1 capitalize">{item.type}</span>
                        </Badge>
                        {item.isFree ? (
                          <Badge className="bg-green-600">Free</Badge>
                        ) : (
                          <Badge className="bg-orange-600">
                            <Lock className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                    </div>

                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                    </CardHeader>

                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>

                      <div className="flex justify-between text-sm text-gray-500 mb-4">
                        <span>{item.downloadCount} downloads</span>
                        <span>{item.fileSize}</span>
                      </div>

                      {getActionButton(item)}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {category.items.length === 0 && searchTerm && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No items found matching your search.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Membership CTA */}
      <section className="mb-12">
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-orange-600">Unlock Premium Content</h3>
            <p className="text-gray-700 mb-6">
              Become a member to access our complete library of premium spiritual content, including exclusive audio
              recordings, video series, and scholarly publications.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild className="bg-orange-600 hover:bg-orange-700">
                <Link href="/membership/apply">Apply for Membership</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-orange-600 text-orange-600 hover:bg-orange-50 bg-transparent"
              >
                <Link href="/membership/login">Member Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-orange-600">Frequently Asked Questions</h2>
        <PageFAQ pageId="library" />
      </section>
    </div>
  )
}
