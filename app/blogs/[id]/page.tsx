"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Eye, Share2, ArrowLeft, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"

interface Blog {
  id: string
  title_en: string
  title_ne: string
  content_en: string
  content_ne: string
  excerpt_en?: string
  excerpt_ne?: string
  featured_image?: string
  gallery_images?: string[]
  categories: string[]
  tags: string[]
  author: string
  status: string
  views: number
  created_at: string
  updated_at: string
}

export default function BlogDetailPage() {
  const params = useParams()
  const { language } = useTranslation()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await fetch(`/api/blogs/${params.id}`)

        if (!response.ok) {
          throw new Error("Blog not found")
        }

        const data = await response.json()
        setBlog(data.data)
      } catch (err: any) {
        setError(err.message || "Failed to load blog")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchBlog()
    }
  }, [params.id])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title:  blog?.title_en,
          text:  blog?.excerpt_en,
          // title: language === "ne" ? blog?.title_ne : blog?.title_en,
          // text: language === "ne" ? blog?.excerpt_ne : blog?.excerpt_en,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error || "Blog not found"}</AlertDescription>
        </Alert>
        <div className="mt-6">
          <Link href="/blogs">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // const title = language === "ne" ? blog.title_ne : blog.title_en
  // const content = language === "ne" ? blog.content_ne : blog.content_en
  const title =  blog.title_en
  const content =  blog.content_en

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/blogs">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Button>
        </Link>
      </div>

      <article className="max-w-4xl mx-auto">
        {/* Featured Image */}
        {blog.featured_image && (
          <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
            <Image src={blog.featured_image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          </div>
        )}

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">{title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {blog.author}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(blog.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {blog.views} views
            </div>
          </div>

          {/* Categories and Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.categories.map((category) => (
              <Badge key={category} className="bg-orange-600 text-white">
                {category}
              </Badge>
            ))}
            {blog.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Share Button */}
          <Button onClick={handleShare} variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </header>

        {/* Content */}
        <Card>
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
          </CardContent>
        </Card>

        {/* Gallery */}
        {blog.gallery_images && blog.gallery_images.length > 0 && (
          <section className="mt-8">
            <h3 className="text-2xl font-bold mb-4">Gallery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blog.gallery_images.map((image, index) => (
                <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => window.open(image, "_blank")}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  )
}
