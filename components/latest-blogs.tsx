"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useApi } from "@/hooks/use-api"
import { apiClient } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"

interface Blog {
  id: string
  title: string
  excerpt: string
  content: string
  image_url: string
  author: string
  category: string
  published: boolean
  created_at: string
  updated_at: string
}

export default function LatestBlogs() {
  const { data: blogs, loading, error, execute: fetchBlogs } = useApi(apiClient.getBlogs)

  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="relative h-48">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="pt-6">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !blogs) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Unable to load blogs</p>
        <button 
          onClick={fetchBlogs}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          Retry
        </button>
      </div>
    )
  }

  // Filter only published blogs and get the latest 4
  const publishedBlogs = (Array.isArray(blogs) ? blogs : [])
    .filter((blog: Blog) => blog.published)
    .sort((a: Blog, b: Blog) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4)

  if (publishedBlogs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No blog posts available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {publishedBlogs.map((blog: Blog) => (
        <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-48">
            <Image 
              src={blog.image_url || "/placeholder.svg"} 
              alt={blog.title} 
              fill 
              className="object-cover" 
            />
          </div>
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">
              {blog.title}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {blog.excerpt || blog.content.substring(0, 150)}...
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>{formatDate(blog.created_at)}</span>
              </div>
              <div className="flex items-center">
                <User size={16} className="mr-1" />
                <span>{blog.author}</span>
              </div>
            </div>
            <div className="mt-4">
              <Link
                href={`/blogs/${blog.id}`}
                className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
              >
                Read More →
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
