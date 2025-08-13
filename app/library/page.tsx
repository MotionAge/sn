"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, BookOpen, FileText, ImageIcon, Video, Music, Lock, Unlock } from "lucide-react"
import { useApi } from "@/hooks/use-api"
import { apiClient } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"

interface LibraryItem {
  id: string
  title: string
  description: string
  type: string
  file_url: string
  thumbnail_url: string
  is_free: boolean
  category: string
  language: string
  file_size: string
  download_count: number
  created_at: string
  is_active: boolean
}

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Mock login state
  const { data: libraryItems, loading, error, execute: fetchLibrary } = useApi(apiClient.getLibrary)

  useEffect(() => {
    fetchLibrary()
  }, [fetchLibrary])

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-6 w-6" />
      case 'image':
        return <ImageIcon className="h-6 w-6" />
      case 'video':
        return <Video className="h-6 w-6" />
      case 'audio':
        return <Music className="h-6 w-6" />
      default:
        return <BookOpen className="h-6 w-6" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'bg-red-100 text-red-800'
      case 'image':
        return 'bg-blue-100 text-blue-800'
      case 'video':
        return 'bg-purple-100 text-purple-800'
      case 'audio':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !libraryItems) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Unable to load library content</p>
        <Button onClick={fetchLibrary} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  // Filter only active items
  const activeItems = (Array.isArray(libraryItems) ? libraryItems : []).filter((item: LibraryItem) => item.is_active)

  if (activeItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No library content available</p>
      </div>
    )
  }

  // Group items by category
  const groupedItems = activeItems.reduce((acc: Record<string, LibraryItem[]>, item: LibraryItem) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {})

  const categories = Object.keys(groupedItems)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Digital Library</h1>
          <p className="text-muted-foreground">Access our collection of sacred texts, publications, and multimedia resources</p>
        </div>
        <Button variant="outline">
          <BookOpen className="h-4 w-4 mr-2" />
          Browse All
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Input
          placeholder="Search library resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      </div>

      {/* Library Content */}
      <Tabs defaultValue={categories[0] || "all"} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedItems[category]
                .filter((item: LibraryItem) =>
                  item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((item: LibraryItem) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={item.thumbnail_url || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className={getTypeColor(item.type)}>
                          {item.type.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="absolute top-2 left-2">
                        {item.is_free ? (
                          <Unlock className="h-5 w-5 text-green-600 bg-white rounded p-1" />
                        ) : (
                          <Lock className="h-5 w-5 text-orange-600 bg-white rounded p-1" />
                        )}
                      </div>
                    </div>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-bold mb-2 text-gray-800">{item.title}</h3>
                      <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          {getTypeIcon(item.type)}
                          <span className="ml-2">{item.type.toUpperCase()}</span>
                        </div>
                        <div>Size: {item.file_size}</div>
                        <div>Downloads: {item.download_count}</div>
                        <div>Language: {item.language}</div>
                      </div>
                    </CardContent>
                    <div className="px-6 pb-6">
                      <Button 
                        className="w-full" 
                        variant={item.is_free ? "default" : "outline"}
                        disabled={!item.is_free && !isLoggedIn}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {item.is_free ? "Download" : "Login to Download"}
                      </Button>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
