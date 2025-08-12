"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Download, Plus, FileText, Eye, Heart, AlertCircle } from "lucide-react"
import { useBlogs } from "@/hooks/use-api"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import Link from "next/link"

interface Blog {
  id: string
  title: string
  content: string
  author: string
  published: boolean
  created_at: string
  updated_at: string
}

export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Explicitly type blogs as Blog[] | null
  const { data: blogs, loading, error, execute: fetchBlogs } = useBlogs()
  const safeBlogs: Blog[] = Array.isArray(blogs) ? blogs : []

  const fetchBlogsCallback = useCallback(() => {
    fetchBlogs()
  }, [fetchBlogs])

  useEffect(() => {
    fetchBlogsCallback()
  }, [fetchBlogsCallback])

  const handleDeleteBlog = async (id: string) => {
    try {
      const result = await apiClient.deleteBlog(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Blog deleted successfully")
        fetchBlogsCallback()
      }
    } catch (error) {
      toast.error("Failed to delete blog")
    }
  }
  // Ensure blogs is treated as Blog[] or an empty array
  const filteredBlogs: Blog[] = safeBlogs.filter((blog: Blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory =
      categoryFilter === "all" ||
      (categoryFilter === "published" && blog.published) ||
      (categoryFilter === "draft" && !blog.published)

    return matchesSearch && matchesCategory
  })
const stats = [
  {
    title: "Total Posts",
    value: safeBlogs.length.toString(),
    icon: FileText,
  },
  {
    title: "Published",
    value: safeBlogs.filter(b => b.published).length.toString(),
    icon: Eye,
  },
  {
    title: "Drafts",
    value: safeBlogs.filter(b => !b.published).length.toString(),
    icon: FileText,
  },
  {
    title: "Total Authors",
    value: safeBlogs.length ? new Set(safeBlogs.map(b => b.author)).size.toString() : "0",
    icon: Heart,
  },
]

  const getStatusColor = (published: boolean) =>
    published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load blogs: {error}</AlertDescription>
        </Alert>
        <Button onClick={fetchBlogs} variant="outline">
          Retry
        </Button>
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
        {stats.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
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
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
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
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loading skeletons
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-3 w-[300px]" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[80px] rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Skeleton className="h-8 w-[60px]" />
                          <Skeleton className="h-8 w-[60px]" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredBlogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchTerm || categoryFilter !== "all"
                          ? "No blogs match your filters"
                          : "No blogs found"}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBlogs.map(blog => (
                    <TableRow key={blog.id}>
                      <TableCell>
                        <div>
                          <div className="flex items-center">
                            <div className="font-medium">{blog.title}</div>
                            {blog.published && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Published
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {blog.content.substring(0, 100)}...
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Last updated: {formatDate(blog.updated_at)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{blog.author}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(blog.published)}>
                          {blog.published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(blog.created_at)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="text-red-600 hover:text-red-700"
                          >
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
