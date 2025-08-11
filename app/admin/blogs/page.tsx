"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Plus, FileText, Eye, Heart, MessageCircle, Share } from "lucide-react"

export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const blogs = [
    {
      id: "BL001",
      title: "गीता जयन्ती महोत्सवको तयारी",
      excerpt: "यस वर्षको गीता जयन्ती महोत्सवका लागि विशेष तयारी भइरहेको छ...",
      author: "Admin",
      category: "Events",
      publishDate: "2024-01-15",
      status: "Published",
      views: 1247,
      likes: 89,
      comments: 23,
      shares: 45,
      featured: true,
    },
    {
      id: "BL002",
      title: "नयाँ सदस्यता योजना सुरु",
      excerpt: "संस्थाले नयाँ सदस्यता योजना सुरु गरेको छ जसमा विशेष छुट...",
      author: "Admin",
      category: "Press Release",
      publishDate: "2024-01-10",
      status: "Published",
      views: 892,
      likes: 67,
      comments: 12,
      shares: 28,
      featured: false,
    },
    {
      id: "BL003",
      title: "योग कक्षाको फोटो संग्रह",
      excerpt: "गत हप्ता आयोजित योग कक्षाका केही सुन्दर तस्बिरहरू...",
      author: "Editor",
      category: "Gallery",
      publishDate: "2024-01-08",
      status: "Draft",
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      featured: false,
    },
  ]

  const stats = [
    { title: "Total Posts", value: "147", icon: FileText },
    { title: "Published", value: "132", icon: Eye },
    { title: "Total Views", value: "25,847", icon: Eye },
    { title: "Engagement", value: "4.2k", icon: Heart },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800"
      case "Draft":
        return "bg-yellow-100 text-yellow-800"
      case "Review":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Events":
        return "bg-blue-100 text-blue-800"
      case "Press Release":
        return "bg-green-100 text-green-800"
      case "Gallery":
        return "bg-purple-100 text-purple-800"
      case "Polls":
        return "bg-orange-100 text-orange-800"
      case "Promotions":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="text-muted-foreground">Create and manage blog posts, news, and announcements</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
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
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="press">Press Release</SelectItem>
                <SelectItem value="gallery">Gallery</SelectItem>
                <SelectItem value="polls">Polls</SelectItem>
                <SelectItem value="promotions">Promotions</SelectItem>
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
                {blogs.map((blog) => (
                  <TableRow key={blog.id}>
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
                        <div className="text-sm text-muted-foreground mt-1">{blog.excerpt}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          by {blog.author} • {blog.publishDate}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(blog.category)}>{blog.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Eye className="h-3 w-3 mr-1" />
                          {blog.views.toLocaleString()}
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Heart className="h-3 w-3 mr-1" />
                            {blog.likes}
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            {blog.comments}
                          </span>
                          <span className="flex items-center">
                            <Share className="h-3 w-3 mr-1" />
                            {blog.shares}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(blog.status)}>{blog.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
