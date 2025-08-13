"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileUpload } from "@/components/ui/file-upload"
import { Search, Upload, ImageIcon, Video, Eye, Download, Trash2 } from "lucide-react"
import Image from "next/image"

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [galleryId] = useState(`gallery-${Date.now()}`)

  const mediaItems = [
    {
      id: "G001",
      title: "गीता जयन्ती महोत्सव २०२४",
      type: "image",
      url: "/placeholder.svg?height=200&width=300",
      uploadDate: "2024-01-15",
      size: "2.5 MB",
      views: 1247,
      downloads: 89,
      category: "Events",
      status: "Published",
    },
    {
      id: "G002",
      title: "योग कक्षा - पोखरा",
      type: "image",
      url: "/placeholder.svg?height=200&width=300",
      uploadDate: "2024-01-10",
      size: "1.8 MB",
      views: 892,
      downloads: 45,
      category: "Activities",
      status: "Published",
    },
    {
      id: "G003",
      title: "धार्मिक प्रवचन भिडियो",
      type: "video",
      url: "/placeholder.svg?height=200&width=300",
      uploadDate: "2024-01-08",
      size: "125 MB",
      views: 2156,
      downloads: 234,
      category: "Lectures",
      status: "Published",
    },
  ]

  const stats = [
    { title: "Total Media", value: "347", icon: ImageIcon },
    { title: "Images", value: "289", icon: ImageIcon },
    { title: "Videos", value: "58", icon: Video },
    { title: "Total Views", value: "45,847", icon: Eye },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "image":
        return "bg-blue-100 text-blue-800"
      case "video":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gallery Management</h1>
          <p className="text-muted-foreground">Manage photos, videos, and media content</p>
        </div>
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Upload Media Files</DialogTitle>
              <DialogDescription>
                Upload multiple images and videos to your gallery. Files will be automatically organized and optimized.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <FileUpload
                bucket="gallery"
                multiple
                maxFiles={20}
                entityType="gallery"
                entityId={galleryId}
                usageType="gallery"
                onUploadComplete={(files) => {
                  console.log('Files uploaded:', files)
                  // Refresh gallery or add to local state
                  setIsUploadModalOpen(false)
                }}
                onUploadError={(error) => {
                  console.error('Upload failed:', error)
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
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

      {/* Gallery Management */}
      <Card>
        <CardHeader>
          <CardTitle>Media Gallery</CardTitle>
          <CardDescription>Manage all photos, videos, and media files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative aspect-video">
                  <Image src={item.url || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                  <div className="absolute top-2 right-2">
                    <Badge className={getTypeColor(item.type)}>
                      {item.type === "image" ? (
                        <ImageIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <Video className="h-3 w-3 mr-1" />
                      )}
                      {item.type}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">{item.title}</h3>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{item.uploadDate}</span>
                      <span>{item.size}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {item.views.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <Download className="h-3 w-3 mr-1" />
                        {item.downloads}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
