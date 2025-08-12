"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Calendar, User, Search, Share2, ThumbsUp, MessageCircle } from "lucide-react"
import PageVideo from "@/components/page-video"
import PageFAQ from "@/components/page-faq"

export default function BlogsPage() {
  const blogCategories = [
    {
      id: "press-release",
      name: "Press Release",
      posts: [
        {
          id: 1,
          title: "SDB Nepal Announces New Gurukul Campus in Pokhara",
          excerpt:
            "We are excited to announce the opening of our second Gurukul campus in Pokhara, expanding our traditional education reach.",
          image: "/placeholder.svg?height=200&width=400",
          date: "2024-06-20",
          author: "SDB Nepal Team",
          readTime: "3 min read",
          likes: 45,
          comments: 12,
        },
        {
          id: 2,
          title: "Partnership with International Sanskrit Foundation",
          excerpt:
            "SDB Nepal partners with the International Sanskrit Foundation to promote Sanskrit education globally.",
          image: "/placeholder.svg?height=200&width=400",
          date: "2024-06-15",
          author: "Dr. Ram Prasad Sharma",
          readTime: "5 min read",
          likes: 67,
          comments: 23,
        },
      ],
    },
    {
      id: "past-events",
      name: "Past Events",
      posts: [
        {
          id: 3,
          title: "Highlights from Annual Dharma Conference 2023",
          excerpt:
            "A comprehensive report on our successful annual conference featuring renowned speakers and meaningful discussions.",
          image: "/placeholder.svg?height=200&width=400",
          date: "2024-01-15",
          author: "Event Team",
          readTime: "8 min read",
          likes: 89,
          comments: 34,
        },
        {
          id: 4,
          title: "Sanskrit Competition Results and Celebrations",
          excerpt: "Celebrating the achievements of young Sanskrit scholars in our recent competition.",
          image: "/placeholder.svg?height=200&width=400",
          date: "2024-01-10",
          author: "Cultural Team",
          readTime: "6 min read",
          likes: 56,
          comments: 18,
        },
      ],
    },
    {
      id: "gallery",
      name: "Gallery",
      posts: [
        {
          id: 5,
          title: "Temple Restoration Project - Before and After",
          excerpt: "Visual documentation of our temple restoration efforts in the Kathmandu Valley.",
          image: "/placeholder.svg?height=200&width=400",
          date: "2024-05-30",
          author: "Documentation Team",
          readTime: "4 min read",
          likes: 123,
          comments: 45,
        },
        {
          id: 6,
          title: "Gurukul Student Life - A Photo Journey",
          excerpt: "Capturing the daily life and learning experiences of our Gurukul students.",
          image: "/placeholder.svg?height=200&width=400",
          date: "2024-05-25",
          author: "Photography Team",
          readTime: "5 min read",
          likes: 78,
          comments: 29,
        },
      ],
    },
    {
      id: "voting-polls",
      name: "Voting/Polls",
      posts: [
        {
          id: 7,
          title: "Community Poll: Next Cultural Program Theme",
          excerpt:
            "Help us decide the theme for our upcoming cultural program by participating in this community poll.",
          image: "/placeholder.svg?height=200&width=400",
          date: "2024-06-25",
          author: "Community Team",
          readTime: "2 min read",
          likes: 34,
          comments: 67,
        },
        {
          id: 8,
          title: "Vote for Best Sanskrit Recitation Performance",
          excerpt: "Watch the performances and vote for your favorite Sanskrit recitation from our recent competition.",
          image: "/placeholder.svg?height=200&width=400",
          date: "2024-06-20",
          author: "Cultural Team",
          readTime: "10 min read",
          likes: 91,
          comments: 156,
        },
      ],
    },
    {
      id: "promotions",
      name: "Promotions",
      posts: [
        {
          id: 9,
          title: "Early Bird Registration for Vedic Mathematics Course",
          excerpt: "Register early for our upcoming Vedic Mathematics course and save 30% on registration fees.",
          image: "/placeholder.svg?height=200&width=400",
          date: "2024-06-28",
          author: "Education Team",
          readTime: "3 min read",
          likes: 67,
          comments: 23,
        },
        {
          id: 10,
          title: "Special Membership Drive - Limited Time Offer",
          excerpt: "Join our community with special membership benefits available for a limited time only.",
          image: "/placeholder.svg?height=200&width=400",
          date: "2024-06-22",
          author: "Membership Team",
          readTime: "4 min read",
          likes: 45,
          comments: 19,
        },
      ],
    },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const sharePost = (postId: number, title: string) => {
    // Mock share functionality
    console.log(`Sharing post ${postId}: ${title}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-orange-600">Blogs & Updates</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Stay updated with our latest news, events, and insights from the world of Sanatan Dharma. Share your thoughts
          and engage with our community.
        </p>
      </section>

      {/* Search Bar */}
      <section className="mb-8">
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input type="text" placeholder="Search blogs..." className="pl-10 pr-4 py-2 w-full" />
        </div>
      </section>

      {/* Featured Video */}
      {/* <section className="mb-12">
        <PageVideo videoId="blogs-page-video" />
      </section> */}

      {/* Blog Categories */}
      <section className="mb-12">
        <Tabs defaultValue="press-release" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {blogCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {blogCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-orange-600">{category.name}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                      <Badge className="absolute top-2 right-2 bg-orange-600">{category.name}</Badge>
                    </div>

                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                    </CardHeader>

                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <div className="flex items-center mr-4">
                          <Calendar size={14} className="mr-1" />
                          <span>{formatDate(post.date)}</span>
                        </div>
                        <div className="flex items-center mr-4">
                          <User size={14} className="mr-1" />
                          <span>{post.author}</span>
                        </div>
                        <span>{post.readTime}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <ThumbsUp size={14} className="mr-1" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageCircle size={14} className="mr-1" />
                            <span>{post.comments}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => sharePost(post.id, post.title)}
                            className="p-2"
                          >
                            <Share2 size={14} />
                          </Button>
                          <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700">
                            <Link href={`/blogs/${post.id}`}>Read More</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More Button */}
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  className="border-orange-600 text-orange-600 hover:bg-orange-50 bg-transparent"
                >
                  Load More Posts
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Social Media Share Options */}
      <section className="mb-12">
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-4 text-orange-600">Share Our Content</h3>
            <p className="text-gray-700 mb-6">
              Help us spread the word about Sanatan Dharma values by sharing our content on social media.
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
        <h2 className="text-3xl font-bold mb-6 text-orange-600">Frequently Asked Questions</h2>
        <PageFAQ pageId="blogs" />
      </section>
    </div>
  )
}
