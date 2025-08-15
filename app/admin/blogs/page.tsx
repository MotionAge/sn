"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Plus, FileText, Eye, Heart, MessageCircle, Share, Edit, Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
  created_at: string
}

export default function BlogsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalPosts: 0,
    published: 0,
    totalViews: 0,
    engagement: 0,
  })

  useEffect(() => {
    fetchBlogs()
  }, [categoryFilter, statusFilter, searchTerm])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (categoryFilter !== "all") params.append("category", categoryFilter)
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (searchTerm) params.append("search", searchTerm)

      const response = await fetch(`/api/blogs?${params}`)
      if (!response.ok) throw new Error("Failed to fetch blogs")

      const result = await response.json()
      const blogData = result.data || []
      setBlogs(blogData)

      // Calculate stats
      const totalPosts = blogData.length
      const published = blogData.filter((blog: BlogPost) => blog.status === "published").length
      const totalViews = blogData.reduce((sum: number, blog: BlogPost) => sum + (blog.views || 0), 0)
      const engagement = blogData.reduce(
        (sum: number, blog: BlogPost) => sum + (blog.likes || 0) + (blog.comments || 0) + (blog.shares || 0),
        0,
      )

      setStats({ totalPosts, published, totalViews, engagement })
    } catch (error) {
      console.error("Error fetching blogs:", error)
      toast({
        title: "Error",
        description: "Failed to fetch blog posts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteBlog = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    try {
      setDeleting(postId)
      const response = await fetch(`/api/blogs/${postId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete blog post")

      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      })

      fetchBlogs()
    } catch (error) {
      console.error("Error deleting blog:", error)
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      })
    } finally {
      setDeleting(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "review":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "press-release":
        return "bg-green-100 text-green-800"
      case "past-events":
        return "bg-blue-100 text-blue-800"
      case "gallery":
        return "bg-purple-100 text-purple-800"
      case "voting-polls":
        return "bg-orange-100 text-orange-800"
      case "promotions":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="text-muted-foreground">Create and manage blog posts, news, and announcements</p>
        </div>
        <Button asChild>
          <Link href="/admin/blogs/new">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.engagement.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Blog Management */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>Manage all blog posts, news, and announcements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="press-release">Press Release</SelectItem>
                <SelectItem value="past-events">Past Events</SelectItem>
                <SelectItem value="gallery">Gallery</SelectItem>
                <SelectItem value="voting-polls">Voting/Polls</SelectItem>
                <SelectItem value="promotions">Promotions</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="review">Review</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Posts Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post Details</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No blog posts found</p>
                        <p className="text-sm">Create your first blog post to get started</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  blogs.map((blog) => (
                    <TableRow key={blog.post_id}>
                      <TableCell>
                        <div>
                          <div className="flex items-center">
                            <div className="font-medium">{blog.title}</div>
                            {blog.featured && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{blog.excerpt}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            by {blog.author} • {new Date(blog.publish_date).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(blog.category)}>
                          {blog.category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Eye className="h-3 w-3 mr-1" />
                            {(blog.views || 0).toLocaleString()}
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <Heart className="h-3 w-3 mr-1" />
                              {blog.likes || 0}
                            </span>
                            <span className="flex items-center">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              {blog.comments || 0}
                            </span>
                            <span className="flex items-center">
                              <Share className="h-3 w-3 mr-1" />
                              {blog.shares || 0}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(blog.status)}>
                          {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/blogs/edit/${blog.post_id}`}>
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteBlog(blog.post_id)}
                            disabled={deleting === blog.post_id}
                            className="text-red-600 hover:text-red-700"
                          >
                            {deleting === blog.post_id ? (
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3 mr-1" />
                            )}
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
