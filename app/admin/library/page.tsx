"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Download, Plus, BookOpen, Eye, DownloadIcon, Edit, Trash2, Loader2 } from "lucide-react"

interface LibraryItem {
  id: number
  title: string
  description: string
  category: string
  type: string
  file_url: string
  thumbnail_url?: string
  file_size: string
  is_free: boolean
  download_count: number
  tags: string[]
  created_at: string
}

export default function LibraryPage() {
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)

  const stats = [
    { title: "Total Books", value: libraryItems.length.toString(), icon: BookOpen },
    { title: "Categories", value: new Set(libraryItems.map((item) => item.category)).size.toString(), icon: BookOpen },
    {
      title: "Total Downloads",
      value: libraryItems.reduce((sum, item) => sum + item.download_count, 0).toString(),
      icon: DownloadIcon,
    },
    { title: "Free Items", value: libraryItems.filter((item) => item.is_free).length.toString(), icon: Eye },
  ]

  useEffect(() => {
    fetchLibraryItems()
  }, [searchTerm, categoryFilter])

  const fetchLibraryItems = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (categoryFilter !== "all") params.append("category", categoryFilter)

      const response = await fetch(`/api/library?${params}`)
      if (response.ok) {
        const data = await response.json()
        setLibraryItems(data.items || [])
      } else {
        console.error("Failed to fetch library items")
      }
    } catch (error) {
      console.error("Error fetching library items:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (itemId: number) => {
    if (!confirm("Are you sure you want to delete this library item?")) return

    try {
      setDeleteLoading(itemId)
      const response = await fetch(`/api/library/${itemId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setLibraryItems(libraryItems.filter((item) => item.id !== itemId))
      } else {
        alert("Failed to delete library item")
      }
    } catch (error) {
      console.error("Error deleting library item:", error)
      alert("Failed to delete library item")
    } finally {
      setDeleteLoading(null)
    }
  }

  const getStatusColor = (isPublished: boolean) => {
    return isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return "📄"
      case "image":
        return "🖼️"
      case "audio":
        return "🎵"
      case "video":
        return "🎥"
      default:
        return "📄"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredItems = libraryItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Library Management</h1>
          <p className="text-muted-foreground">Manage digital books, documents, and resources</p>
        </div>
        <Button asChild>
          <Link href="/admin/library/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Link>
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

      {/* Library Management */}
      <Card>
        <CardHeader>
          <CardTitle>Digital Library</CardTitle>
          <CardDescription>Manage books, documents, and digital resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search library items..."
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
                <SelectItem value="sanatan-gallery">Sanatan Gallery</SelectItem>
                <SelectItem value="publications">Publications</SelectItem>
                <SelectItem value="bhajans">Bhajans</SelectItem>
                <SelectItem value="puran-saptaha">Puran/Saptaha</SelectItem>
                <SelectItem value="completion-reports">Reports</SelectItem>
                <SelectItem value="annual-budget">Budget</SelectItem>
                <SelectItem value="assembly-elections">Assembly</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading library items...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No library items found.</p>
              <Button asChild className="mt-4">
                <Link href="/admin/library/new">Add your first library item</Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Details</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type & Size</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Access</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                            {item.thumbnail_url ? (
                              <Image
                                src={item.thumbnail_url || "/placeholder.svg"}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-2xl">{getTypeIcon(item.type)}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium line-clamp-1">{item.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-2">{item.description}</div>
                            {item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {item.tags.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{item.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {item.category.replace("-", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium capitalize">{item.type}</div>
                          <div className="text-sm text-muted-foreground">{item.file_size}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{item.download_count.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.is_free ? "secondary" : "default"}>
                          {item.is_free ? "Free" : "Premium"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(item.created_at)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedItem(item)}>
                                <Eye className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{selectedItem?.title}</DialogTitle>
                                <DialogDescription>Library Item Details</DialogDescription>
                              </DialogHeader>
                              {selectedItem && (
                                <div className="space-y-4">
                                  {selectedItem.thumbnail_url && (
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                      <Image
                                        src={selectedItem.thumbnail_url || "/placeholder.svg"}
                                        alt={selectedItem.title}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <h4 className="font-medium mb-2">Description</h4>
                                    <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Category:</span>{" "}
                                      {selectedItem.category.replace("-", " ")}
                                    </div>
                                    <div>
                                      <span className="font-medium">Type:</span> {selectedItem.type.toUpperCase()}
                                    </div>
                                    <div>
                                      <span className="font-medium">File Size:</span> {selectedItem.file_size}
                                    </div>
                                    <div>
                                      <span className="font-medium">Downloads:</span> {selectedItem.download_count}
                                    </div>
                                    <div>
                                      <span className="font-medium">Access:</span>{" "}
                                      {selectedItem.is_free ? "Free" : "Premium"}
                                    </div>
                                    <div>
                                      <span className="font-medium">Added:</span> {formatDate(selectedItem.created_at)}
                                    </div>
                                  </div>
                                  {selectedItem.tags.length > 0 && (
                                    <div>
                                      <h4 className="font-medium mb-2">Tags</h4>
                                      <div className="flex flex-wrap gap-2">
                                        {selectedItem.tags.map((tag) => (
                                          <Badge key={tag} variant="outline">
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/admin/library/edit/${item.id}`}>
                              <Edit className="h-3 w-3" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            disabled={deleteLoading === item.id}
                          >
                            {deleteLoading === item.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
