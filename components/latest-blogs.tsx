import Image from "next/image"
import Link from "next/link"
import { Calendar, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

// Mock data - would come from CMS in production
const blogs = [
  {
    id: 1,
    title: "The Importance of Vedic Education in Modern Times",
    excerpt: "Exploring how ancient Vedic knowledge remains relevant in today's fast-paced world.",
    image: "/placeholder.svg?height=200&width=400",
    date: "2024-06-15",
    author: "Dr. Ramesh Sharma",
    category: "Education",
    url: "/blogs/vedic-education-modern-times",
  },
  {
    id: 2,
    title: "Celebrating Dashain: Traditions and Significance",
    excerpt: "A deep dive into Nepal's most important festival and its cultural significance.",
    image: "/placeholder.svg?height=200&width=400",
    date: "2024-06-10",
    author: "Sita Adhikari",
    category: "Culture",
    url: "/blogs/celebrating-dashain",
  },
  {
    id: 3,
    title: "Report: Annual Sanskrit Conference 2024",
    excerpt: "Highlights from our annual Sanskrit conference featuring scholars from across South Asia.",
    image: "/placeholder.svg?height=200&width=400",
    date: "2024-06-05",
    author: "Hari Prasad",
    category: "Events",
    url: "/blogs/sanskrit-conference-2024",
  },
  {
    id: 4,
    title: "The Philosophy of Karma: Understanding Cause and Effect",
    excerpt: "Exploring the profound concept of Karma and its application in daily life.",
    image: "/placeholder.svg?height=200&width=400",
    date: "2024-05-28",
    author: "Dr. Anita Joshi",
    category: "Philosophy",
    url: "/blogs/philosophy-of-karma",
  },
]

export default function LatestBlogs() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {blogs.map((blog) => (
        <Link key={blog.id} href={blog.url} className="block">
          <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
            <div className="flex flex-col md:flex-row h-full">
              <div className="relative h-48 md:h-auto md:w-1/3">
                <Image src={blog.image || "/placeholder.svg"} alt={blog.title} fill className="object-cover" />
                <div className="absolute top-2 left-2 bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded">
                  {blog.category}
                </div>
              </div>
              <CardContent className="flex-1 p-4 md:p-6">
                <h3 className="text-lg font-bold mb-2 text-gray-800 line-clamp-2">{blog.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
                <div className="flex items-center text-sm text-gray-500 mt-auto">
                  <div className="flex items-center mr-4">
                    <Calendar size={14} className="mr-1" />
                    <span>{formatDate(blog.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <User size={14} className="mr-1" />
                    <span>{blog.author}</span>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
