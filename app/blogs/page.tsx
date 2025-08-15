"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Calendar, User, Search, Share2, ThumbsUp, MessageCircle, Loader2 } from "lucide-react"
import PageVideo from "@/components/page-video"
import PageFAQ from "@/components/page-faq"
import { useTranslation } from "@/hooks/use-translation"

interface BlogPost {
  post_id: string
  title: string
  title_english?: string
  excerpt: string
  excerpt_english?: string
  author: string
  category: string
  publish_date: string
  status: string
  views: number
  likes: number
  comments: number
  shares: number
  featured: boolean
  featured_image?: string
  tags: string[]
}

export default function BlogsPage() {
  const { language } = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const blogCategories = [
    { id: "all", name: "All Posts", nameNepali: "सबै पोस्टहरू" },
    { id: "press-release", name: "Press Release", nameNepali: "प्रेस विज्ञप्ति" },
    { id: "past-events", name: "Past Events", nameNepali: "विगतका कार्यक्रमहरू" },
    { id: "gallery", name: "Gallery", nameNepali: "ग्यालेरी" },
    { id: "voting-polls", name: "Voting/Polls", nameNepali: "मतदान/सर्वेक्षण" },
    { id: "promotions", name: "Promotions", nameNepali: "प्रवर्धन" },
  ]

  useEffect(() => {
    fetchBlogs()
  }, [selectedCategory, searchTerm])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory)
      }
      params.append("status", "published")
      if (searchTerm) {
        params.append("search", searchTerm)
      }

      const response = await fetch(`/api/blogs?${params}`)
      if (!response.ok) throw new Error("Failed to fetch blogs")

      const result = await response.json()
      setBlogs(result.data || [])
    } catch (error) {
      console.error("Error fetching blogs:", error)
      setError("Failed to load blog posts. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === "ne" ? "ne-NP" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const sharePost = async (postId: string, title: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: `${window.location.origin}/blogs/${postId}`,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/blogs/${postId}`)
      alert("Link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchBlogs}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-orange-600">
          {language === "ne" ? "ब्लग र अपडेटहरू" : "Blogs & Updates"}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {language === "ne"
            ? "हाम्रा नवीनतम समाचार, कार्यक्रमहरू, र सनातन धर्मको संसारबाट अन्तर्दृष्टिहरूसँग अपडेट रहनुहोस्।"
            : "Stay updated with our latest news, events, and insights from the world of Sanatan Dharma."}
        </p>
      </section>

      {/* Search Bar */}
      <section className="mb-8">
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder={language === "ne" ? "ब्लगहरू खोज्नुहोस्..." : "Search blogs..."}
            className="pl-10 pr-4 py-2 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* Featured Video */}
      <section className="mb-12">
        <PageVideo videoId="blogs-page-video" />
      </section>

      {/* Blog Categories */}
      <section className="mb-12">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {blogCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                {language === "ne" ? category.nameNepali : category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-8">
            {blogs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-medium mb-2">
                    {language === "ne" ? "कुनै ब्लग पोस्ट फेला परेन" : "No blog posts found"}
                  </h3>
                  <p className="text-sm">
                    {language === "ne"
                      ? "यस श्रेणीमा कुनै ब्लग पोस्टहरू उपलब्ध छैनन्।"
                      : "No blog posts are available in this category."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((post) => {
                  const title = language === "ne" ? post.title : post.title_english || post.title
                  const excerpt = language === "ne" ? post.excerpt : post.excerpt_english || post.excerpt

                  return (
                    <Card key={post.post_id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48">
                        <Image
                          src={post.featured_image || "/placeholder.svg?height=200&width=400"}
                          alt={title}
                          fill
                          className="object-cover"
                        />
                        <Badge className="absolute top-2 right-2 bg-orange-600">
                          {blogCategories.find((cat) => cat.id === post.category)?.[
                            language === "ne" ? "nameNepali" : "name"
                          ] || post.category}
                        </Badge>
                        {post.featured && (
                          <Badge className="absolute top-2 left-2 bg-yellow-600">
                            {language === "ne" ? "फिचर्ड" : "Featured"}
                          </Badge>
                        )}
                      </div>

                      <CardHeader>
                        <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
                      </CardHeader>

                      <CardContent>
                        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>

                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <div className="flex items-center mr-4">
                            <Calendar size={14} className="mr-1" />
                            <span>{formatDate(post.publish_date)}</span>
                          </div>
                          <div className="flex items-center mr-4">
                            <User size={14} className="mr-1" />
                            <span>{post.author}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <ThumbsUp size={14} className="mr-1" />
                              <span>{post.likes || 0}</span>
                            </div>
                            <div className="flex items-center">
                              <MessageCircle size={14} className="mr-1" />
                              <span>{post.comments || 0}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => sharePost(post.post_id, title)}
                              className="p-2"
                            >
                              <Share2 size={14} />
                            </Button>
                            <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700">
                              <Link href={`/blogs/${post.post_id}`}>{language === "ne" ? "पढ्नुहोस्" : "Read More"}</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Load More Button */}
            {blogs.length > 0 && (
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  className="border-orange-600 text-orange-600 hover:bg-orange-50 bg-transparent"
                >
                  {language === "ne" ? "थप पोस्टहरू लोड गर्नुहोस्" : "Load More Posts"}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* Social Media Share Options */}
      <section className="mb-12">
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-4 text-orange-600">
              {language === "ne" ? "हाम्रो सामग्री साझा गर्नुहोस्" : "Share Our Content"}
            </h3>
            <p className="text-gray-700 mb-6">
              {language === "ne"
                ? "सामाजिक सञ्जालमा हाम्रो सामग्री साझा गरेर सनातन धर्मका मूल्यहरू फैलाउन मद्दत गर्नुहोस्।"
                : "Help us spread the word about Sanatan Dharma values by sharing our content on social media."}
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" size="sm" className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700">
                Facebook
              </Button>
              <Button variant="outline" size="sm" className="bg-red-600 text-white border-red-600 hover:bg-red-700">
                YouTube
              </Button>
              <Button variant="outline" size="sm" className="bg-blue-500 text-white border-blue-500 hover:bg-blue-600">
                LinkedIn
              </Button>
              <Button variant="outline" size="sm" className="bg-black text-white border-black hover:bg-gray-800">
                TikTok
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-orange-600">
          {language === "ne" ? "बारम्बार सोधिने प्रश्नहरू" : "Frequently Asked Questions"}
        </h2>
        <PageFAQ pageId="blogs" />
      </section>
    </div>
  )
}
