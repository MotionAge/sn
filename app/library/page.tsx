"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Search, Download, Play, Eye, FileText, ImageIcon, Music, Video, Loader2 } from "lucide-react"
import PageVideo from "@/components/page-video"
import PageFAQ from "@/components/page-faq"

interface LibraryItem {
  id: number
  title: string
  description: string
  category: string
  type: string
  file_url: string
  thumbnail_url?: string
  file_size: string
  is_free: boolean
  download_count: number
  tags: string[]
  created_at: string
}

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Mock login state
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("sanatan-gallery")

  const categories = [
    {
      id: "sanatan-gallery",
      name: "Sanatan Gallery",
      description: "Collection of sacred images, artwork, and visual representations",
    },
    { id: "publications", name: "Publications", description: "Books, research papers, and scholarly publications" },
    { id: "bhajans", name: "Bhajans", description: "Devotional songs and spiritual music" },
    { id: "puran-saptaha", name: "Puran/Saptaha", description: "Sacred texts and spiritual discourses" },
    { id: "completion-reports", name: "Reports", description: "Project completion reports and documentation" },
    { id: "annual-budget", name: "Budget", description: "Financial reports and budget documents" },
    { id: "assembly-elections", name: "Assembly", description: "Governance documents and election materials" },
  ]

  useEffect(() => {
    fetchLibraryItems()
  }, [activeCategory, searchTerm])

  const fetchLibraryItems = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (activeCategory) params.append("category", activeCategory)
      if (searchTerm) params.append("search", searchTerm)

      const response = await fetch(`/api/library?${params}`)
      if (response.ok) {
        const data = await response.json()
        setLibraryItems(data.items || [])
      }
    } catch (error) {
      console.error("Error fetching library items:", error)
    } finally {
      setLoading(false)
    }
  }

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

  const getActionButton = (item: LibraryItem) => {
    if (!item.is_free && !isLoggedIn) {
      return (
        <Button disabled className="w-full bg-transparent" variant="outline">
          <Lock className="h-4 w-4 mr-2" />
          Login Required
        </Button>
      )
    }

    const handleAction = () => {
      // Increment download count
      fetch(`/api/library/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, download_count: item.download_count + 1 }),
      })

      // Handle different file types
      if (item.type === "video" || item.type === "audio") {
        // Open in new tab for media files
        window.open(item.file_url, "_blank")
      } else {
        // Download for other files
        const link = document.createElement("a")
        link.href = item.file_url
        link.download = item.title
        link.click()
      }
    }

    switch (item.type) {
      case "video":
      case "audio":
        return (
          <Button onClick={handleAction} className="w-full bg-orange-600 hover:bg-orange-700">
            <Play className="h-4 w-4 mr-2" />
            Play
          </Button>
        )
      case "image":
        return (
          <Button onClick={handleAction} className="w-full bg-orange-600 hover:bg-orange-700">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
        )
      default:
        return (
          <Button onClick={handleAction} className="w-full bg-orange-600 hover:bg-orange-700">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        )
    }
  }

  const currentCategory = categories.find((cat) => cat.id === activeCategory)
  const filteredItems = libraryItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
      <section className="mb-12">
        <PageVideo videoId="library-page-video" />
      </section>

      {/* Library Categories */}
      <section className="mb-12">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-8">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                {category.name.split(" ")[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 text-orange-600">{category.name}</h2>
                <p className="text-gray-600">{category.description}</p>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                  <span className="ml-2 text-gray-600">Loading library items...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48">
                        <Image
                          src={item.thumbnail_url || "/placeholder.svg?height=200&width=300"}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 left-2 flex gap-2">
                          <Badge className="bg-white text-gray-800">
                            {getTypeIcon(item.type)}
                            <span className="ml-1 capitalize">{item.type}</span>
                          </Badge>
                          {item.is_free ? (
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
                          <span>{item.download_count} downloads</span>
                          <span>{item.file_size}</span>
                        </div>

                        {getActionButton(item)}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {!loading && filteredItems.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {searchTerm ? "No items found matching your search." : "No items available in this category."}
                  </p>
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
