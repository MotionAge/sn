"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Eye } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface Blog {
  id: string
  title_en: string
  title_ne: string
  excerpt_en?: string
  excerpt_ne?: string
  featured_image?: string
  categories: string[]
  author: string
  views: number
  created_at: string
  status: string
}

export default function LatestBlogs() {
  const { language } = useTranslation()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch("/api/blogs?status=published&limit=3")
        if (response.ok) {
          const data = await response.json()
          setBlogs(data.data || [])
        }
      } catch (error) {
        console.error("Error fetching latest blogs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg" />
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (blogs.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No blog posts available at the moment.</p>
          <p className="text-sm text-gray-500 mt-2">Check back soon for new content!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => {
        const title = language === "ne" ? blog.title_ne : blog.title_en
        const excerpt = language === "ne" ? blog.excerpt_ne : blog.excerpt_en

        return (
          <Card key={blog.id} className="hover:shadow-lg transition-shadow">
            <div className="relative h-48 overflow-hidden rounded-t-lg">
              <Image
                src={blog.featured_image || "/placeholder.svg?height=200&width=400&text=Blog+Image"}
                alt={title}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2">
                {blog.categories.length > 0 && <Badge className="bg-blue-600 text-white">{blog.categories[0]}</Badge>}
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              {excerpt && <p className="text-gray-600 text-sm mb-4 line-clamp-3">{excerpt}</p>}

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{blog.views}</span>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                <span>{new Date(blog.created_at).toLocaleDateString()}</span>
              </div>

              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href={`/blogs/${blog.id}`}>Read More</Link>
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
