"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, User } from "lucide-react"

interface BlogPost {
  id: string
  title_en?: string
  excerpt_en?: string
  content_en?: string
  author_name?: string
  published_date?: string
  featured_image_url?: string
  is_featured: boolean
}

export default function LatestBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch("/api/blogs?limit=3&published=true")
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            setBlogs(result.data)
          }
        }
      } catch (error) {
        console.warn("Error fetching latest blogs:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const truncateText = (maxLength: number, text?: string) => {
    if (!text) return ""
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Blogs</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Blogs</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Read our latest articles on Sanatan Dharma and spirituality
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No blog posts available</h3>
            <p className="text-gray-500">Check back soon for new articles</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gradient-to-r from-purple-100 to-pink-100">
                  {blog.featured_image_url ? (
                    <img
                      src={blog.featured_image_url}
                      alt={blog.title_en || ""}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-purple-600" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{blog.title_en || ""}</CardTitle>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {truncateText(120, blog.excerpt_en)}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>{blog.author_name || "Unknown"}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(blog.published_date)}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <a href={`/blogs/${blog.id}`}>Read More</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button variant="outline" asChild>
            <a href="/blogs">View All Blogs</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
