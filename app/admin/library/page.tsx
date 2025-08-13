"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileUpload } from "@/components/ui/file-upload"
import { Search, Download, Plus, BookOpen, Eye, DownloadIcon } from "lucide-react"

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [libraryId] = useState(`library-${Date.now()}`)

  const books = [
    {
      id: "B001",
      title: "श्रीमद्भगवद्गीता",
      author: "व्यास",
      category: "Religious Text",
      language: "Nepali",
      format: "PDF",
      size: "2.5 MB",
      downloads: 1247,
      uploadDate: "2023-01-15",
      status: "Published",
      memberOnly: false,
    },
    {
      id: "B002",
      title: "रामायण",
      author: "महर्षि वाल्मीकि",
      category: "Religious Text",
      language: "Sanskrit",
      format: "PDF",
      size: "5.2 MB",
      downloads: 892,
      uploadDate: "2023-02-20",
      status: "Published",
      memberOnly: true,
    },
    {
      id: "B003",
      title: "योग दर्शन",
      author: "पतञ्जलि",
      category: "Philosophy",
      language: "Nepali",
      format: "EPUB",
      size: "1.8 MB",
      downloads: 456,
      uploadDate: "2023-03-10",
      status: "Published",
      memberOnly: false,
    },
  ]

  const stats = [
    { title: "Total Books", value: "247", icon: BookOpen },
    { title: "Categories", value: "12", icon: BookOpen },
    { title: "Total Downloads", value: "15,847", icon: DownloadIcon },
    { title: "Member Only", value: "89", icon: Eye },
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Library Management</h1>
          <p className="text-muted-foreground">Manage digital books, documents, and resources</p>
        </div>
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Document</DialogTitle>
              <DialogDescription>
                Upload documents, books, and other resources to your library. Supported formats: PDF, Word, EPUB, and more.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <FileUpload
                bucket="library"
                acceptedTypes={[
                  'application/pdf',
                  'application/msword',
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  'application/epub+zip',
                  'text/plain',
                  'video/*',
                  'audio/*'
                ]}
                maxSize={50 * 1024 * 1024} // 50MB
                entityType="library"
                entityId={libraryId}
                usageType="attachment"
                onUploadComplete={(files) => {
                  console.log('Document uploaded:', files)
                  // Refresh library or add to local state
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
                placeholder="Search books..."
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
                <SelectItem value="religious">Religious Text</SelectItem>
                <SelectItem value="philosophy">Philosophy</SelectItem>
                <SelectItem value="history">History</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Books Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book Details</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Format & Size</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{book.title}</div>
                        <div className="text-sm text-muted-foreground">by {book.author}</div>
                        <div className="text-xs text-muted-foreground">
                          {book.language} • Uploaded: {book.uploadDate}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{book.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{book.format}</div>
                        <div className="text-sm text-muted-foreground">{book.size}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{book.downloads.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={book.memberOnly ? "default" : "secondary"}>
                        {book.memberOnly ? "Members Only" : "Public"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(book.status)}>{book.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
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
